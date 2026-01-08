import { Link } from "wouter";
import { BrainCircuit, List } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-foreground/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center text-background shadow-sm group-hover:bg-primary transition-colors duration-300">
            <BrainCircuit size={20} />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-foreground">
            Minute<span className="text-primary-foreground/40 font-bold">Mind</span>
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm font-semibold text-foreground/60 hover:text-foreground transition-colors">
            New Analysis
          </Link>
          <Link href="/history" className="text-sm font-semibold text-foreground/60 hover:text-foreground transition-colors flex items-center gap-2">
            <List size={16} />
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}
