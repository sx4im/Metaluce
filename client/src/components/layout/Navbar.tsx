import { Link } from "wouter";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-foreground/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-0 group cursor-pointer">
          <div className="w-16 h-16 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <img src="/favicon.png" alt="Metaluce Logo" className="w-full h-full object-contain" />
          </div>
          <span className="-ml-2 font-display font-extrabold text-xl tracking-tight text-foreground">
            Meta<span className="text-primary">luce</span>
          </span>
        </Link>

        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden md:inline-block">
                Hi, {user.username}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
