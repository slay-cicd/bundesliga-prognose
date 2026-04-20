"use client";

import { type Category, categoryLabels } from "@/lib/markets";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CategoryTabsProps {
  selected: Category | "all";
  onChange: (cat: Category | "all") => void;
}

const allCategories: (Category | "all")[] = ["all", "crypto", "stocks", "indices", "commodities", "forex", "pre-ipo"];

const labels: Record<Category | "all", string> = {
  all: "Alle",
  ...categoryLabels,
};

export function CategoryTabs({ selected, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
      {allCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            "relative px-3.5 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors",
            selected === cat
              ? "text-text-primary"
              : "text-text-muted hover:text-text-secondary"
          )}
        >
          {selected === cat && (
            <motion.div
              layoutId="category-tab"
              className="absolute inset-0 bg-surface-3 rounded-lg"
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{labels[cat]}</span>
        </button>
      ))}
    </div>
  );
}
