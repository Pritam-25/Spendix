import React from "react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, PenBox } from "lucide-react";
import { ModeToggle } from "./mode_toggle";
import Logo from "./logo"; // Import the Logo component
import { checkUser } from "@/lib/checkUser";

// left-1/2 transform -translate-x-1/2

const Header = async () => {
  await checkUser();
  return (
    <div className="fixed top-0 h-18 w-full bg-white/5 backdrop-blur-lg z-50 border-b border-border shadow-lg">
      <nav className="px-6 py-4 container mx-auto flex items-center justify-between">
        <Link href="/">
          <Logo /> {/* Use the extracted Logo component */}
        </Link>

        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton forceRedirectUrl={"/dashboard"}>
              <Button variant="default">Sign in</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href={"/dashboard"}>
              <Button
                variant={"outline"}
                className="hidden sm:flex items-center gap-2"
              >
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
            <Link href={"/transaction/create"}>
              <Button variant={"default"} className="flex items-center gap-2">
                <PenBox size={16} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
            <ModeToggle />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};

export default Header;
