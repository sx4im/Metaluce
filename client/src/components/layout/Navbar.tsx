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
          <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <img src="/favicon.png" alt="Metaluce Logo" className="w-full h-full object-contain" />
          </div>
          <span className="-ml-1.5 font-display font-extrabold text-lg md:text-xl tracking-tight text-foreground">
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
                className="transition-all duration-500 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3">
              <Link href="/auth?mode=login">
                <button className="relative overflow-hidden h-8 md:h-9 px-3 md:px-6 rounded-full bg-foreground/5 text-foreground border border-border cursor-pointer group transition-all duration-300 hover:border-primary/30 font-medium text-xs md:text-sm">
                  <span className="relative z-10 transition-colors duration-[800ms] group-hover:text-white">Login</span>
                  <span className="absolute top-0 left-0 w-full h-full rounded-full bg-primary transform scale-x-0 origin-left transition-transform duration-[800ms] ease-out group-hover:scale-x-100"></span>
                </button>
              </Link>
              <Link href="/auth?mode=register">
                <button className="h-8 md:h-9 px-3 md:px-6 rounded-full bg-primary text-white border border-primary cursor-pointer font-medium text-xs md:text-sm shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
