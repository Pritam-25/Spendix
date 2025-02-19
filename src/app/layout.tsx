import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";

export const metadata: Metadata = {
  title: "Spendix",
  description: "Your Guide to Smarter Spending",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            appearance={{
              baseTheme: dark,
            }}
          >
            {/* header */}
            <Header />
            <main className="min-h-screen">{children}</main>
            {/* footer */}
            <footer className="bg-blue-100 py-12">
              <div className="container mx-auto px-4 text-center text-gray-600">
                <p>welcome to spendix</p>
              </div>
            </footer>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
