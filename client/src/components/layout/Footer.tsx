import { BrainCircuit, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background/40 backdrop-blur-md border-t border-foreground/5 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                <BrainCircuit className="text-background" size={20} />
              </div>
              <span className="text-xl font-display font-black text-foreground uppercase tracking-tight italic">
                Minute<span className="text-primary-foreground/60 not-italic">Mind</span>
              </span>
            </div>
            <p className="text-foreground/60 max-w-sm font-medium leading-relaxed">
              Making teamwork more efficient by automating the boring parts of every meeting.
              Built with precision for the next generation of productive teams.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 rounded-2xl bg-white/50 border border-foreground/5 hover:border-foreground/20 transition-all text-foreground/40 hover:text-foreground">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-3 rounded-2xl bg-white/50 border border-foreground/5 hover:border-foreground/20 transition-all text-foreground/40 hover:text-foreground">
                <Github size={20} />
              </a>
              <a href="#" className="p-3 rounded-2xl bg-white/50 border border-foreground/5 hover:border-foreground/20 transition-all text-foreground/40 hover:text-foreground">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 italic">Product</h4>
            <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest text-foreground/40">
              <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Changelog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 italic">Resources</h4>
            <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest text-foreground/40">
              <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Guides</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-foreground/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
          <p>© 2024 MinuteMind. Built for Hackathons.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
