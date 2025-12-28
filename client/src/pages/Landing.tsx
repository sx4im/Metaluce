import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Upload, Sparkles, FileText, ArrowRight, BrainCircuit, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAnalysis } from "@/hooks/use-analysis";
import { Navbar } from "@/components/layout/Navbar";
import { cleanTranscript } from "@/utils/transcriptParser";
import { useToast } from "@/hooks/use-toast";

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
    reader.onerror = () => {
      toast({
        title: "Upload failed",
        description: "Could not read the file",
        variant: "destructive",
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
          toast({
            title: "Analysis failed",
            description: "An error occurred during processing",
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/50 to-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles size={14} />
            <span>AI-Powered Meeting Minutes</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground text-balance leading-tight">
            Turn Chaos into <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Action</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Paste your meeting transcript or upload a file. Our AI will extract the summary and organize action items instantly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50 p-6 md:p-8 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <label className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                <FileText size={16} />
                Transcript / Notes
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
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-muted-foreground hover:text-foreground border-dashed"
                >
                  <Upload size={14} className="mr-2" />
                  Upload .txt
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Paste your meeting notes or transcript here..."
                className={`min-h-[300px] text-base resize-none p-6 rounded-2xl border-indigo-100 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner bg-slate-50/50 ${error ? 'border-destructive ring-destructive/10' : ''}`}
              />
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-destructive text-sm font-medium pl-2"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                size="lg"
                className="rounded-xl px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 w-full md:w-auto"
              >
                {isPending ? (
                  <>
                    <BrainCircuit className="mr-2 h-5 w-5 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Generate Action Plan
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              icon: <FileText className="w-6 h-6 text-blue-500" />,
              title: "Smart Summaries",
              desc: "Get concise executive summaries that capture the essence of long discussions."
            },
            {
              icon: <BrainCircuit className="w-6 h-6 text-primary" />,
              title: "Action Extraction",
              desc: "Automatically identifies and assigns tasks with priority levels."
            },
            {
              icon: <Sparkles className="w-6 h-6 text-purple-500" />,
              title: "Kanban View",
              desc: "Visualize your team's workload with an auto-generated kanban board."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

