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
    <div className="min-h-screen bg-white overflow-x-hidden relative flex flex-col selection:bg-primary/20 selection:text-primary-foreground">
      {/* Background Layer: Fixed to stay behind everything */}
      <div className="fixed inset-0 w-full h-full bg-white z-0 pointer-events-none">
        <div className="absolute inset-0 bg-white z-10 [mask-image:radial-gradient(transparent,white)] opacity-60" />
        <Boxes className="opacity-10 [&_div]:border-slate-200 [&_svg]:text-slate-200" />
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-primary text-[10px] font-black uppercase tracking-[0.25em] mb-4 border border-slate-100 shadow-sm">
              <Sparkles size={12} className="text-primary animate-pulse" />
              <span>AI Intelligence for Teams</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-extrabold text-slate-900 text-balance leading-[1.1] tracking-tighter">
              Turn Chaos into <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-indigo-600 to-purple-600">Action</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto text-balance leading-relaxed font-medium">
              Synthesize meeting transcripts instantly. Our high-performance AI extracts executive summaries and maps tasks for you.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {SAMPLE_TRANSCRIPTS.map((sample, i) => (
                <Button 
                  key={i}
                  variant="outline" 
                  size="sm"
                  onClick={() => loadSample(sample.content)}
                  className="rounded-full bg-white border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 transition-all duration-300 text-[10px] font-black uppercase tracking-[0.15em] h-8 shadow-sm no-default-hover-elevate"
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
            className="w-full bg-white/70 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-14 relative overflow-hidden"
          >
            <div className="relative z-10 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                    <FileText size={20} className="text-primary" />
                  </div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
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
                    className="text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest no-default-hover-elevate"
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
                    "min-h-[400px] text-lg leading-relaxed resize-none p-10 rounded-[3rem] border-slate-100 focus:border-primary/20 focus:ring-0 transition-all shadow-inner bg-slate-50/50 placeholder:text-slate-300 text-slate-700",
                    error ? 'border-destructive/30 ring-destructive/5' : ''
                  )}
                />
                
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] pl-6"
                    >
                      <AlertCircle size={14} />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-center pt-8">
                <Button
                  onClick={handleSubmit}
                  disabled={isPending}
                  size="lg"
                  className="group relative overflow-hidden rounded-[2rem] px-20 py-10 text-[12px] font-black uppercase tracking-[0.3em] shadow-[0_25px_50px_-12px_rgba(var(--primary),0.25)] transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] w-full md:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-indigo-500 to-purple-500 transition-all duration-500 group-hover:opacity-90" />
                  
                  <span className="relative flex items-center justify-center gap-4">
                    {isPending ? (
                      <>
                        <BrainCircuit className="h-6 w-6 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Start Intelligent Analysis
                        <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1.5" />
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

