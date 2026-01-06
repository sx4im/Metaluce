import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, FileText, ArrowRight, BrainCircuit, AlertCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAnalysis } from "@/hooks/use-analysis";
import { Navbar } from "@/components/layout/Navbar";
import { cleanTranscript } from "@/utils/transcriptParser";
import { useToast } from "@/hooks/use-toast";
import { SAMPLE_TRANSCRIPTS } from "@/utils/samples";
import { DemoGuide } from "@/components/DemoGuide";
import { Boxes } from "@/components/ui/background-boxes";
import { cn } from "@/lib/utils";

export default function Landing() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { mutate: analyze, isPending } = useCreateAnalysis();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (error) setError(null);
  };

  const loadSample = (sampleText: string) => {
    setText(sampleText);
    setError(null);
    toast({
      title: "Sample loaded",
      description: "You can now click analyze to see the demo.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".txt")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a .txt file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content.trim()) {
        setError("The uploaded file is empty");
        return;
      }
      setText(content);
      setError(null);
      toast({
        title: "File uploaded",
        description: `Successfully loaded ${file.name}`,
      });
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    const cleanedText = cleanTranscript(text);
    
    if (!cleanedText) {
      setError("Please provide a meeting transcript before analyzing");
      return;
    }
    
    analyze(
      { text: cleanedText },
      {
        onSuccess: (data) => {
          setLocation(`/analysis/${data.id}`);
        },
        onError: () => {
          setError("The AI service is currently overloaded. Please try again with a shorter transcript.");
          toast({
            title: "Analysis failed",
            description: "Connection error. Using mock recovery...",
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden relative flex flex-col selection:bg-primary/30 selection:text-white">
      {/* Background Layer: Fixed to stay behind everything including scrolling content */}
      <div className="fixed inset-0 w-full h-full bg-slate-950 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-slate-950 z-10 [mask-image:radial-gradient(transparent,white)] opacity-40" />
        <Boxes className="opacity-30" />
      </div>
      
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        <DemoGuide />
        
        <main className="container mx-auto px-4 py-8 md:py-16 max-w-5xl flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10 space-y-6 w-full"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-primary-foreground text-xs font-bold uppercase tracking-[0.2em] mb-4 backdrop-blur-md border border-white/10 shadow-xl">
              <Sparkles size={12} className="text-primary animate-pulse" />
              <span>AI Intelligence for Teams</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-extrabold text-white text-balance leading-[1.1] tracking-tighter">
              Turn Chaos into <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-indigo-400 to-purple-400">Action</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto text-balance leading-relaxed">
              Synthesize meeting transcripts instantly. Our high-performance AI extracts executive summaries and maps tasks for you.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {SAMPLE_TRANSCRIPTS.map((sample, i) => (
                <Button 
                  key={i}
                  variant="outline" 
                  size="sm"
                  onClick={() => loadSample(sample.content)}
                  className="rounded-full bg-white/5 backdrop-blur-md border-white/10 text-slate-300 hover:text-white hover:border-primary/50 transition-all duration-300 text-xs font-bold uppercase tracking-wider h-8"
                >
                  <PlayCircle className="mr-2 h-3.5 w-3.5 text-primary" />
                  {sample.title}
                </Button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/5 p-8 md:p-12 relative overflow-hidden ring-1 ring-white/10"
          >
            <div className="relative z-10 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <label className="text-xs font-black text-slate-300 uppercase tracking-[0.25em]">
                    Source Transcript
                  </label>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".txt"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-slate-500 hover:text-white hover:bg-white/5 transition-all font-bold text-xs uppercase tracking-widest"
                  >
                    <Upload size={14} className="mr-2" />
                    Upload .txt
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Textarea
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Paste your meeting notes or transcript here (e.g., 'Alice: Let's launch on Friday...')"
                  className={cn(
                    "min-h-[400px] text-lg leading-relaxed resize-none p-10 rounded-[2.5rem] border-white/5 focus:border-primary/30 focus:ring-0 transition-all shadow-2xl bg-slate-950/40 backdrop-blur-md placeholder:text-slate-700 text-slate-200 ring-1 ring-white/5",
                    error ? 'border-destructive/50 ring-destructive/20' : ''
                  )}
                />
                
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="flex items-center gap-2 text-red-400 text-xs font-black uppercase tracking-widest pl-4"
                    >
                      <AlertCircle size={14} />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-center pt-6">
                <Button
                  onClick={handleSubmit}
                  disabled={isPending}
                  size="lg"
                  className="group relative overflow-hidden rounded-2xl px-16 py-8 text-sm font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(var(--primary),0.5)] transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-indigo-500 to-purple-500 transition-all duration-500 group-hover:opacity-90" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <span className="relative flex items-center justify-center gap-3">
                    {isPending ? (
                      <>
                        <BrainCircuit className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Start Intelligent Analysis
                        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

