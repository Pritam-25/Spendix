"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useState, useEffect } from "react";

const Logo = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show nothing or a placeholder while waiting for client-side hydration
  if (!mounted) {
    return (
      <div className="h-10 w-[200px]" /> // Placeholder with same dimensions
    );
  }

  return (
    <Image
      src={theme === "dark" ? "/asset3.svg" : "/asset3-light.svg"}
      alt="Spendix Logo"
      height={60}
      width={200}
      priority
      loading="eager"
      className="h-10 w-auto object-contain"
    />
  );
};

export default Logo;