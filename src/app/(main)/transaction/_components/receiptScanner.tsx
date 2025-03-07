import { CameraIcon } from "lucide-react";

export default function ReceiptScanner() {
    return (
        <div className="flex gap-4 bg-primary-foreground p-2 text-center items-center justify-center rounded-lg">
            <CameraIcon className="h-5 w-5 text-muted-foreground"/>
            <p>Scan you image</p>
        </div>
    );
}