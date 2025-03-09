"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";
import { useTheme } from "next-themes"; // Use the next-themes hook

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      {children}
      {/* Add the ThemedToaster here */}
      <ThemedToaster />
    </NextThemesProvider>
  );
}

function ThemedToaster() {
  const { theme } = useTheme(); // Get the current theme

  return (
    <Toaster
      theme={theme === "dark" ? "dark" : "light"} // Set the theme dynamically
      richColors // Enable rich colors
    />
  );
}
