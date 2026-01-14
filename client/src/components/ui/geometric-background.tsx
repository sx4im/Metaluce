"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function ElegantShape({
    className,
    delay = 0,
    rotate = 0,
    gradient = "from-primary/[0.08]",
}: {
    className?: string;
    delay?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                className="relative w-full h-full"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-primary/[0.1]", // Adapted for Light Theme: Primary border
                        "shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]", // Adapted: Dark shadow
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_70%)]" // Shiny reflection
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

export default function GeometricBackground() {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-100/[0.3] via-transparent to-rose-100/[0.3] blur-3xl" />

            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    rotate={12}
                    gradient="from-sky-200/[0.25]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%] w-[300px] md:w-[600px] h-[70px] md:h-[140px]"
                />

                <ElegantShape
                    delay={0.5}
                    rotate={-15}
                    gradient="from-rose-200/[0.25]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%] w-[250px] md:w-[500px] h-[60px] md:h-[120px]"
                />

                <ElegantShape
                    delay={0.4}
                    rotate={-8}
                    gradient="from-teal-200/[0.25]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%] w-[150px] md:w-[300px] h-[40px] md:h-[80px]"
                />

                <ElegantShape
                    delay={0.6}
                    rotate={20}
                    gradient="from-amber-200/[0.3]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%] w-[100px] md:w-[200px] h-[30px] md:h-[60px]"
                />

                <ElegantShape
                    delay={0.7}
                    rotate={-25}
                    gradient="from-emerald-200/[0.25]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%] w-[75px] md:w-[150px] h-[20px] md:h-[40px]"
                />
            </div>
            
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30 pointer-events-none" />
        </div>
    );
}
