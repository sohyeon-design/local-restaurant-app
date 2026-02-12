export interface Restaurant {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  memo: string;
  visitDate: string;
  isFavorite: boolean;
  tags: string[];
  userId: string;
  createdAt?: string;
}

export const CATEGORIES = [
  { label: "전체", value: "all", icon: "🍽️" },
  { label: "한식", value: "한식", icon: "🍚" },
  { label: "일식", value: "일식", icon: "🍣" },
  { label: "중식", value: "중식", icon: "🥟" },
  { label: "양식", value: "양식", icon: "🍝" },
  { label: "카페", value: "카페", icon: "☕" },
  { label: "술집", value: "술집", icon: "🍺" },
  { label: "분식", value: "분식", icon: "🍜" },
] as const;

export const LOCATIONS = [
  "종로구",
  "중구",
  "용산구",
  "성동구",
  "광진구",
  "마포구",
  "서대문구",
  "강남구",
  "서초구",
  "송파구",
  "영등포구",
  "성북구",
  "관악구",
  "동작구",
  "강서구",
] as const;

export const SAMPLE_RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "을지로 골목 칼국수",
    category: "한식",
    location: "중구",
    rating: 5,
    memo: "할머니가 직접 반죽하시는 손칼국수. 멸치 육수가 끝내줌. 점심시간에 줄 서야 함.",
    visitDate: "2026-01-15",
    isFavorite: false,
    tags: ["줄서는맛집", "혼밥가능"],
    userId: "sample-user",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "합정 스시 오마카세",
    category: "일식",
    location: "마포구",
    rating: 4,
    memo: "가성비 좋은 오마카세. 런치 코스 3만원대. 사장님이 친절하심.",
    visitDate: "2026-01-22",
    isFavorite: false,
    tags: ["데이트", "예약필수"],
    userId: "sample-user",
    createdAt: "2026-01-22T12:00:00Z",
  },
  {
    id: "3",
    name: "연남동 카페 숲",
    category: "카페",
    location: "마포구",
    rating: 4,
    memo: "인테리어 감성 최고. 디저트 맛있고 커피도 좋음. 2층 창가석 추천.",
    visitDate: "2026-02-01",
    isFavorite: false,
    tags: ["감성카페", "디저트맛집"],
    userId: "sample-user",
    createdAt: "2026-02-01T14:00:00Z",
  },
  {
    id: "4",
    name: "성수 양꼬치 달인",
    category: "중식",
    location: "성동구",
    rating: 5,
    memo: "양꼬치 + 칭따오 조합 최고. 마라탕도 맛있음. 직장인들 퇴근 후 많이 감.",
    visitDate: "2026-01-28",
    isFavorite: false,
    tags: ["회식", "야식"],
    userId: "sample-user",
    createdAt: "2026-01-28T18:00:00Z",
  },
  {
    id: "5",
    name: "을지로 노가리 골목",
    category: "술집",
    location: "중구",
    rating: 4,
    memo: "을지로 감성 제대로 느낄 수 있는 곳. 노가리에 맥주 한 잔. 겨울엔 포장마차 느낌.",
    visitDate: "2026-02-05",
    isFavorite: false,
    tags: ["을지로감성", "친구모임"],
    userId: "sample-user",
    createdAt: "2026-02-05T19:00:00Z",
  },
  {
    id: "6",
    name: "망원동 떡볶이 할매",
    category: "분식",
    location: "마포구",
    rating: 5,
    memo: "옛날식 떡볶이 맛집. 튀김도 바삭바삭. 현금만 됨 주의!",
    visitDate: "2026-02-08",
    isFavorite: false,
    tags: ["추억의맛", "현금전용"],
    userId: "sample-user",
    createdAt: "2026-02-08T13:00:00Z",
  },
];
