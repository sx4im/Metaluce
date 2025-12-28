import { cn } from "@/lib/utils";

type Priority = "High" | "Medium" | "Low";

export function PriorityBadge({ priority, className }: { priority: Priority; className?: string }) {
  const styles = {
    High: "bg-red-50 text-red-700 border-red-200 shadow-red-100",
    Medium: "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100",
    Low: "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-sm",
        styles[priority],
        className
      )}
    >
      {priority}
    </span>
  );
}
