"use client";

import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/types";

export function CategoryFilter({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (category: string) => void;
}) {
  return (
    <div className="max-w-lg mx-auto px-5 py-4">
      <div className="flex gap-2 overflow-x-auto px-2 pt-1 pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = selected === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => onSelect(cat.value)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all shrink-0 border",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 border-primary scale-105"
                  : "bg-secondary/80 text-secondary-foreground hover:bg-secondary hover:scale-105 border-transparent"
              )}
            >
              <span className="text-base">{cat.icon}</span>
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
