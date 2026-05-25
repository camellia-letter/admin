export interface Invitation {
  id: string;
  slug?: string | null;
  groomName: string;
  brideName: string;
  weddingDate: string; // ISO string
  venue: string;
  venueAddress: string;
  venueLat?: number;
  venueLng?: number;
  mainImageUrl?: string | null;
  message?: string;
  blocks: InvitationBlock[];
  theme?: InvitationTheme;
  viewCount: number;
  shareCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// 통계 타입
export interface InvitationStats {
  viewCount: number;
  shareCount: number;
  guestbookCount: number;
  rsvpStats: {
    total: number;
    attending: number;
    notAttending: number;
    undecided: number;
    totalGuests: number;
    groomSide: number;
    brideSide: number;
  };
}

// 테마 타입
export type ThemePreset =
  | 'classic' // 클래식 (로즈/핑크)
  | 'modern' // 모던 (블랙/화이트)
  | 'nature' // 내추럴 (그린)
  | 'elegant' // 엘레강스 (골드/베이지)
  | 'romantic' // 로맨틱 (퍼플/라벤더)
  | 'minimal' // 미니멀 (그레이)
  | 'spring' // 봄 (벚꽃)
  | 'summer' // 여름 (바다)
  | 'autumn' // 가을 (단풍)
  | 'winter' // 겨울 (눈)
  | 'navy' // 네이비
  | 'burgundy' // 버건디
  | 'forest' // 숲 (딥그린)
  | 'beach' // 해변 (샌드/터콰이즈)
  | 'garden' // 정원 (플로럴)
  | 'midnight' // 미드나잇 (다크블루)
  | 'sunset' // 선셋 (오렌지/퍼플)
  | 'custom'; // 커스텀

export type FontFamily =
  | 'pretendard' // 프리텐다드 (기본)
  | 'noto-serif' // 노토 세리프
  | 'gowun-batang' // 고운 바탕
  | 'nanum-myeongjo' // 나눔 명조
  | 'cafe24-surround'; // 카페24 써라운드

export interface ThemeColors {
  primary: string; // 메인 색상
  secondary: string; // 보조 색상
  background: string; // 배경 색상
  text: string; // 텍스트 색상
  accent: string; // 강조 색상
}

// 그라디언트 설정
export interface GradientConfig {
  enabled: boolean;
  type: 'linear' | 'radial';
  direction: 'to-b' | 'to-t' | 'to-r' | 'to-l' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'; // linear 방향
  fromColor: string;
  viaColor?: string; // 중간 색상 (선택)
  toColor: string;
}

export interface InvitationTheme {
  preset: ThemePreset;
  colors: ThemeColors;
  fontFamily: FontFamily;
  borderRadius?: 'none' | 'small' | 'medium' | 'large'; // 모서리 둥글기
  gradient?: GradientConfig; // 그라디언트 배경
}

export type BlockType =
  | 'HEADER' // 헤더 (신랑 & 신부 이름)
  | 'HERO' // 메인 이미지
  | 'MESSAGE' // 인사말
  | 'INFO' // 예식 정보
  | 'PARENTS' // 부모님 성함
  | 'MAP' // 오시는 길
  | 'GALLERY' // 갤러리
  | 'GUESTBOOK' // 방명록
  | 'ACCOUNT' // 계좌 정보
  | 'TRANSPORT' // 교통 안내
  | 'RSVP'; // 참석 여부

// Header 블록 데이터 타입
export interface HeaderBlockData {
  showTitle?: boolean; // WEDDING INVITATION 표시 여부
}

// Hero 블록 데이터 타입
export interface HeroBlockData {
  imageUrl: string;
  altText?: string;
}

// Message 블록 데이터 타입
export interface MessageBlockData {
  title?: string;
  content?: string;
}

// Gallery 블록 데이터 타입
export interface GalleryImage {
  url: string;
  caption?: string;
}

export interface GalleryBlockData {
  images?: GalleryImage[];
}

// 계좌 정보 타입
export interface AccountInfo {
  bank: string; // 은행명
  accountNumber: string; // 계좌번호
  holder: string; // 예금주
}

export interface AccountBlockData {
  title?: string; // 블록 제목 (기본: "마음 전하실 곳")
  description?: string; // 안내 문구
  initialCollapsed?: boolean; // 초기 접힌 상태 여부 (기본: true)
  groomTitle?: string; // 신랑측 타이틀 (기본: "신랑측")
  groomAccounts: AccountInfo[];
  brideTitle?: string; // 신부측 타이틀 (기본: "신부측")
  brideAccounts: AccountInfo[];
}

// 교통 안내 타입
export type TransportType = 'subway' | 'bus' | 'car' | 'shuttle' | 'other';

export interface TransportItem {
  type: TransportType;
  title: string; // 예: "지하철", "버스", "자가용", "셔틀버스"
  description: string; // 상세 안내
}

export interface TransportBlockData {
  title?: string; // 섹션 타이틀 (기본: "오시는 길 안내")
  items: TransportItem[];
  parkingInfo?: string; // 주차 안내 (별도)
}

// Info 블록 데이터 타입
export interface InfoBlockData {
  groomName?: string;
  brideName?: string;
  weddingDate?: string;
  venue?: string;
  venueAddress?: string;
}

// Parents 블록 데이터 타입
export interface ParentsBlockData {
  groomFatherName?: string;
  groomMotherName?: string;
  brideFatherName?: string;
  brideMotherName?: string;
}

// Map 블록 데이터 타입
export interface MapBlockData {
  lat?: number;
  lng?: number;
  venue?: string;
  venueAddress?: string;
}

// Guestbook 블록 데이터 타입
export interface GuestbookBlockData {
  title?: string;
  description?: string;
  showPasswordField?: boolean;
}

// RSVP 타입
export type AttendanceStatus = 'attending' | 'not_attending' | 'undecided';
export type MealType = 'standard' | 'vegetarian' | 'none';

export interface RsvpBlockData {
  title?: string; // 섹션 타이틀 (기본: "참석 여부")
  description?: string; // 안내 문구
  deadline?: string; // 응답 마감일 (ISO string)
  showMealOption?: boolean; // 식사 옵션 표시 여부
  showGuestCount?: boolean; // 동반 인원 입력 표시 여부
}

/** BlockType → 블록 데이터 타입 매핑 */
export interface BlockDataByType {
  HEADER: HeaderBlockData;
  HERO: HeroBlockData;
  MESSAGE: MessageBlockData;
  INFO: InfoBlockData;
  PARENTS: ParentsBlockData;
  MAP: MapBlockData;
  GALLERY: GalleryBlockData;
  GUESTBOOK: GuestbookBlockData;
  ACCOUNT: AccountBlockData;
  TRANSPORT: TransportBlockData;
  RSVP: RsvpBlockData;
}

/** Discriminated union — switch(block.type)으로 block.data 자동 narrowing */
export type InvitationBlock = {
  [K in BlockType]: {
    id: string;
    type: K;
    order: number;
    data: BlockDataByType[K];
  };
}[BlockType];

export interface CreateInvitationDto {
  groomName: string;
  brideName: string;
  weddingDate: string;
  venue: string;
  venueAddress: string;
  venueLat?: number;
  venueLng?: number;
  slug?: string;
}

export interface UpdateInvitationDto {
  groomName?: string;
  brideName?: string;
  weddingDate?: string;
  venue?: string;
  venueAddress?: string;
  message?: string;
  venueLat?: number | null;
  venueLng?: number | null;
  blocks?: InvitationBlock[];
  theme?: InvitationTheme;
  slug?: string | null;
  rsvpViewPassword?: string | null;
}

// 미리 정의된 테마 프리셋
export const THEME_PRESETS: Record<
  Exclude<ThemePreset, 'custom'>,
  { name: string; colors: ThemeColors }
> = {
  classic: {
    name: '클래식',
    colors: {
      primary: '#E11D48', // rose-600
      secondary: '#FDA4AF', // rose-300
      background: '#FFF1F2', // rose-50
      text: '#1F2937', // gray-800
      accent: '#BE123C', // rose-700
    },
  },
  modern: {
    name: '모던',
    colors: {
      primary: '#18181B', // zinc-900
      secondary: '#71717A', // zinc-500
      background: '#FFFFFF', // white
      text: '#18181B', // zinc-900
      accent: '#3F3F46', // zinc-700
    },
  },
  nature: {
    name: '내추럴',
    colors: {
      primary: '#16A34A', // green-600
      secondary: '#86EFAC', // green-300
      background: '#F0FDF4', // green-50
      text: '#1F2937', // gray-800
      accent: '#15803D', // green-700
    },
  },
  elegant: {
    name: '엘레강스',
    colors: {
      primary: '#CA8A04', // yellow-600
      secondary: '#FDE68A', // yellow-200
      background: '#FFFBEB', // amber-50
      text: '#78350F', // amber-900
      accent: '#A16207', // yellow-700
    },
  },
  romantic: {
    name: '로맨틱',
    colors: {
      primary: '#9333EA', // purple-600
      secondary: '#D8B4FE', // purple-300
      background: '#FAF5FF', // purple-50
      text: '#1F2937', // gray-800
      accent: '#7C3AED', // violet-600
    },
  },
  minimal: {
    name: '미니멀',
    colors: {
      primary: '#6B7280', // gray-500
      secondary: '#D1D5DB', // gray-300
      background: '#F9FAFB', // gray-50
      text: '#374151', // gray-700
      accent: '#4B5563', // gray-600
    },
  },
  spring: {
    name: '봄 (벚꽃)',
    colors: {
      primary: '#F472B6', // pink-400
      secondary: '#FBCFE8', // pink-200
      background: '#FDF2F8', // pink-50
      text: '#831843', // pink-900
      accent: '#EC4899', // pink-500
    },
  },
  summer: {
    name: '여름 (바다)',
    colors: {
      primary: '#0EA5E9', // sky-500
      secondary: '#7DD3FC', // sky-300
      background: '#F0F9FF', // sky-50
      text: '#0C4A6E', // sky-900
      accent: '#0284C7', // sky-600
    },
  },
  autumn: {
    name: '가을 (단풍)',
    colors: {
      primary: '#EA580C', // orange-600
      secondary: '#FDBA74', // orange-300
      background: '#FFF7ED', // orange-50
      text: '#7C2D12', // orange-900
      accent: '#C2410C', // orange-700
    },
  },
  winter: {
    name: '겨울 (눈)',
    colors: {
      primary: '#0891B2', // cyan-600
      secondary: '#A5F3FC', // cyan-200
      background: '#ECFEFF', // cyan-50
      text: '#164E63', // cyan-900
      accent: '#0E7490', // cyan-700
    },
  },
  navy: {
    name: '네이비',
    colors: {
      primary: '#1E40AF', // blue-800
      secondary: '#BFDBFE', // blue-200
      background: '#EFF6FF', // blue-50
      text: '#1E3A8A', // blue-900
      accent: '#1D4ED8', // blue-700
    },
  },
  burgundy: {
    name: '버건디',
    colors: {
      primary: '#9F1239', // rose-800
      secondary: '#FECDD3', // rose-200
      background: '#FFF1F2', // rose-50
      text: '#881337', // rose-900
      accent: '#BE123C', // rose-700
    },
  },
  forest: {
    name: '숲',
    colors: {
      primary: '#166534', // green-800
      secondary: '#BBF7D0', // green-200
      background: '#F0FDF4', // green-50
      text: '#14532D', // green-900
      accent: '#15803D', // green-700
    },
  },
  beach: {
    name: '해변',
    colors: {
      primary: '#0D9488', // teal-600
      secondary: '#FDE68A', // amber-200
      background: '#F5F5F4', // stone-100
      text: '#44403C', // stone-700
      accent: '#14B8A6', // teal-500
    },
  },
  garden: {
    name: '정원',
    colors: {
      primary: '#DB2777', // pink-600
      secondary: '#A7F3D0', // emerald-200
      background: '#FDF2F8', // pink-50
      text: '#4C1D95', // violet-900
      accent: '#EC4899', // pink-500
    },
  },
  midnight: {
    name: '미드나잇',
    colors: {
      primary: '#6366F1', // indigo-500
      secondary: '#312E81', // indigo-900
      background: '#1E1B4B', // indigo-950
      text: '#E0E7FF', // indigo-100
      accent: '#818CF8', // indigo-400
    },
  },
  sunset: {
    name: '선셋',
    colors: {
      primary: '#F97316', // orange-500
      secondary: '#C084FC', // purple-400
      background: '#FFFBEB', // amber-50
      text: '#78350F', // amber-900
      accent: '#EA580C', // orange-600
    },
  },
};

// 기본 테마
export const DEFAULT_THEME: InvitationTheme = {
  preset: 'classic',
  colors: THEME_PRESETS.classic.colors,
  fontFamily: 'pretendard',
  borderRadius: 'medium',
};
