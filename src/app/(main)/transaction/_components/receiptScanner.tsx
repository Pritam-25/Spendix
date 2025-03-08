import { scanRecipt } from "@/actions/transaction";
import useFetch from "@/app/hooks/useFetch";
import { Button } from "@/components/ui/button";
import { CameraIcon, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function ReceiptScanner({
  onScanComplete,
}: {
  onScanComplete: (scannedData: any) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    loading: scanReceiptLoading,
    fetchData: scanReceiptFn,
    data: scannedData,
  } = useFetch(scanRecipt);

  const handleReceiptScan = async (file: File) => {
    try {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      console.log("Starting receipt scan with file:", file.name);
      await scanReceiptFn(file);
    } catch (error) {
      console.error("Error scanning receipt:", error);
      toast.error("Failed to scan receipt. Please try again.");
    }
  };

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      onScanComplete(scannedData);
      setTimeout(() => {
        toast.success("Receipt scanned successfully");
      }, 0);
    }
  }, [scanReceiptLoading, scannedData, onScanComplete]);

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
