import { useParams } from "wouter";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Sparkles, AlertCircle, Clock, Copy, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { Navbar } from "@/components/layout/Navbar";
import { useAnalysis } from "@/hooks/use-analysis";
import { type ActionItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import ProceduralGroundBackground from "@/components/ui/procedural-ground-background";


// Kanban Column Component
function KanbanColumn({ title, items }: { title: string; items: ActionItem[] }) {
  return (
    <div className="flex-1 min-w-full md:min-w-[300px] flex flex-col gap-4">
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/30 backdrop-blur-sm border border-foreground/5 shadow-sm">
        <h3 className="font-semibold text-sm tracking-wide uppercase text-foreground/80">{title}</h3>
        <span className="bg-white/50 text-foreground/60 px-2 py-0.5 rounded-md text-xs font-bold">
          {items.length}
        </span>
      </div>
      
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-foreground/5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-default group"
          >
            <p className="text-sm font-medium text-foreground mb-3 leading-snug">
              {item.description}
            </p>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">
                  {item.assignee.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-muted-foreground font-medium truncate max-w-[100px]">
                  {item.assignee}
                </span>
              </div>
              <PriorityBadge priority={item.priority as "High" | "Medium" | "Low"} />
            </div>
          </motion.div>
        ))}
        {items.length === 0 && (
          <div className="h-24 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-muted-foreground text-sm">
            No items
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalysisResult() {
  const { id } = useParams();
  const { data: analysis, isLoading, error } = useAnalysis(Number(id));
  const { toast } = useToast();

  if (isLoading) return <LoadingState />;
  if (error || !analysis) return <ErrorState />;

  const actionItems = analysis.actionItems as ActionItem[];
  const highPriority = actionItems.filter(i => i.priority === "High");
  const mediumPriority = actionItems.filter(i => i.priority === "Medium");
  const lowPriority = actionItems.filter(i => i.priority === "Low");

  const copySummary = () => {
    navigator.clipboard.writeText(analysis.summary);
    toast({ title: "Copied!", description: "Summary copied to clipboard." });
  };

  const handleExportPDF = async () => {
    try {
      // Removed "Generating PDF..." toast per user request
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let cursorY = margin;

      // Theme Colors
      const primaryColor = [1, 73, 123] as [number, number, number]; // #01497b
      const foregroundColor = [1, 58, 66] as [number, number, number]; // #013a42
      
      // Helper to add text with auto-paging
      const addSection = (title: string, text: string) => {
        // Add Section Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(...primaryColor);
        
        // Check for page break
        if (cursorY + 10 > pageHeight - margin) {
          doc.addPage();
          cursorY = margin;
        }
        
        doc.text(title, margin, cursorY);
        cursorY += 10;
        
        // Add Section Body
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...foregroundColor);
        
        const lines = doc.splitTextToSize(text, contentWidth);
        const lineHeight = 5;
        
        lines.forEach((line: string) => {
           if (cursorY + lineHeight > pageHeight - margin) {
             doc.addPage();
             cursorY = margin;
           }
           doc.text(line, margin, cursorY);
           cursorY += lineHeight;
        });
        
        cursorY += 10; // Spacing after section
      };

      // 1. Original Transcript
      addSection("Original Transcript", analysis.originalText);
      
      // 2. Executive Summary
      addSection("Executive Summary", analysis.summary);
      
      // 3. Action Plan (Table)
      // Check if we need a page break before table
      if (cursorY + 20 > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(...primaryColor);
      doc.text("Action Plan", margin, cursorY);
      cursorY += 5; // Spacing for autotable
      
      const tableData = actionItems.map(item => [
        item.description,
        item.assignee, 
        // No deadline in schema, leaving empty as placeholder per requirements implicitly asking for standard columns
        "-", 
        item.priority
      ]);

      autoTable(doc, {
        startY: cursorY,
        head: [['Action Item', 'Responsible', 'Deadline', 'Status']],
        body: tableData,
        headStyles: {
          fillColor: primaryColor,
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: {
          font: "helvetica",
          fontSize: 10,
          textColor: foregroundColor
        },
        margin: { top: margin, right: margin, bottom: margin, left: margin },
      });

      doc.save(`analysis-${id}.pdf`);

      toast({ 
        title: "Success", 
        description: "PDF downloaded successfully.",
        duration: 4000 
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({ title: "Error", description: "Failed to generate PDF.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      <ProceduralGroundBackground />

      <Navbar />
      
      <main id="analysis-content" className="container mx-auto px-4 py-8 max-w-7xl relative z-30">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-1">
              <span>Analysis #{analysis.id}</span>
              <span>•</span>
              <span>{new Date(analysis.createdAt!).toLocaleDateString()}</span>
            </div>
            <h1 className="text-4xl font-display font-extrabold text-foreground tracking-tight">Analysis Results</h1>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copySummary} 
              className="h-9 rounded-full font-semibold transition-all duration-500 hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Summary
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportPDF}
              className="h-9 rounded-full font-semibold transition-all duration-500 hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              <Download className="w-3.5 h-3.5 mr-2" />
              Export PDF
            </Button>
          </div>
        </header>

        {/* Executive Summary Section */}
        <section className="mb-12">
          <Card className="p-6 md:p-10 bg-white/30 backdrop-blur-sm shadow-sm border border-foreground/5 overflow-hidden relative rounded-3xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/60" />
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary/10 backdrop-blur-sm rounded-xl text-primary">
                <Sparkles size={22} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Executive Summary</h2>
            </div>
            <div className="prose prose-slate max-w-none text-foreground/80 leading-relaxed text-lg">
              {analysis.summary.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </Card>
        </section>

        {/* Action Board Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <AlertCircle size={24} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Action Plan</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 overflow-x-auto pb-8">
            <KanbanColumn 
              title="Critical" 
              items={highPriority} 
            />
            <KanbanColumn 
              title="Pending" 
              items={mediumPriority} 
            />
            <KanbanColumn 
              title="Standard" 
              items={lowPriority} 
            />
          </div>
        </section>

        {/* Original Text Toggle */}
        <section className="mt-12 pt-12 border-t border-foreground/10">
          <details className="group">
            <summary className="flex items-center cursor-pointer text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 hover:text-foreground transition-colors">
              <span className="mr-2">Original Transcript</span>
              <div className="h-px bg-foreground/10 flex-1 ml-4" />
            </summary>
            <div className="mt-6 p-6 md:p-10 bg-white/20 backdrop-blur-sm rounded-[2rem] font-mono text-sm text-foreground/60 whitespace-pre-wrap max-h-96 overflow-y-auto border border-foreground/5 shadow-inner">
              {analysis.originalText}
            </div>
          </details>
        </section>
      </main>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12 max-w-5xl space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3 bg-slate-200" />
          <Skeleton className="h-4 w-48 bg-slate-200" />
        </div>
        <Card className="p-8 space-y-4">
          <Skeleton className="h-6 w-1/4 mb-4 bg-slate-200" />
          <Skeleton className="h-4 w-full bg-slate-200" />
          <Skeleton className="h-4 w-full bg-slate-200" />
          <Skeleton className="h-4 w-3/4 bg-slate-200" />
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl bg-slate-200" />
          <Skeleton className="h-64 rounded-xl bg-slate-200" />
          <Skeleton className="h-64 rounded-xl bg-slate-200" />
        </div>
      </main>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 max-w-md text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-bold mb-2">Analysis Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the analysis you're looking for. It may have been deleted or doesn't exist.</p>
          <Button onClick={() => window.location.href = '/'} className="w-full">
            Create New Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
