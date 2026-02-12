"use client";

import { Heart, MapPin, Star, Calendar } from "lucide-react";
import type { Restaurant } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  한식: "bg-orange-100 text-orange-600",
  일식: "bg-pink-100 text-pink-600",
  중식: "bg-red-100 text-red-600",
  양식: "bg-green-100 text-green-600",
  카페: "bg-amber-100 text-amber-600",
  술집: "bg-blue-100 text-blue-600",
  분식: "bg-yellow-100 text-yellow-600",
};

const CATEGORY_EMOJI: Record<string, string> = {
  한식: "🍚",
  일식: "🍣",
  중식: "🥟",
  양식: "🍝",
  카페: "☕",
  술집: "🍺",
  분식: "🍜",
};

export function RestaurantCard({
  restaurant,
  onToggleFavorite,
  onSelect,
}: {
  restaurant: Restaurant;
  onToggleFavorite: (id: string) => void;
  onSelect: (restaurant: Restaurant) => void;
}) {
  return (
    <div
      onClick={() => onSelect(restaurant)}
      className="w-full text-left bg-card rounded-[20px] border border-border/50 p-4 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                "text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-sm",
                CATEGORY_COLORS[restaurant.category] ||
                  "bg-muted text-muted-foreground"
              )}
            >
              <span className="text-sm">{CATEGORY_EMOJI[restaurant.category] || "🍽️"}</span>
              {restaurant.category}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={`star-${restaurant.id}-${i}`}
                  className={cn(
                    "w-3.5 h-3.5 transition-all",
                    i < restaurant.rating
                      ? "fill-primary text-primary"
                      : "fill-gray-300 text-gray-300"
                  )}
                  style={i < restaurant.rating ? { filter: 'drop-shadow(0 1px 2px rgba(255, 138, 76, 0.3))' } : undefined}
                />
              ))}
            </div>
          </div>
          <h3 className="text-[17px] font-extrabold text-foreground truncate group-hover:text-primary transition-colors leading-tight">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-[12px] text-muted-foreground font-medium">
              <MapPin className="w-3.5 h-3.5" />
              {restaurant.location}
            </span>
            <span className="flex items-center gap-1 text-[12px] text-muted-foreground font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {restaurant.visitDate}
            </span>
          </div>
          <p className="text-[13px] text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">
            {restaurant.memo}
          </p>
          {restaurant.tags.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
              {restaurant.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-primary font-bold bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(restaurant.id);
          }}
          className="p-2 rounded-full hover:bg-accent/10 hover:scale-110 transition-all duration-200 shrink-0 group/heart"
          aria-label={
            restaurant.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"
          }
        >
          <Heart
            className={cn(
              "w-6 h-6 transition-all duration-200",
              restaurant.isFavorite
                ? "fill-accent text-accent animate-in zoom-in"
                : "text-muted-foreground group-hover/heart:text-accent/50"
            )}
            style={restaurant.isFavorite ? { filter: 'drop-shadow(0 2px 4px rgba(255, 138, 76, 0.3))' } : undefined}
          />
        </button>
      </div>
    </div>
  );
}
