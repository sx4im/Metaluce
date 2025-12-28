import { useParams } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Clock, Copy, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { Navbar } from "@/components/layout/Navbar";
import { useAnalysis } from "@/hooks/use-analysis";
import { type ActionItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Kanban Column Component
function KanbanColumn({ title, items, colorClass }: { title: string; items: ActionItem[]; colorClass: string }) {
  return (
    <div className="flex-1 min-w-[300px] flex flex-col gap-4">
      <div className={`flex items-center justify-between px-4 py-3 rounded-xl bg-white border ${colorClass} shadow-sm`}>
        <h3 className="font-semibold text-sm tracking-wide uppercase text-foreground/80">{title}</h3>
        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-bold">
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
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-default group"
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <span>Analysis #{analysis.id}</span>
              <span>•</span>
              <span>{new Date(analysis.createdAt!).toLocaleDateString()}</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">Analysis Results</h1>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copySummary}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Summary
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </header>

        {/* Executive Summary Section */}
        <section className="mb-12">
          <Card className="p-6 md:p-8 bg-white shadow-sm border-slate-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <CheckCircle2 size={20} />
              </div>
              <h2 className="text-xl font-bold">Executive Summary</h2>
            </div>
            <div className="prose prose-slate max-w-none text-foreground/90 leading-relaxed text-lg">
              {analysis.summary.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Card>
        </section>

        {/* Action Board Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <AlertCircle size={20} />
            </div>
            <h2 className="text-xl font-bold">Action Plan</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4">
            <KanbanColumn 
              title="High Priority" 
              items={highPriority} 
              colorClass="border-red-100 bg-red-50/50" 
            />
            <KanbanColumn 
              title="Medium Priority" 
              items={mediumPriority} 
              colorClass="border-amber-100 bg-amber-50/50" 
            />
            <KanbanColumn 
              title="Low Priority" 
              items={lowPriority} 
              colorClass="border-emerald-100 bg-emerald-50/50" 
            />
          </div>
        </section>

        {/* Original Text Toggle (Could be an accordion) */}
        <section className="mt-12 pt-8 border-t border-slate-200">
          <details className="group">
            <summary className="flex items-center cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
              <span className="font-medium mr-2">View Original Transcript</span>
              <div className="h-px bg-slate-200 flex-1 ml-4" />
            </summary>
            <div className="mt-4 p-6 bg-slate-100 rounded-xl font-mono text-sm text-slate-600 whitespace-pre-wrap max-h-96 overflow-y-auto border border-slate-200 shadow-inner">
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
