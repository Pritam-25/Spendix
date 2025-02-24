"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useState, useEffect } from "react";

const Logo = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-28 sm:h-9 sm:w-32 md:h-10 md:w-36" />; // Responsive placeholder
  }

  return (
    <div className="relative h-8 w-28 sm:h-9 sm:w-32 md:h-10 md:w-40 lg:2-48">
      <Image
        src={theme === "dark" ? "/asset3.svg" : "/asset3-light.svg"}
        alt="Spendix Logo"
        fill
        className="object-contain"
        priority
        sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 144px"
      />
    </div>
  );
};

export default Logo;
