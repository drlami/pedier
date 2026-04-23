import Link from "next/link";
import { StethoscopeIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-card shadow-sm no-print">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <StethoscopeIcon className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold text-primary font-headline">
            PediER Aid
          </span>
        </Link>
        <nav className="flex items-center gap-4">
           <Link href="/admin">
            <Button variant="ghost" size="sm">Admin</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
