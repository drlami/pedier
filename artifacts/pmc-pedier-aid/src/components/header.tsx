"use client";

import { useState, useEffect } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, Search, Shield, Stethoscope, GraduationCap } from "lucide-react";
import { SidebarNav } from "@/components/sidebar-nav";
import { SearchModal } from "@/components/search-modal";
import { Suspense } from "react";
import { useAuth, type UserRole } from "@/contexts/auth-context";

const ROLE_ICON: Record<UserRole, typeof Shield> = {
  admin: Shield,
  specialist: Stethoscope,
  resident: GraduationCap,
};

const ROLE_LABEL: Record<UserRole, string> = {
  admin: "Administrator",
  specialist: "Specialist",
  resident: "Resident",
};

export function Header() {
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const RoleIcon = user ? ROLE_ICON[user.role] : Shield;

  // Cmd/Ctrl + K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
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
                <SheetContent side="left" className="p-0 pt-10 w-72 bg-sidebar border-r-0">
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
            <Link href="/" className="flex items-center gap-3 text-white">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/15">
                <StethoscopeIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-tight text-white">PMC PediER Aid</span>
                <span className="text-[10px] text-white/60 font-normal tracking-wide uppercase hidden sm:block">
                  Pediatric Emergency Clinical Decision Support
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Search button */}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 h-8 px-3"
              >
                <Search className="h-4 w-4" />
                <span className="hidden md:block text-xs">Search</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono bg-white/10 border border-white/20 rounded px-1.5 py-0.5 text-white/50">
                  ⌘K
                </kbd>
              </Button>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-white hover:bg-white/10 h-9 px-3"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                      <RoleIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm">{user.username}</span>
                      <span className="text-[11px] text-muted-foreground">{ROLE_LABEL[user.role]}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span className="hidden md:flex items-center gap-1.5 text-[10px] font-medium text-white/50 border border-white/20 rounded px-2 py-1 tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Clinical Support Tool
              </span>
            )}
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
