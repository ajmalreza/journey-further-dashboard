"use client";

import { FileText, Upload, X } from "lucide-react";
import { useState, useRef, useCallback, ReactNode } from "react";

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: string;
  maxSize?: number; // in bytes
  validateFile?: (file: File) => boolean;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
}

export function FileDropZone({
  onFileSelect,
  onFileRemove,
  accept = "*/*",
  maxSize,
  validateFile,
  className = "",
  children,
  disabled = false,
}: FileDropZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultValidateFile = (selectedFile: File) => {
    // Check file type
    if (accept !== "*/*" && !selectedFile.type.match(accept.replace(/\*/g, ".*"))) {
      return false;
    }

    // Check file size
    if (maxSize && selectedFile.size > maxSize) {
      return false;
    }

    return true;
  };

  const isValidFile = validateFile || defaultValidateFile;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (disabled) return;

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile);
      onFileSelect(droppedFile);
    }
  }, [disabled, isValidFile, onFileSelect]);

  const removeFile = () => {
    setFile(null);
    onFileRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 min-h-[300px] flex items-center justify-center ${
        isDragOver
          ? "border-primary bg-primary/10"
          : file
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {file ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <FileText className="h-12 w-12 text-primary" />
            <div className="text-left">
              <p className="text-lg font-medium text-foreground">
                {file.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            {!disabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  removeFile();
                }}
                className="p-2 hover:bg-muted rounded-full transition-colors z-10 relative"
                title="Remove file"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          {!disabled && (
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {!disabled && (
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          )}
          {children || (
            <div className="flex flex-col items-center gap-4">
              <div
                className={`p-4 rounded-full ${
                  isDragOver ? "bg-primary/20" : "bg-muted"
                }`}
              >
                <Upload
                  className={`h-8 w-8 ${
                    isDragOver ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground mb-2">
                  {isDragOver
                    ? "Drop your file here"
                    : "Upload File"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your file here, or click to browse
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
