import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode_toggle";
import HeroSection from "@/components/hero";

export default function Home() {
  return (
    <div className="mt-40">
      <HeroSection/>
    </div>
  );
}
