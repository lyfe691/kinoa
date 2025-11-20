"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.1, 0.25, 1] as const;

const FADE_UP: Variants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: EASE,
        },
    },
};

interface SectionProps extends HTMLMotionProps<"section"> {
    title: string;
    description?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    delay?: number;
}

export function Section({
    title,
    description,
    action,
    children,
    className,
    delay = 0,
    ...props
}: SectionProps) {
    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.8,
                        delay,
                        ease: EASE,
                    },
                },
            }}
            className={cn("space-y-6", className)}
            {...props}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-sm text-muted-foreground md:text-base">
                            {description}
                        </p>
                    )}
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </div>
            {children}
        </motion.section>
    );
}
