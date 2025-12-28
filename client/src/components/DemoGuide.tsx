import { Info } from "lucide-react";
import { motion } from "framer-motion";

export function DemoGuide() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-6 right-6 z-50 max-w-xs"
    >
      <div className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-2xl border border-primary-foreground/10">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-bold text-sm">Demo Instructions</h4>
            <ol className="text-xs space-y-2 opacity-90 list-decimal pl-4">
              <li>Choose a <strong>sample transcript</strong> or paste your own.</li>
              <li>Click <strong>"Generate Action Plan"</strong> to process.</li>
              <li>View the AI-generated <strong>Summary & Kanban Board</strong>.</li>
            </ol>
            <p className="text-[10px] italic opacity-75 pt-1 border-t border-primary-foreground/20">
              Process takes ~60 seconds to demonstrate value.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
