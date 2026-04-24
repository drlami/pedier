"use client";

import Link from "next/link";
import { StethoscopeIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SidebarNav } from "@/components/sidebar-nav";

export function Header() {
  return (
    <header className="bg-card shadow-sm no-print sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 pt-10 w-72 bg-sidebar border-r-0">
                <SidebarNav />
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <StethoscopeIcon className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-primary font-headline">
              PediER Aid
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
