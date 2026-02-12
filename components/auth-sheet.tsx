"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export function AuthSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Supabase 설정이 없으면 에러 표시
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError("Supabase 설정이 필요합니다. SUPABASE_SETUP.md 파일을 참고해주세요.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });
        if (error) throw error;
        alert("회원가입이 완료되었습니다! 로그인해주세요.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setError("");
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
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
      <div className="fixed inset-x-0 bottom-0 z-50 max-w-lg mx-auto bg-gradient-to-b from-card to-background/50 rounded-t-[32px] border border-border/50 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 bg-card/95 backdrop-blur-md z-10 px-6 pt-3 pb-4 border-b border-border/50 rounded-t-[32px]">
          <div className="w-12 h-1.5 bg-muted/60 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔐</span>
              <h2 className="text-[18px] font-extrabold text-foreground">
                {isSignUp ? "회원가입" : "로그인"}
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

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-[16px] p-3 text-[13px] text-destructive font-medium">
              {error}
            </div>
          )}

          {isSignUp && (
            <div>
              <label
                htmlFor="name"
                className="text-[13px] font-extrabold text-foreground mb-2 block flex items-center gap-1"
              >
                <span>👤</span> 이름
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                required
                className="w-full px-4 py-3 rounded-[16px] border border-input bg-background text-foreground text-[14px] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all font-medium"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="text-[13px] font-extrabold text-foreground mb-2 block flex items-center gap-1"
            >
              <span>✉️</span> 이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
              className="w-full px-4 py-3 rounded-[16px] border border-input bg-background text-foreground text-[14px] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all font-medium"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-[13px] font-extrabold text-foreground mb-2 block flex items-center gap-1"
            >
              <span>🔑</span> 비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-[16px] border border-input bg-background text-foreground text-[14px] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full py-4 rounded-[18px] text-[15px] font-extrabold transition-all shadow-lg",
              loading
                ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                : "bg-gradient-to-r from-primary to-accent text-white hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-95"
            )}
          >
            {loading
              ? "처리 중..."
              : isSignUp
              ? "✨ 회원가입하기"
              : "✨ 로그인하기"}
          </button>

          <button
            type="button"
            onClick={toggleMode}
            className="text-[13px] text-muted-foreground hover:text-primary transition-colors font-medium text-center"
          >
            {isSignUp
              ? "이미 계정이 있으신가요? 로그인"
              : "계정이 없으신가요? 회원가입"}
          </button>
        </form>
      </div>
    </>
  );
}
