"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Star, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES, LOCATIONS } from "@/lib/types";
import type { Restaurant } from "@/lib/types";

export function AddRestaurantSheet({
  isOpen,
  onClose,
  onAdd,
  editingRestaurant,
  restaurants = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (restaurant: Omit<Restaurant, "id">) => void | Promise<void>;
  editingRestaurant?: Restaurant | null;
  restaurants?: Restaurant[];
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("한식");
  const [location, setLocation] = useState("마포구");
  const [rating, setRating] = useState(4);
  const [memo, setMemo] = useState("");
  const [visitDate, setVisitDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // 수정 모드일 때 초기값 설정
  useEffect(() => {
    if (editingRestaurant) {
      setName(editingRestaurant.name);
      setCategory(editingRestaurant.category);
      setLocation(editingRestaurant.location);
      setRating(editingRestaurant.rating);
      setMemo(editingRestaurant.memo);
      setVisitDate(editingRestaurant.visitDate);
      setTags(editingRestaurant.tags);
    } else if (!isOpen) {
      // 모달이 닫힐 때 폼 초기화
      setName("");
      setCategory("한식");
      setLocation("마포구");
      setRating(4);
      setMemo("");
      setVisitDate(new Date().toISOString().split("T")[0]);
      setTags([]);
      setTagInput("");
    }
  }, [editingRestaurant, isOpen]);

  // 인기 태그 계산
  const popularTags = useMemo(() => {
    const tagCount: Record<string, number> = {};
    restaurants.forEach((restaurant) => {
      restaurant.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    const sortedTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
      .slice(0, 5);

    // 5개 미만이면 추가로 채우기 (가나다순)
    if (sortedTags.length < 5) {
      const allTags = Array.from(new Set(restaurants.flatMap((r) => r.tags)))
        .filter((tag) => !sortedTags.includes(tag))
        .sort();
      sortedTags.push(...allTags.slice(0, 5 - sortedTags.length));
    }

    return sortedTags;
  }, [restaurants]);

  const handleAddTag = (tag?: string) => {
    const tagToAdd = tag || tagInput.trim();
    if (tagToAdd && !tags.includes(tagToAdd) && tags.length < 5) {
      setTags([...tags, tagToAdd]);
      setTagInput("");
    }
  };

  const handleAddTagFromInput = () => {
    handleAddTag();
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    
    try {
      await onAdd({
        name: name.trim(),
        category,
        location,
        rating,
        memo: memo.trim(),
        visitDate,
        isFavorite: editingRestaurant?.isFavorite || false,
        tags,
      });
      
      // 성공 시에만 닫기 (폼 초기화는 useEffect에서 처리)
      onClose();
    } catch (error) {
      console.error(editingRestaurant ? "맛집 수정 실패:" : "맛집 추가 실패:", error);
      alert(editingRestaurant ? "맛집 수정에 실패했습니다. 다시 시도해주세요." : "맛집 추가에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (!isOpen) return null;

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
      <div className="fixed inset-x-0 bottom-0 z-50 max-w-lg mx-auto bg-gradient-to-b from-card to-background/50 rounded-t-[32px] border border-border/50 shadow-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 bg-card/95 backdrop-blur-md z-10 px-6 pt-3 pb-4 border-b border-border/50 rounded-t-[32px]">
          <div className="w-12 h-1.5 bg-muted/60 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{editingRestaurant ? "📝" : "✏️"}</span>
              <h2 className="text-[18px] font-extrabold text-foreground">
                {editingRestaurant ? "맛집 수정하기" : "맛집 기록하기"}
              </h2>
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

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* 가게 이름 */}
          <div>
            <label
              htmlFor="restaurant-name"
              className="text-[13px] font-extrabold text-foreground mb-2 block flex items-center gap-1"
            >
              <span>🏪</span> 가게 이름 <span className="text-accent">*</span>
            </label>
            <input
              id="restaurant-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 을지로 골목 칼국수"
              className="w-full px-4 py-3 rounded-[16px] border border-input bg-background text-foreground text-[14px] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all font-medium"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <span className="text-[13px] font-extrabold text-foreground mb-2.5 block flex items-center gap-1">
              <span>🍽️</span> 카테고리
            </span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c.value !== "all").map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[12px] font-bold transition-all border",
                    category === cat.value
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 border-primary scale-105"
                      : "bg-secondary/80 text-secondary-foreground hover:bg-secondary hover:scale-105 border-primary/30"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 지역 */}
          <div>
            <label
              htmlFor="restaurant-location"
              className="text-[13px] font-extrabold text-foreground mb-2 block flex items-center gap-1"
            >
              <span>📍</span> 지역
            </label>
            <select
              id="restaurant-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-[16px] border border-input bg-background text-foreground text-[14px] focus:outline-none focus:border-primary appearance-none transition-all font-medium"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* 별점 */}
          <div>
            <span className="text-[13px] font-extrabold text-foreground mb-2.5 block flex items-center gap-1">
              <span>⭐</span> 별점
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={`rating-star-${i}`}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="p-1 hover:scale-110 transition-transform"
                  aria-label={`${i + 1}점`}
                >
                  <Star
                    className={cn(
                      "w-8 h-8 transition-all",
                      i < rating
                        ? "fill-primary text-primary scale-110"
                        : "fill-gray-300 text-gray-300"
                    )}
                    style={i < rating ? { filter: 'drop-shadow(0 2px 3px rgba(255, 138, 76, 0.3))' } : undefined}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 방문 날짜 */}
          <div>
            <label
              htmlFor="visit-date"
              className="text-[13px] font-extrabold text-foreground mb-2 block flex items-center gap-1"
            >
              <span>📅</span> 방문 날짜
            </label>
            <input
              id="visit-date"
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full px-4 py-3 rounded-[16px] border border-input bg-background text-foreground text-[14px] focus:outline-none focus:border-primary transition-all font-medium"
            />
          </div>

          {/* 태그 */}
          <div>
            <span className="text-[13px] font-extrabold text-foreground mb-2 block flex items-center gap-1">
              <span>🏷️</span> 태그 (최대 5개)
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTagFromInput();
                  }
                }}
                placeholder="태그 입력 후 Enter ✨"
                className="flex-1 px-4 py-3 rounded-[16px] border border-input bg-background text-foreground text-[14px] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all font-medium"
              />
              <button
                type="button"
                onClick={handleAddTagFromInput}
                className="px-4 py-3 rounded-[16px] bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all shadow-sm"
                aria-label="태그 추가"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 text-[12px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 shadow-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-accent hover:scale-110 transition-all"
                      aria-label={`${tag} 태그 삭제`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {popularTags.length > 0 && (
              <div className="mt-3">
                <p className="text-[11px] text-muted-foreground font-semibold mb-2">인기 많은 태그</p>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      disabled={tags.includes(tag) || tags.length >= 5}
                      className={cn(
                        "text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all",
                        tags.includes(tag) || tags.length >= 5
                          ? "bg-muted/50 text-muted-foreground border-muted cursor-not-allowed"
                          : "bg-secondary/60 text-foreground border-border hover:bg-primary/10 hover:border-primary/30 hover:scale-105"
                      )}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 메모 */}
          <div>
            <label
              htmlFor="restaurant-memo"
              className="text-[13px] font-extrabold text-foreground mb-2 block flex items-center gap-1"
            >
              <span>📝</span> 메모
            </label>
            <textarea
              id="restaurant-memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="맛, 분위기, 추천 메뉴 등 자유롭게 기록해보세요 💭"
              rows={4}
              className="w-full px-4 py-3 rounded-[16px] border border-input bg-background text-foreground text-[14px] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary resize-none transition-all font-medium leading-relaxed"
            />
          </div>

          {/* 등록/수정 버튼 */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim()}
            className={cn(
              "w-full py-4 rounded-[18px] text-[15px] font-extrabold transition-all mb-4 shadow-lg",
              name.trim()
                ? "bg-gradient-to-r from-primary to-accent text-white hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-95"
                : "bg-muted/50 text-muted-foreground cursor-not-allowed"
            )}
          >
            {name.trim() 
              ? (editingRestaurant ? "✨ 수정 완료하기" : "✨ 맛집 기록 완료하기")
              : "가게 이름을 입력해주세요"}
          </button>
        </div>
      </div>
    </>
  );
}
