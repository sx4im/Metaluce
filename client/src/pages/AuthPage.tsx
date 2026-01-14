import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FcGoogle } from "react-icons/fc";
import { Loader2, ArrowLeft } from "lucide-react";
import Ballpit from "@/components/ui/ballpit";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  
  // Check URL parameters to determine initial mode
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const [isLogin, setIsLogin] = useState(mode === 'login');

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (user) return null;

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground overflow-hidden">
      {/* Left Side - Visuals */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-muted/30">
        <div className="absolute inset-0 z-0 opacity-80">
          <Ballpit 
            count={80}
            colors={[0x01497b, 0x013A42, 0xE2E2E2]} // Using website primary dark blue
            ambientColor={0xffffff}
            ambientIntensity={1.5}
            lightIntensity={300}
            minSize={0.6}
            maxSize={1.2}
            gravity={0.0050}
            maxVelocity={0.12}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
        </div>

        {/* Header with Logo and Back Button */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-0 group cursor-pointer" onClick={() => setLocation("/")}>
              <div className="w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                 <img src="/favicon.png" alt="Metaluce Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-foreground -ml-1">
                Meta<span className="text-primary">luce</span>
              </span>
          </div>

          <Button 
            variant="ghost" 
            className="text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-6 transition-all duration-500 font-bold"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to website
          </Button>
        </div>

        <div className="relative z-10 mt-auto mb-0 pointer-events-none">
          <h1 className="text-5xl font-bold font-display leading-tight mb-2 text-slate-900 max-w-3xl">
            Unleash the Power of Every Conversation
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-3xl">
             Turn meetings into decisions that actually last.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col p-6 lg:p-12 overflow-y-auto bg-background">


        <div className="w-full max-w-md space-y-8 m-auto">
          {/* Mobile Header */}
          <div className="lg:hidden w-full flex items-center justify-between relative z-50 pb-8">
            <div className="flex items-center gap-0 cursor-pointer -ml-2" onClick={() => setLocation("/")}>
               <div className="w-8 h-8 flex items-center justify-center">
                  <img src="/favicon.png" alt="Metaluce Logo" className="w-full h-full object-contain" />
               </div>
               <span className="font-display font-extrabold text-xl tracking-tight text-foreground -ml-1">
                 Meta<span className="text-primary">luce</span>
               </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-4 transition-all duration-500 font-bold -mr-2"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="mr-2 w-4 h-4" /> Back to website
            </Button>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-bold tracking-tight text-foreground font-display">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-muted-foreground text-md">
              {isLogin ? "New here? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-primary hover:underline underline-offset-4 font-bold"
              >
                {isLogin ? "Create an account" : "Log in"}
              </button>
            </p>
          </div>

          <div className="space-y-8 mt-10">
            {isLogin ? (
              <LoginForm loginMutation={loginMutation} />
            ) : (
              <RegisterForm registerMutation={registerMutation} />
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-muted-foreground font-medium">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" className="w-[90%] h-12 border-input bg-background hover:bg-zinc-50 text-foreground font-semibold shadow-sm">
                <FcGoogle className="mr-2 h-7 w-7" />
                {isLogin ? "Sign in with Google" : "Sign up with Google"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ loginMutation }: { loginMutation: any }) {
  const form = useForm<z.infer<typeof insertUserSchema>>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-slate-700">Username or Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="name@example.com" 
                  {...field} 
                  className="bg-background border-input focus-visible:ring-2 focus-visible:ring-primary h-12 text-foreground font-medium"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="font-semibold text-slate-700">Password</FormLabel>
                <a href="#" className="text-sm text-primary hover:text-primary/80 font-bold">Forgot password?</a>
              </div>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Enter your password" 
                  {...field} 
                  className="bg-background border-input focus-visible:ring-2 focus-visible:ring-primary h-12 text-foreground font-medium"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-center space-x-2 pt-1">
          <Checkbox id="remember" className="border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 cursor-pointer"
          >
            Remember me for 30 days
          </label>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            type="submit" 
            className="w-[90%] h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg shadow-primary/10 transition-all hover:scale-[1.01]"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Log in
          </Button>
        </div>
      </form>
    </Form>
  );
}

function RegisterForm({ registerMutation }: { registerMutation: any }) {
  const form = useForm<z.infer<typeof insertUserSchema>>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
           <div>
             <FormLabel className="font-semibold text-slate-700 ml-1">First name</FormLabel>
             <Input placeholder="Your first name" className="bg-background border-input focus-visible:ring-2 focus-visible:ring-primary h-12 text-foreground mt-1.5" />
           </div>
           <div>
             <FormLabel className="font-semibold text-slate-700 ml-1">Last name</FormLabel>
             <Input placeholder="Your last name" className="bg-background border-input focus-visible:ring-2 focus-visible:ring-primary h-12 text-foreground mt-1.5" />
           </div>
        </div>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-slate-700">Username</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Create a username" 
                  {...field} 
                  className="bg-background border-input focus-visible:ring-2 focus-visible:ring-primary h-12 text-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-slate-700">Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Create a strong password" 
                  {...field} 
                  className="bg-background border-input focus-visible:ring-2 focus-visible:ring-primary h-12 text-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-start space-x-2 pt-2">
            <Checkbox id="terms" className="mt-1 border-input data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
            <label
              htmlFor="terms"
              className="text-sm leading-snug peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
            >
              I agree to the <a href="#" className="underline font-bold text-slate-900 hover:text-primary">Terms of Service</a> and <a href="#" className="underline font-bold text-slate-900 hover:text-primary">Privacy Policy</a>.
            </label>
        </div>

        <div className="flex justify-center pt-4">
          <Button 
            type="submit" 
            className="w-[90%] h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg shadow-primary/10 transition-all hover:scale-[1.01]"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Create account
          </Button>
        </div>
      </form>
    </Form>
  );
}
