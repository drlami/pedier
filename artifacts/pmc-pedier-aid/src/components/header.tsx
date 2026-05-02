"use client";

import { Link } from "wouter";
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
import { Suspense } from "react";

export function Header() {
  return (
    <header className="no-print sticky top-0 z-40" style={{ background: "hsl(212, 72%, 22%)" }}>
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu className="h-5 w-5" />
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
                <Suspense fallback={<div>Loading...</div>}>
                  <SidebarNav />
                </Suspense>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-white"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/15">
              <StethoscopeIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight text-white">PMC PediER Aid</span>
              <span className="text-[10px] text-white/60 font-normal tracking-wide uppercase hidden sm:block">Pediatric Emergency Clinical Decision Support</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:flex items-center gap-1.5 text-[10px] font-medium text-white/50 border border-white/20 rounded px-2 py-1 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Clinical Support Tool
          </span>
        </div>
      </div>
    </header>
  );
}
