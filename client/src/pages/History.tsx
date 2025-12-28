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
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Analysis History</h1>
          <p className="text-muted-foreground">Your past meeting insights and action plans.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full bg-white rounded-xl" />
            ))}
          </div>
        ) : analyses?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No analyses yet</h3>
            <p className="text-muted-foreground mb-6">Get started by analyzing your first meeting transcript.</p>
            <Link href="/">
              <span className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-primary text-white shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all cursor-pointer">
                Start Analysis
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {analyses?.map((analysis) => {
              const actionCount = (analysis.actionItems as ActionItem[]).length;
              const highPriorityCount = (analysis.actionItems as ActionItem[]).filter(a => a.priority === 'High').length;
              
              return (
                <Link key={analysis.id} href={`/analysis/${analysis.id}`}>
                  <div className="group block bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-primary transition-colors" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDistanceToNow(new Date(analysis.createdAt!), { addSuffix: true })}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground truncate pr-4">
                          {analysis.summary.slice(0, 100)}{analysis.summary.length > 100 ? "..." : ""}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground shrink-0">
                        <div className="flex items-center gap-1.5">
                          <CheckSquare size={16} />
                          <span className="font-medium text-foreground">{actionCount}</span> Action Items
                        </div>
                        {highPriorityCount > 0 && (
                          <span className="px-2 py-1 rounded-md bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                            {highPriorityCount} High Priority
                          </span>
                        )}
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
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
