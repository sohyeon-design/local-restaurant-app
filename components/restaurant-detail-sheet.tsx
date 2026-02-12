"use client";

import { X, Star, Heart, Trash2, Edit } from "lucide-react";
import type { Restaurant } from "@/lib/types";
import { cn } from "@/lib/utils";

export function RestaurantDetailSheet({
  restaurant,
  onClose,
  onToggleFavorite,
  onDelete,
  onEdit,
  currentUserId,
}: {
  restaurant: Restaurant | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (restaurant: Restaurant) => void;
  currentUserId?: string;
}) {
  if (!restaurant) return null;
  
  // 본인이 추가한 맛집만 수정/삭제 가능
  const canEdit = currentUserId && restaurant.userId === currentUserId;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-md"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        role="button"
        tabIndex={0}
        aria-label="닫기"
      />
      <div className="fixed inset-x-0 bottom-0 z-50 max-w-lg mx-auto bg-gradient-to-b from-card to-background/50 rounded-t-[32px] border border-border/50 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 bg-card/95 backdrop-blur-md z-10 px-6 pt-3 pb-4 border-b border-border/50 rounded-t-[32px]">
          <div className="w-12 h-1.5 bg-muted/60 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <h2 className="text-[18px] font-extrabold text-foreground">상세 정보</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted/60 transition-all"
              aria-label="닫기"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          {/* 헤더 */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <h3 className="text-[22px] font-extrabold text-foreground leading-tight">
                {restaurant.name}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={`detail-star-${restaurant.id}-${i}`}
                    className={cn(
                      "w-5 h-5",
                      i < restaurant.rating
                        ? "fill-primary text-primary"
                        : "fill-gray-300 text-gray-300"
                    )}
                    style={i < restaurant.rating ? { filter: 'drop-shadow(0 1px 2px rgba(255, 138, 76, 0.3))' } : undefined}
                  />
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToggleFavorite(restaurant.id)}
              className="p-2.5 rounded-full hover:bg-accent/10 hover:scale-110 transition-all duration-200"
              aria-label={
                restaurant.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"
              }
            >
              <Heart
                className={cn(
                  "w-7 h-7 transition-all duration-200",
                  restaurant.isFavorite
                    ? "fill-accent text-accent"
                    : "text-muted-foreground"
                )}
                style={restaurant.isFavorite ? { filter: 'drop-shadow(0 2px 4px rgba(255, 138, 76, 0.3))' } : undefined}
              />
            </button>
          </div>

          {/* 정보 */}
          <div className="flex flex-col gap-3.5 bg-gradient-to-br from-secondary/60 to-secondary/30 rounded-[20px] p-5 mb-5 border border-border/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl shrink-0">📍</span>
              <span className="text-[14px] text-foreground font-semibold">
                서울시 {restaurant.location}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl shrink-0">📅</span>
              <span className="text-[14px] text-foreground font-semibold">
                {restaurant.visitDate} 방문
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl shrink-0">🍽️</span>
              <span className="text-[14px] text-foreground font-semibold">
                {restaurant.category}
              </span>
            </div>
          </div>

          {/* 태그 */}
          {restaurant.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {restaurant.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[12px] font-bold text-primary bg-primary/10 px-3.5 py-2 rounded-full border border-primary/20 shadow-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 메모 */}
          {restaurant.memo && (
            <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/50 rounded-[20px] p-5 mb-6 border border-primary/10">
              <h4 className="text-[13px] font-extrabold text-foreground mb-2.5 flex items-center gap-1">
                <span>💭</span> 메모
              </h4>
              <p className="text-[14px] text-foreground/80 leading-relaxed font-medium">
                {restaurant.memo}
              </p>
            </div>
          )}

          {/* 수정/삭제 버튼 */}
          {canEdit && (
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => {
                  onEdit?.(restaurant);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[18px] text-[14px] font-bold text-primary bg-primary/10 hover:bg-primary/20 hover:scale-[1.02] active:scale-95 transition-all border border-primary/20"
              >
                <Edit className="w-4.5 h-4.5" />
                수정하기
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(restaurant.id);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[18px] text-[14px] font-bold text-destructive bg-destructive/10 hover:bg-destructive/20 hover:scale-[1.02] active:scale-95 transition-all border border-destructive/20"
              >
                <Trash2 className="w-4.5 h-4.5" />
                삭제하기
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
