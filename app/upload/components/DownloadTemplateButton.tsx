"use client";

import { Button } from "@/components/ui";
import { Download } from "lucide-react";

interface DownloadTemplateButtonProps {
  templateContent: string;
  filename?: string;
  className?: string;
}

export function DownloadTemplateButton({
  templateContent,
  filename = "sample_template.csv",
  className,
}: DownloadTemplateButtonProps) {
  const downloadTemplate = () => {
    const blob = new Blob([templateContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={downloadTemplate} variant="outline" size="sm" className={className}>
      <Download className="mr-2 h-4 w-4" />
      Download Template
    </Button>
  );
}
