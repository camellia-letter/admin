/**
 * WCAG 색상 대비 검사 유틸리티
 * https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */

/**
 * HEX 색상을 RGB로 변환
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // 3자리 hex (#F00) → 6자리 확장 (#FF0000)
  const shortHex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
  if (shortHex) {
    hex = `#${shortHex[1]}${shortHex[1]}${shortHex[2]}${shortHex[2]}${shortHex[3]}${shortHex[3]}`;
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * RGB를 상대 휘도(Relative Luminance)로 변환
 * WCAG 2.1 공식 사용
 */
export function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * 두 색상 간의 대비율 계산 (WCAG 공식)
 * 반환값: 1:1 ~ 21:1 사이의 비율
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 1;

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG AA 기준 충족 여부 확인
 */
export type ContrastLevel = 'AAA' | 'AA' | 'AA-large' | 'fail';

export interface ContrastResult {
  ratio: number;
  level: ContrastLevel;
  pass: boolean;
  message: string;
}

/**
 * 대비율에 따른 WCAG 레벨 판정
 * - AAA: 7:1 이상 (일반 텍스트), 4.5:1 이상 (큰 텍스트)
 * - AA: 4.5:1 이상 (일반 텍스트), 3:1 이상 (큰 텍스트/UI)
 * - fail: 기준 미달
 */
export function checkContrast(
  foreground: string,
  background: string,
  isLargeText: boolean = false,
): ContrastResult {
  const ratio = getContrastRatio(foreground, background);
  const roundedRatio = Math.round(ratio * 100) / 100;

  // WCAG 기준
  const aaThreshold = isLargeText ? 3 : 4.5;
  const aaaThreshold = isLargeText ? 4.5 : 7;

  let level: ContrastLevel;
  let pass: boolean;
  let message: string;

  if (ratio >= aaaThreshold) {
    level = 'AAA';
    pass = true;
    message = `우수 (${roundedRatio}:1)`;
  } else if (ratio >= aaThreshold) {
    level = 'AA';
    pass = true;
    message = `적합 (${roundedRatio}:1)`;
  } else if (ratio >= 3 && isLargeText) {
    level = 'AA-large';
    pass = true;
    message = `큰 텍스트만 적합 (${roundedRatio}:1)`;
  } else {
    level = 'fail';
    pass = false;
    message = `부적합 (${roundedRatio}:1) - 최소 ${aaThreshold}:1 필요`;
  }

  return { ratio: roundedRatio, level, pass, message };
}

/**
 * 테마 색상 조합 전체 검사
 */
export interface ThemeContrastReport {
  textOnBackground: ContrastResult;
  primaryOnBackground: ContrastResult;
  whiteOnPrimary: ContrastResult;
  whiteOnAccent: ContrastResult;
  textOnSecondary: ContrastResult;
  overallPass: boolean;
  warnings: string[];
}

export function checkThemeContrast(colors: {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}): ThemeContrastReport {
  const textOnBackground = checkContrast(colors.text, colors.background);
  const primaryOnBackground = checkContrast(colors.primary, colors.background);
  const whiteOnPrimary = checkContrast('#FFFFFF', colors.primary);
  const whiteOnAccent = checkContrast('#FFFFFF', colors.accent);
  const textOnSecondary = checkContrast(colors.text, colors.secondary);

  const warnings: string[] = [];

  if (!textOnBackground.pass) {
    warnings.push(`본문 텍스트: ${textOnBackground.message}`);
  }
  if (!whiteOnPrimary.pass) {
    warnings.push(`메인 버튼 텍스트: ${whiteOnPrimary.message}`);
  }
  if (!whiteOnAccent.pass) {
    warnings.push(`강조 버튼 텍스트: ${whiteOnAccent.message}`);
  }
  if (!textOnSecondary.pass) {
    warnings.push(`보조 배경 텍스트: ${textOnSecondary.message}`);
  }

  const overallPass = textOnBackground.pass && whiteOnPrimary.pass && whiteOnAccent.pass;

  return {
    textOnBackground,
    primaryOnBackground,
    whiteOnPrimary,
    whiteOnAccent,
    textOnSecondary,
    overallPass,
    warnings,
  };
}

/**
 * 대비율에 따른 색상 등급 (시각적 표시용)
 */
export function getContrastGrade(ratio: number): {
  grade: 'excellent' | 'good' | 'fair' | 'poor';
  color: string;
  label: string;
} {
  if (ratio >= 7) {
    return { grade: 'excellent', color: '#16A34A', label: '우수' };
  } else if (ratio >= 4.5) {
    return { grade: 'good', color: '#2563EB', label: '적합' };
  } else if (ratio >= 3) {
    return { grade: 'fair', color: '#CA8A04', label: '주의' };
  } else {
    return { grade: 'poor', color: '#DC2626', label: '부적합' };
  }
}
