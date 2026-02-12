"use client";

export function EmptyState({ category }: { category: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="mb-5 animate-in zoom-in duration-300">
        <span className="text-7xl">🍽️</span>
      </div>
      <h3 className="text-[17px] font-extrabold text-foreground mb-2">
        아직 기록이 없어요 😢
      </h3>
      <p className="text-[13px] text-muted-foreground text-center font-medium leading-relaxed">
        {category === "all"
          ? "나만의 숨은 맛집을 기록해보세요 ✨"
          : `${category} 카테고리에 맛집을 추가해보세요`}
      </p>
    </div>
  );
}
