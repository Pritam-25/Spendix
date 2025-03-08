import { scanRecipt } from "@/actions/transaction";
import useFetch from "@/app/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { CameraIcon, Loader2 } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";

interface ScannedReceipt {
  amount?: string | number;
  date?: string | Date;
  description?: string;
  category?: string;
}

interface ReceiptScannerProps {
  onScanComplete: (data: ScannedReceipt) => void;
}

export default function ReceiptScanner({
  onScanComplete,
}: ReceiptScannerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    loading: scanReceiptLoading,
    fetchData: scanReceiptFn,
    data: scannedData,
  } = useFetch<ScannedReceipt, [File]>(scanRecipt);

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
      await scanReceiptFn(file);
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
  }, [scannedData]);

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      handleScanComplete();
    }
  }, [handleScanComplete, scanReceiptLoading, scannedData]);

  return (
    <>
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
          e.target.value = "";
        }}
      />

      <Button
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-6 h-auto flex items-center justify-center gap-3 bg-secondary hover:bg-secondary/90 text-lg font-medium rounded-lg shadow-md border-2 border-dashed mb-10"
        disabled={scanReceiptLoading}
      >
        {scanReceiptLoading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Scanning...</span>
          </>
        ) : (
          <>
            <CameraIcon className="h-12 w-12 text-black dark:text-white " />
            <span className="text-black dark:text-white">Scan Receipt</span>
          </>
        )}
      </Button>
    </>
  );
}
