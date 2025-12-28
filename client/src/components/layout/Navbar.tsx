import { Link } from "wouter";
import { BrainCircuit, List } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform duration-300">
            <BrainCircuit size={18} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            Minute<span className="text-primary">Mind</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            New Analysis
          </Link>
          <Link href="/history" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
            <List size={16} />
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}
