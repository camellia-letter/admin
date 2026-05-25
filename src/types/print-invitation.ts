/**
 * 실물 청첩장 PDF 출력 관련 타입 정의
 */

/**
 * 실물 청첩장 레이아웃 유형
 */
export type PrintLayoutType = 'single' | 'double' | 'bifold' | 'trifold';

/**
 * 실물 청첩장 용지 크기
 */
export type PaperSize = 'A5' | 'A4' | 'DL' | 'custom';

/**
 * 실물 청첩장 템플릿
 */
export type PrintTemplate =
  | 'classic-simple'
  | 'classic-photo'
  | 'modern-minimal'
  | 'modern-bifold'
  | 'romantic-floral'
  | 'romantic-bifold'
  | 'elegant-gold'
  | 'nature-green'
  | 'vintage-beige';

/**
 * QR 코드 위치
 */
export type QRCodePosition = 'top-right' | 'bottom-center' | 'bottom-right';

/**
 * QR 코드 크기
 */
export type QRCodeSize = 'small' | 'medium' | 'large';

/**
 * QR 코드 설정
 */
export interface QRCodeConfig {
  enabled: boolean;
  url: string;
  position: QRCodePosition;
  size: QRCodeSize;
  label?: string;
}

/**
 * 포함할 콘텐츠 요소
 */
export interface PrintContentElements {
  message: boolean; // 인사말
  gallery: boolean; // 갤러리 (대표 이미지)
  galleryImageCount: 1 | 2 | 3; // 갤러리 이미지 개수
  transport: boolean; // 교통편 안내
  contactInfo: boolean; // 연락처
  accountInfo: boolean; // 계좌번호
  qrCode: QRCodeConfig; // QR 코드
}

/**
 * 커스텀 색상 설정
 */
export interface PrintCustomColors {
  primary?: string;
  secondary?: string;
  text?: string;
  background?: string;
  accent?: string;
}

/**
 * 커스텀 폰트 크기 설정
 */
export interface PrintCustomFontSizes {
  title?: number; // 타이틀 폰트 크기 (기본값 템플릿별 상이)
  heading?: number; // 제목 폰트 크기
  body?: number; // 본문 폰트 크기
  caption?: number; // 캡션/라벨 폰트 크기
}

/**
 * 실물 청첩장 전체 설정
 */
export interface PrintInvitationConfig {
  layoutType: PrintLayoutType; // 레이아웃 유형
  template: PrintTemplate; // 템플릿
  paperSize: PaperSize; // 용지 크기
  elements: PrintContentElements; // 포함 요소

  // 디자인 커스터마이징
  customFontFamily?: string; // 폰트 (없으면 테마 폰트 사용)
  customColors?: PrintCustomColors; // 색상 (없으면 테마 색상 사용)
  customFontSizes?: PrintCustomFontSizes; // 폰트 크기 (없으면 템플릿 기본값)

  // 메타데이터
  createdAt?: string;
  updatedAt?: string;
}

/**
 * PDF 생성 옵션
 */
export interface PDFGenerationOptions {
  config: PrintInvitationConfig;
  dpi?: 300 | 600; // 해상도
  colorMode?: 'CMYK' | 'RGB'; // 색상 모드
  bleed?: number; // 출혈(mm)
}

/**
 * 기본 QR 코드 설정
 */
export const DEFAULT_QR_CODE_CONFIG: QRCodeConfig = {
  enabled: true,
  url: '',
  position: 'bottom-center',
  size: 'medium',
  label: '모바일 청첩장 보기',
};

/**
 * 기본 콘텐츠 요소 설정
 */
export const DEFAULT_PRINT_CONTENT_ELEMENTS: PrintContentElements = {
  message: true,
  gallery: true,
  galleryImageCount: 2,
  transport: false,
  contactInfo: false,
  accountInfo: false,
  qrCode: DEFAULT_QR_CODE_CONFIG,
};

/**
 * 기본 실물 청첩장 설정
 */
export const DEFAULT_PRINT_INVITATION_CONFIG: PrintInvitationConfig = {
  layoutType: 'double',
  template: 'classic-simple',
  paperSize: 'A5',
  elements: DEFAULT_PRINT_CONTENT_ELEMENTS,
};
