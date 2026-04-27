"use client";

import Link from "next/link";
import { StethoscopeIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
              <SheetContent
                side="left"
                className="p-0 pt-10 w-72 bg-sidebar border-r-0"
              >
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Select a clinical system to view its protocols.
                  </SheetDescription>
                </SheetHeader>
                <SidebarNav />
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <StethoscopeIcon className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-primary font-headline">
              PMC - Children Wing ER Aid - Prepared by Dr Lami Qurt
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
