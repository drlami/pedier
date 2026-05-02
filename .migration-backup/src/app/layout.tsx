import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { SidebarNav } from "@/components/sidebar-nav";
import "./globals.css";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "PMC PediER Aid",
  description: "Pediatric emergency decision support for residents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 flex-shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground overflow-y-auto hidden lg:block">
            <Suspense fallback={<div className="p-4 text-xs text-muted-foreground">Loading navigation...</div>}>
              <SidebarNav />
            </Suspense>
          </aside>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
        <footer className="border-t bg-card py-2 px-4 text-[10px] text-muted-foreground text-center">
          Clinical support tool only. Final judgment remains with treating physician. Tool is Prepared and coded by Dr Lami Qurt.
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
