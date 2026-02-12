"use client";

import { useAuth } from "@/lib/auth/context";
import { LogOut, LogIn } from "lucide-react";

export function AppHeader({
  totalCount,
  favoriteCount,
  onLoginClick,
}: {
  totalCount: number;
  favoriteCount: number;
  onLoginClick: () => void;
}) {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="max-w-lg mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-2xl">🍜</span>
            </div>
            <div>
              <h1 className="text-[17px] font-bold text-foreground leading-tight tracking-tight">
                나랑가
              </h1>
              <p className="text-[11px] text-muted-foreground font-medium">
                {user ? `${user.user_metadata?.name || "사용자"}님 환영해요! ✨` : "현지인 맛집 기록 앱 ✨"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="text-center px-2.5 py-1.5 rounded-xl bg-secondary/60 min-w-[52px]">
              <p className="text-sm font-bold text-foreground tabular-nums">{totalCount}</p>
              <p className="text-[9px] text-muted-foreground font-semibold">저장</p>
            </div>
            <div className="text-center px-2.5 py-1.5 rounded-xl bg-accent/10 min-w-[52px]">
              <p className="text-sm font-bold text-accent tabular-nums">{favoriteCount}</p>
              <p className="text-[9px] text-accent/70 font-semibold">즐겨찾기</p>
            </div>
            {user ? (
              <button
                onClick={signOut}
                className="p-2.5 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-all"
                aria-label="로그아웃"
              >
                <LogOut className="w-4 h-4 text-destructive" />
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="p-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all"
                aria-label="로그인"
              >
                <LogIn className="w-4 h-4 text-primary" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
