import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

function parseDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return null;
  
  // Handle different date formats
  const formats = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
  ];
  
  let date;
  if (formats[0].test(dateStr)) {
    date = new Date(dateStr);
  } else if (formats[1].test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    date = new Date(dateStr);
  }
  
  return isNaN(date.getTime()) ? null : date;
}

function parseBudget(budgetStr) {
  if (!budgetStr || budgetStr.trim() === '') return 0;
  const cleaned = budgetStr.replace(/[$,]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

function parseNumeric(value) {
  if (!value || value.trim() === '' || value.toLowerCase() === 'n/a') return null;
  const cleaned = value.replace(/,/g, '');
  const parsed = parseInt(cleaned);
  return isNaN(parsed) ? null : parsed;
}

function parseFloatValue(value) {
  if (!value || value.trim() === '' || value.toLowerCase() === 'n/a') return null;
  const cleaned = value.replace(/,/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

function mapStatus(status) {
  const normalized = status.toLowerCase().trim();
  if (normalized === 'completed') return 'Completed';
  if (normalized === 'active') return 'Active';
  if (normalized === 'planned') return 'Planned';
  return 'Planned'; // default
}

// Main CSV processing function
async function processCSVData(csvText) {
  try {
    // Parse CSV data
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Filter out empty rows
    const validRecords = records.filter(
      (record) =>
        record.campaign_id && record.campaign_name && record.client_name
    );

    if (validRecords.length === 0) {
      return {
        success: false,
        clientsCount: 0,
        campaignsCount: 0,
        message: "No valid records found in CSV",
        error: "No valid records found in CSV"
      };
    }

    // Process data and create clients and campaigns
    const clientMap = new Map(); // client name -> client id
    let clientsCount = 0;
    let campaignsCount = 0;

    // First, create all unique clients using batch operations
    const uniqueClients = [
      ...new Set(validRecords.map((record) => record.client_name)),
    ];

    // Use createMany with skipDuplicates for better performance
    try {
      await prisma.client.createMany({
        data: uniqueClients.map((name) => ({ name })),
        skipDuplicates: true,
      });

      // Fetch all clients to build the map
      const clients = await prisma.client.findMany({
        where: { name: { in: uniqueClients } },
        select: { id: true, name: true },
      });

      clients.forEach((client) => {
        clientMap.set(client.name, client.id);
      });

      clientsCount = clients.length;
    } catch (error) {
      console.error("Error creating clients:", error);
      return {
        success: false,
        clientsCount: 0,
        campaignsCount: 0,
        message: "Failed to create clients",
        error: "Failed to create clients"
      };
    }

    // Prepare campaign data for batch operations
    const campaignData = validRecords.map((record) => ({
      campaign_id: record.campaign_id,
      campaign_name: record.campaign_name,
      start_date: parseDate(record.start_date),
      end_date: parseDate(record.end_date),
      budget: parseBudget(record.budget),
      channel: record.channel || "",
      impressions: parseNumeric(record.impressions),
      clicks: parseNumeric(record.clicks),
      conversions: parseNumeric(record.conversions),
      revenue_generated: parseFloatValue(record.revenue_generated),
      target_audience: record.target_audience || "",
      status: mapStatus(record.status),
      clientId: clientMap.get(record.client_name),
    }));

    // Use createMany with skipDuplicates for campaigns
    try {
      await prisma.campaign.createMany({
        data: campaignData,
        skipDuplicates: true,
      });

      campaignsCount = campaignData.length;
    } catch (error) {
      console.error("Error creating campaigns:", error);
      return {
        success: false,
        clientsCount,
        campaignsCount: 0,
        message: "Failed to create campaigns",
        error: "Failed to create campaigns"
      };
    }

    return {
      success: true,
      clientsCount,
      campaignsCount,
      message: `Successfully imported ${clientsCount} clients and ${campaignsCount} campaigns`,
    };
  } catch (error) {
    console.error("Error processing CSV:", error);
    return {
      success: false,
      clientsCount: 0,
      campaignsCount: 0,
      message: "Failed to process CSV file",
      error: "Failed to process CSV file"
    };
  }
}

async function ingestData() {
  try {
    console.log('🚀 Starting data ingestion...');
    
    // Read CSV file
    const csvPath = join(process.cwd(), 'data.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    
    console.log(`📊 Reading CSV file from: ${csvPath}`);
    
    // Process the CSV data using the shared function
    const result = await processCSVData(csvContent);
    
    if (result.success) {
      console.log('\n📊 Ingestion Summary:');
      console.log(`  ✅ Clients processed: ${result.clientsCount}`);
      console.log(`  ✅ Campaigns processed: ${result.campaignsCount}`);
      console.log(`  📝 Message: ${result.message}`);
      
      // Additional verification
      try {
        const totalClients = await prisma.client.count();
        const totalCampaigns = await prisma.campaign.count();
        const campaignsWithClients = await prisma.campaign.count({
          where: { 
            clientId: { 
              not: "" 
            } 
          }
        });
        
        console.log('\n🔍 Data Verification:');
        console.log(`  👥 Total clients in database: ${totalClients}`);
        console.log(`  📈 Total campaigns in database: ${totalCampaigns}`);
        console.log(`  🔗 Campaigns with valid client relations: ${campaignsWithClients}`);
        
        if (campaignsWithClients === totalCampaigns) {
          console.log('  ✅ All campaigns have valid client relations');
        } else {
          console.log('  ⚠️  Some campaigns are missing client relations');
        }
        
        console.log('\n🎉 Data ingestion completed successfully!');
      } finally {
        await prisma.$disconnect();
      }
    } else {
      console.error('❌ Data ingestion failed:', result.error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Error during data ingestion:', error);
    process.exit(1);
  }
}

// Run the ingestion if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  ingestData().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { ingestData };