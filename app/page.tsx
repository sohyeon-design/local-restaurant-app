"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Search, X } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { CategoryFilter } from "@/components/category-filter";
import { RestaurantCard } from "@/components/restaurant-card";
import { AddRestaurantSheet } from "@/components/add-restaurant-sheet";
import { RestaurantDetailSheet } from "@/components/restaurant-detail-sheet";
import { EmptyState } from "@/components/empty-state";
import { AuthSheet } from "@/components/auth-sheet";
import { useAuth } from "@/lib/auth/context";
import { SAMPLE_RESTAURANTS } from "@/lib/types";
import type { Restaurant } from "@/lib/types";

export default function Home() {
  const { user, supabase, loading: authLoading } = useAuth();
  const [restaurants, setRestaurants] =
    useState<Restaurant[]>(SAMPLE_RESTAURANTS);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [editingRestaurant, setEditingRestaurant] =
    useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Supabase에서 데이터 불러오기
  useEffect(() => {
    const fetchRestaurants = async () => {
      // Supabase가 없으면 샘플 데이터만 표시
      if (!supabase) {
        setRestaurants(SAMPLE_RESTAURANTS);
        setIsLoading(false);
        return;
      }

      try {
        // 모든 사용자의 맛집 데이터 불러오기 (로그인 여부 상관없음)
        const { data, error } = await supabase
          .from("restaurants")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const formattedData: Restaurant[] = (data || []).map((item) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          location: item.location,
          rating: item.rating,
          memo: item.memo || "",
          visitDate: item.visit_date,
          // 본인이 추가한 맛집이고 로그인 상태일 때만 찜 상태 표시
          isFavorite: (user && item.user_id === user.id) ? (item.is_favorite || false) : false,
          tags: item.tags || [],
          userId: item.user_id,
          createdAt: item.created_at,
        }));

        // 모든 사용자 데이터 + 샘플 데이터
        setRestaurants([...formattedData, ...SAMPLE_RESTAURANTS]);
      } catch (error) {
        console.error("맛집 불러오기 실패:", error);
        setRestaurants(SAMPLE_RESTAURANTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [supabase, user]); // user 의존성 추가로 로그인/로그아웃 시 데이터 새로고침

  const filteredRestaurants = useMemo(() => {
    let result = restaurants;

    if (selectedCategory !== "all") {
      result = result.filter((r) => r.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.location.toLowerCase().includes(query) ||
          r.memo.toLowerCase().includes(query) ||
          r.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    return result.sort(
      (a, b) =>
        new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
    );
  }, [restaurants, selectedCategory, searchQuery]);

  const favoriteCount = restaurants.filter((r) => r.isFavorite).length;

  const handleToggleFavorite = async (id: string) => {
    const restaurant = restaurants.find((r) => r.id === id);
    if (!restaurant) return;

    // 로그인하지 않은 경우 로그인 모달 표시
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    const newFavoriteState = !restaurant.isFavorite;

    // 낙관적 업데이트 (UI 먼저 변경)
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: newFavoriteState } : r))
    );
    if (selectedRestaurant?.id === id) {
      setSelectedRestaurant((prev) =>
        prev ? { ...prev, isFavorite: newFavoriteState } : null
      );
    }

    // 본인이 추가한 맛집만 Supabase에 저장
    // 다른 사람이 추가한 맛집이나 샘플 데이터는 로컬 상태로만 관리
    if (supabase && user && restaurant.userId === user.id) {
      try {
        const { error } = await supabase
          .from("restaurants")
          .update({ is_favorite: newFavoriteState })
          .eq("id", id);

        if (error) throw error;
      } catch (error) {
        console.error("즐겨찾기 업데이트 실패:", error);
        // 실패 시 되돌리기
        setRestaurants((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isFavorite: !newFavoriteState } : r))
        );
        if (selectedRestaurant?.id === id) {
          setSelectedRestaurant((prev) =>
            prev ? { ...prev, isFavorite: !newFavoriteState } : null
          );
        }
      }
    }
  };

  const handleAddRestaurant = async (newRestaurant: Omit<Restaurant, "id">) => {
    if (!supabase || !user) {
      // 로그인하지 않은 경우 로컬만 사용
      const restaurant: Restaurant = {
        ...newRestaurant,
        id: Date.now().toString(),
        userId: "local-user",
        createdAt: new Date().toISOString(),
      };
      setRestaurants((prev) => [restaurant, ...prev]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("restaurants")
        .insert({
          user_id: user.id,
          name: newRestaurant.name,
          category: newRestaurant.category,
          location: newRestaurant.location,
          rating: newRestaurant.rating,
          memo: newRestaurant.memo,
          visit_date: newRestaurant.visitDate,
          is_favorite: newRestaurant.isFavorite || false,
          tags: newRestaurant.tags,
        })
        .select()
        .single();

      if (error) throw error;

      const restaurant: Restaurant = {
        id: data.id,
        name: data.name,
        category: data.category,
        location: data.location,
        rating: data.rating,
        memo: data.memo || "",
        visitDate: data.visit_date,
        isFavorite: data.is_favorite || false,
        tags: data.tags || [],
        userId: data.user_id,
        createdAt: data.created_at,
      };

      setRestaurants((prev) => [restaurant, ...prev]);
    } catch (error) {
      console.error("맛집 추가 실패:", error);
      alert("맛집 추가에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDeleteRestaurant = async (id: string) => {
    const restaurant = restaurants.find((r) => r.id === id);
    if (!restaurant) return;

    // 권한 체크
    if (user && restaurant.userId !== user.id && restaurant.userId !== "sample-user" && restaurant.userId !== "local-user") {
      alert("본인이 추가한 맛집만 삭제할 수 있습니다.");
      return;
    }

    // 낙관적 업데이트
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
    setSelectedRestaurant(null);

    // Supabase에서 삭제
    if (supabase && user && restaurant.userId === user.id) {
      try {
        const { error } = await supabase
          .from("restaurants")
          .delete()
          .eq("id", id);

        if (error) throw error;
      } catch (error) {
        console.error("맛집 삭제 실패:", error);
        alert("맛집 삭제에 실패했습니다.");
        // 실패 시 되돌리기
        setRestaurants((prev) => [restaurant, ...prev]);
      }
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setIsAddOpen(true);
  };

  const handleUpdateRestaurant = async (updatedData: Omit<Restaurant, "id">) => {
    if (!editingRestaurant || !supabase || !user) return;

    try {
      const { error } = await supabase
        .from("restaurants")
        .update({
          name: updatedData.name,
          category: updatedData.category,
          location: updatedData.location,
          rating: updatedData.rating,
          memo: updatedData.memo,
          visit_date: updatedData.visitDate,
          is_favorite: updatedData.isFavorite || false,
          tags: updatedData.tags,
        })
        .eq("id", editingRestaurant.id);

      if (error) throw error;

      // 로컬 상태 업데이트
      setRestaurants((prev) =>
        prev.map((r) =>
          r.id === editingRestaurant.id
            ? { ...r, ...updatedData }
            : r
        )
      );

      setEditingRestaurant(null);
    } catch (error) {
      console.error("맛집 수정 실패:", error);
      alert("맛집 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleFabClick = () => {
    // 로그인하지 않은 경우 로그인 모달 표시
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    // 로그인한 경우 맛집 추가 모달 표시
    setIsAddOpen(true);
  };

  // 로딩 중일 때 로딩 화면 표시
  if (authLoading || isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent animate-spin" style={{ 
            background: 'conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))'
          }} />
          <p className="text-sm text-muted-foreground font-semibold">맛집 불러오는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <AppHeader
        totalCount={restaurants.length}
        favoriteCount={favoriteCount}
        onLoginClick={() => setIsAuthOpen(true)}
      />

      {/* 검색 */}
      <div className="max-w-lg mx-auto px-5 pt-3">
        {isSearchOpen ? (
          <div className="flex items-center gap-2 bg-white rounded-[18px] px-4 py-3 transition-all shadow-md border border-primary/20">
            <Search className="w-4.5 h-4.5 text-primary shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="맛집 이름, 지역, 태그로 찾아보세요 🔍"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none font-medium"
              autoFocus
            />
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="p-1.5 rounded-full hover:bg-muted/50 transition-all"
              aria-label="검색 닫기"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center gap-2.5 bg-secondary/70 rounded-[18px] px-4 py-3 text-[13px] text-muted-foreground hover:bg-secondary hover:shadow-md transition-all font-semibold border border-transparent hover:border-primary/10"
          >
            <Search className="w-4.5 h-4.5" />
            맛집을 검색해보세요 ✨
          </button>
        )}
      </div>

      <CategoryFilter
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* 맛집 리스트 */}
      <div className="max-w-lg mx-auto px-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] text-muted-foreground font-semibold">
            총 {filteredRestaurants.length}개의 맛집 🍽️
          </p>
        </div>

        {filteredRestaurants.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onToggleFavorite={handleToggleFavorite}
                onSelect={setSelectedRestaurant}
              />
            ))}
          </div>
        ) : (
          <EmptyState category={selectedCategory} />
        )}
      </div>

      {/* FAB 추가 버튼 */}
      <div className="fixed bottom-6 right-0 left-0 max-w-lg mx-auto px-5 flex justify-end z-40">
        <button
          type="button"
          onClick={handleFabClick}
          className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-primary to-accent text-white shadow-2xl shadow-primary/30 hover:shadow-3xl hover:shadow-primary/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
          aria-label="맛집 추가"
        >
          <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* 시트 */}
      <AddRestaurantSheet
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setEditingRestaurant(null);
        }}
        onAdd={editingRestaurant ? handleUpdateRestaurant : handleAddRestaurant}
        editingRestaurant={editingRestaurant}
        restaurants={restaurants}
      />
      <RestaurantDetailSheet
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDeleteRestaurant}
        onEdit={handleEdit}
        currentUserId={user?.id}
      />
      <AuthSheet isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </main>
  );
}
