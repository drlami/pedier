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
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut, Search, Shield, Stethoscope, GraduationCap, PanelLeftClose, PanelLeftOpen, Star } from "lucide-react";
import { SidebarNav } from "@/components/sidebar-nav";
import { SearchModal } from "@/components/search-modal";
import { Suspense } from "react";
import { useAuth, type UserRole } from "@/contexts/auth-context";
import { useSidebar } from "@/contexts/sidebar-context";
import { usePinnedItems } from "@/contexts/pinned-items-context";
import { useOffline } from "@/hooks/use-offline";
import { WifiOff } from "lucide-react";
import { cn, isMacPlatform } from "@/lib/utils";

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
  const isOffline = useOffline();
  const { user, logout } = useAuth();
  const { pinnedItems } = usePinnedItems();
  const [searchOpen, setSearchOpen] = useState(false);
  const { desktopOpen, toggleDesktop, mobileOpen, openMobile, closeMobile } = useSidebar();
  const RoleIcon = user ? ROLE_ICON[user.role] : Shield;
  const [shortcutLabel] = useState(() => (isMacPlatform() ? "⌘K" : "Ctrl K"));

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

            {/* Mobile hamburger — opens Sheet */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={openMobile}
                className="text-white hover:bg-white/10"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </div>

            {/* Desktop sidebar toggle */}
            <div className="hidden lg:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDesktop}
                className="text-white hover:bg-white/10"
                title={desktopOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                {desktopOpen
                  ? <PanelLeftClose className="h-5 w-5" />
                  : <PanelLeftOpen  className="h-5 w-5" />
                }
              </Button>
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
            {/* Favorites link */}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className={cn(
                  "relative text-white/80 hover:text-white hover:bg-white/10 h-9 w-9 transition-all rounded-full",
                  pinnedItems.length > 0 && "text-amber-400"
                )}
                title="Favorites"
              >
                <Link href="/favorites">
                  <Star className={cn("h-5 w-5", pinnedItems.length > 0 && "fill-current")} />
                  {pinnedItems.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white border-2 border-[hsl(212,72%,22%)]">
                      {pinnedItems.length}
                    </span>
                  )}
                </Link>
              </Button>
            )}

            {/* Search button — bordered "search field" affordance instead of plain ghost text */}
            {user && (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1.5 h-8 px-2 md:px-3 rounded-lg border border-white/15 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/25 transition-colors"
                title={`Search (${shortcutLabel})`}
              >
                <Search className="h-4 w-4 shrink-0" />
                <span className="hidden md:block text-xs whitespace-nowrap">Search</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] font-mono bg-white/10 border border-white/20 rounded px-1.5 py-0.5 text-white/50">
                  {shortcutLabel}
                </kbd>
              </button>
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

      {isOffline && (
        <div className="no-print bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] py-1.5 flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
          <WifiOff className="h-3 w-3" />
          <span>Offline Mode: Guidelines are locally cached</span>
        </div>
      )}


      {/* Mobile Sheet — controlled by sidebar context */}
      <Sheet open={mobileOpen} onOpenChange={(open) => open ? openMobile() : closeMobile()}>
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

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
