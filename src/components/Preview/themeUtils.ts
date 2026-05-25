import type { InvitationTheme, FontFamily } from '@camellia-letter/shared-types';
import { DEFAULT_THEME } from '@camellia-letter/shared-types';

// 색상을 투명도와 함께 반환
export function withAlpha(color: string, alpha: number): string {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 폰트 패밀리 CSS 값 매핑
export const FONT_FAMILY_MAP: Record<FontFamily, string> = {
  pretendard:
    "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  'noto-serif': "'Noto Serif KR', serif",
  'gowun-batang': "'Gowun Batang', serif",
  'nanum-myeongjo': "'Nanum Myeongjo', serif",
  'cafe24-surround': "'Cafe24Surround', sans-serif",
};

// 모서리 둥글기 CSS 값 매핑
export const BORDER_RADIUS_MAP: Record<string, string> = {
  none: '0',
  small: '0.25rem',
  medium: '0.5rem',
  large: '1rem',
};

export function getThemeStyles(theme: InvitationTheme | undefined) {
  const currentTheme = theme || DEFAULT_THEME;
  return {
    colors: currentTheme.colors,
    fontFamily: FONT_FAMILY_MAP[currentTheme.fontFamily] || FONT_FAMILY_MAP.pretendard,
    borderRadius: BORDER_RADIUS_MAP[currentTheme.borderRadius || 'medium'],
  };
}
