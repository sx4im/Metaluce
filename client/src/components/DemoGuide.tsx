import { Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function DemoGuide() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000); // 8 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, x: 20, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-6 right-6 z-50 max-w-xs"
        >
          <div className="bg-white text-slate-900 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 z-20"
            >
              <X size={14} />
            </button>

            <div className="flex items-start gap-3 relative z-10">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Info className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-sm tracking-tight">Quick Start Guide</h4>
                <ol className="text-xs space-y-2 text-slate-500 font-medium list-decimal pl-4">
                  <li>Choose a <span className="text-slate-900 font-bold">sample transcript</span>.</li>
                  <li>Click <span className="text-primary font-bold">"Analyze"</span> to start.</li>
                  <li>Review AI summary & <span className="text-slate-900 font-bold">Kanban tasks</span>.</li>
                </ol>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
