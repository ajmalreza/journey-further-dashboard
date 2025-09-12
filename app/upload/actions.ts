"use server";

import { processCSVData } from "@/lib/actions/csv-processor";
import { revalidatePath } from "next/cache";

export async function uploadCSV(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { 
        success: false, 
        clientsCount: 0,
        campaignsCount: 0,
        error: "No file provided" 
      };
    }

    // Read the CSV file
    const csvText = await file.text();

    const result = await processCSVData(csvText);
    
    // If upload was successful, revalidate the dashboard
    if (result.success) {
      revalidatePath("/dashboard");
    }
    
    return result;
  } catch (error) {
    console.error("Error processing CSV:", error);
    return {
      success: false,
      clientsCount: 0,
      campaignsCount: 0,
      error: "Failed to process CSV file"
    };
  }
}
