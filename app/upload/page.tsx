"use client";

import { Button, Card, CardContent, FileDropZone } from "@/components/ui";
import {
  AlertCircle,
  CheckCircle,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { uploadCSV } from "./actions";
import { CSV_TEMPLATE_HEADERS } from "./constants";
import { DownloadTemplateButton } from "./components/DownloadTemplateButton";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const router = useRouter();

  const validateFile = (selectedFile: File) => {
    if (
      selectedFile.type === "text/csv" ||
      selectedFile.name.endsWith(".csv")
    ) {
      return true;
    }
    return false;
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setUploadStatus({ type: null, message: "" });
  };

  const handleFileRemove = () => {
    setFile(null);
    setUploadStatus({ type: null, message: "" });
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus({ type: null, message: "" });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadCSV(formData);

      if (result.success) {
        setUploadStatus({
          type: "success",
          message: `Successfully imported ${result.clientsCount} clients and ${result.campaignsCount} campaigns!`,
        });
        setFile(null);
        // Redirect to dashboard after successful upload
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500); // Small delay to show success message
      } else {
        setUploadStatus({
          type: "error",
          message: result.error || "Failed to upload and process CSV file",
        });
      }
    } catch {
      setUploadStatus({
        type: "error",
        message: "An error occurred while uploading the file",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Data Upload</h1>
        <DownloadTemplateButton templateContent={CSV_TEMPLATE_HEADERS} />
      </div>

      {/* Drag and Drop Upload Section */}
      <Card>
        <CardContent className="p-6">
          <FileDropZone
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            accept=".csv"
            validateFile={validateFile}
            disabled={isUploading}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-muted">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground mb-2">
                  Upload CSV File
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your CSV file here, or click to browse
                </p>
              </div>
            </div>
          </FileDropZone>

          {uploadStatus.type && (
            <div
              className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
                uploadStatus.type === "success"
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              {uploadStatus.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">
                {uploadStatus.message}
              </span>
            </div>
          )}
        </CardContent>

        <div className="px-6 pb-6 flex justify-center">
          <Button
            onClick={handleUpload}
            disabled={isUploading || !file}
            className="w-auto px-12"
            size="lg"
          >
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload & Process CSV
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
