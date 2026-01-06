import { Link } from "wouter";
import { BrainCircuit, List } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-foreground/5 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center text-background shadow-lg shadow-foreground/10 group-hover:scale-105 transition-transform duration-300">
            <BrainCircuit size={18} />
          </div>
          <span className="font-display font-black text-xl tracking-tight text-foreground uppercase italic">
            Minute<span className="text-primary-foreground/60 not-italic">Mind</span>
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground transition-colors">
            New Analysis
          </Link>
          <Link href="/history" className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground transition-colors flex items-center gap-2">
            <List size={14} />
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}
