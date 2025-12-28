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
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/50 to-white overflow-x-hidden">
      <Navbar />
      <DemoGuide />
      
      <main className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-bounce">
            <Sparkles size={14} />
            <span>AI-Powered Meeting Minutes</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground text-balance leading-tight tracking-tight">
            Turn Chaos into <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Action</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Paste your meeting transcript or upload a file. Our AI extracts the summary and organizes action items instantly.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {SAMPLE_TRANSCRIPTS.map((sample, i) => (
              <Button 
                key={i}
                variant="outline" 
                size="sm"
                onClick={() => loadSample(sample.content)}
                className="rounded-full bg-white/50 backdrop-blur-sm border-indigo-100 hover:bg-primary/5 transition-all"
              >
                <PlayCircle className="mr-2 h-4 w-4 text-primary" />
                Demo: {sample.title}
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-200/40 border border-indigo-50 p-6 md:p-10 relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <label className="text-sm font-bold text-foreground/80 flex items-center gap-2 uppercase tracking-widest">
                <FileText size={18} className="text-primary" />
                Meeting Transcript
              </label>
              
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
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  <Upload size={16} className="mr-2" />
                  Upload .txt
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Paste your meeting notes or transcript here (e.g., 'Alice: Let's launch on Friday...')"
                className={`min-h-[350px] text-lg leading-relaxed resize-none p-8 rounded-[2rem] border-indigo-100 focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all shadow-inner bg-slate-50/30 backdrop-blur-sm placeholder:text-muted-foreground/50 ${error ? 'border-destructive ring-destructive/10' : ''}`}
              />
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-destructive text-sm font-bold pl-2 pt-2"
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                size="lg"
                className="rounded-2xl px-12 py-8 text-xl font-bold shadow-2xl shadow-primary/40 hover:shadow-primary/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 w-full md:w-auto min-w-[300px]"
              >
                {isPending ? (
                  <>
                    <BrainCircuit className="mr-3 h-6 w-6 animate-spin" />
                    AI Processing...
                  </>
                ) : (
                  <>
                    Analyze & Map Action Items
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

