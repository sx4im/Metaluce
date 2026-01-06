import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, FileText, Calendar, CheckSquare } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useAnalyses } from "@/hooks/use-analysis";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { type ActionItem } from "@shared/schema";

export default function History() {
  const { data: analyses, isLoading } = useAnalyses();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-10">
          <h1 className="text-4xl font-display font-black text-foreground mb-2 uppercase tracking-tight italic">Analysis History</h1>
          <p className="text-foreground/60 font-medium">Your past meeting insights and action plans.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full bg-white/40 rounded-3xl" />
            ))}
          </div>
        ) : analyses?.length === 0 ? (
          <div className="text-center py-24 bg-white/20 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-foreground/10">
            <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-6 text-foreground/40">
              <FileText size={40} />
            </div>
            <h3 className="text-xl font-black text-foreground mb-2 uppercase italic">No analyses yet</h3>
            <p className="text-foreground/60 mb-8 font-medium">Get started by analyzing your first meeting transcript.</p>
            <Link href="/">
              <span className="inline-flex items-center justify-center px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.3em] bg-foreground text-background shadow-2xl hover:scale-105 transition-all cursor-pointer italic">
                Start Analysis
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {analyses?.map((analysis) => {
              const actionCount = (analysis.actionItems as ActionItem[]).length;
              const highPriorityCount = (analysis.actionItems as ActionItem[]).filter(a => a.priority === 'High').length;
              
              return (
                <Link key={analysis.id} href={`/analysis/${analysis.id}`}>
                  <div className="group block bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-foreground/5 shadow-sm hover:shadow-2xl hover:border-foreground/10 transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-foreground/10 group-hover:bg-foreground transition-colors" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[10px] font-black px-3 py-1 rounded-full bg-foreground/5 text-foreground/60 flex items-center gap-2 uppercase tracking-widest">
                            <Calendar size={12} />
                            {formatDistanceToNow(new Date(analysis.createdAt!), { addSuffix: true })}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-foreground truncate pr-6 uppercase italic">
                          {analysis.summary.slice(0, 100)}{analysis.summary.length > 100 ? "..." : ""}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-foreground/40 shrink-0">
                        <div className="flex items-center gap-2">
                          <CheckSquare size={16} className="text-foreground" />
                          <span className="text-foreground">{actionCount}</span> Items
                        </div>
                        {highPriorityCount > 0 && (
                          <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 border border-red-200">
                            {highPriorityCount} Critical
                          </span>
                        )}
                        <ArrowRight className="w-6 h-6 text-foreground/20 group-hover:text-foreground group-hover:translate-x-2 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
