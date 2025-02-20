import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Spendix",
  description: "Your Guide to Smarter Spending",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          storageKey="spendix-theme"
        >
          <ClerkProvider
            appearance={{
              baseTheme: dark,
            }}
          >
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              {/* add toaster */}
              <Toaster />
              <footer className="bg-white/5 py-12">
                <div className="container mx-auto px-4 text-center text-gray-600">
                  <p>Welcome to Spendix</p>
                </div>
              </footer>
            </div>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
