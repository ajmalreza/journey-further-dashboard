import { readFileSync } from 'fs';
import { join } from 'path';
import { processCSVData } from '@/lib/actions/csv-processor';
import { prisma } from '@/lib/prisma';

async function ingestData(): Promise<void> {
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
