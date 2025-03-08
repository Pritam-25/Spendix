import { scanRecipt } from "@/actions/transaction";
import useFetch from "@/app/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { CameraIcon, Loader2 } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { ScannerProps, ScannedReceipt } from "@/types/receipt";

export default function ReceiptScanner({ onScanComplete }: ScannerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    loading: scanReceiptLoading,
    fetchData: scanReceiptFn,
    data: scannedData,
  } = useFetch<ScannedReceipt>();

  const handleReceiptScan = async (file: File) => {
    try {
      if (!file.type.startsWith("image/")) {
        setTimeout(() => {
          toast.error("Please upload an image file");
        }, 0);
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setTimeout(() => {
          toast.error("File size should be less than 5MB");
        }, 0);
        return;
      }

      console.log("Starting receipt scan with file:", file.name);
      await scanReceiptFn(scanRecipt, file);
    } catch (error) {
      console.error("Error scanning receipt:", error);
      setTimeout(() => {
        toast.error("Failed to scan receipt. Please try again.");
      }, 0);
    }
  };

  const handleScanComplete = useCallback(() => {
    if (scannedData && !scanReceiptLoading) {
      onScanComplete(scannedData);
      setTimeout(() => {
        toast.success("Receipt scanned successfully");
      }, 0);
    }
  }, [scannedData, scanReceiptLoading, onScanComplete]);

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      handleScanComplete();
    }
  }, [handleScanComplete]);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 bg-primary-foreground rounded-lg shadow-md p-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
          // Clear the input value to allow scanning the same file again
          e.target.value = '';
        }}
      />

      <Button
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center bg-primary-foreground justify-center gap-2 text-white font-medium rounded-lg transition-all hover:bg-primary/90 active:scale-95"
        disabled={scanReceiptLoading}
      >
        {scanReceiptLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Scanning...</span>
          </>
        ) : (
          <>
            <CameraIcon className="h-5 w-5" />
            <span>Scan Receipt</span>
          </>
        )}
      </Button>
    </div>
  );
}
