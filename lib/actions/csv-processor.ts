import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";
import {
  parseDate,
  parseBudget,
  parseNumeric,
  parseFloatValue,
  mapStatus,
} from "@/lib/utils";

export interface CSVRecord {
  campaign_id: string;
  campaign_name: string;
  client_name: string;
  start_date: string;
  end_date: string;
  budget: string;
  channel: string;
  impressions: string;
  clicks: string;
  conversions: string;
  revenue_generated: string;
  target_audience: string;
  status: string;
}

export interface IngestionResult {
  success: boolean;
  clientsCount: number;
  campaignsCount: number;
  message: string;
  error?: string;
}

export async function processCSVData(csvText: string): Promise<IngestionResult> {
  try {
    // Parse CSV data
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CSVRecord[];

    // Filter out empty rows
    const validRecords = records.filter(
      (record: CSVRecord) =>
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
    const clientMap = new Map<string, string>(); // client name -> client id
    let clientsCount = 0;
    let campaignsCount = 0;

    // First, create all unique clients using batch operations
    const uniqueClients = [
      ...new Set(validRecords.map((record: CSVRecord) => record.client_name)),
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
      clientId: clientMap.get(record.client_name)!,
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
