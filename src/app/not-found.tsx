import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="container max-w-md mx-auto px-4">
        <div className="text-center space-y-6">
          {/* Error Code */}
          <h1 id="404" className="text-7xl font-bold text-foreground">
            404
          </h1>

          {/* Title */}
          <h2
            id="page-not-found"
            className="text-2xl font-semibold text-foreground/80"
          >
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
            Please check the URL or go back
            <Link href="/">home</Link>.
          </p>

          {/* Action Button */}
          <Button asChild className="mt-6">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
