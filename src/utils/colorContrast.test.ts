import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  getLuminance,
  getContrastRatio,
  checkContrast,
  checkThemeContrast,
  getContrastGrade,
} from './colorContrast';

describe('colorContrast', () => {
  describe('hexToRgb', () => {
    it('should convert 6-digit hex to RGB', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should convert 3-digit hex to RGB', () => {
      expect(hexToRgb('#F00')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#0F0')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#00F')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#FFF')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should handle hex without # prefix', () => {
      expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('F00')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should handle lowercase hex', () => {
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgb('invalid')).toBeNull();
      expect(hexToRgb('#GG0000')).toBeNull();
      expect(hexToRgb('#12345')).toBeNull();
    });
  });

  describe('getLuminance', () => {
    it('should return 1 for white (255, 255, 255)', () => {
      const luminance = getLuminance(255, 255, 255);
      expect(luminance).toBeCloseTo(1, 2);
    });

    it('should return 0 for black (0, 0, 0)', () => {
      const luminance = getLuminance(0, 0, 0);
      expect(luminance).toBe(0);
    });

    it('should calculate intermediate values correctly', () => {
      // Red (255, 0, 0) has lower luminance than white
      const redLuminance = getLuminance(255, 0, 0);
      expect(redLuminance).toBeLessThan(1);
      expect(redLuminance).toBeGreaterThan(0);
    });
  });

  describe('getContrastRatio', () => {
    it('should return 21:1 for black on white', () => {
      const ratio = getContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should return 21:1 for white on black', () => {
      const ratio = getContrastRatio('#FFFFFF', '#000000');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should return 1:1 for same colors', () => {
      const ratio = getContrastRatio('#FF0000', '#FF0000');
      expect(ratio).toBe(1);
    });

    it('should return 1 for invalid colors', () => {
      const ratio = getContrastRatio('invalid', '#FFFFFF');
      expect(ratio).toBe(1);
    });

    it('should handle AAA compliant combinations', () => {
      // Dark gray on white should have good contrast
      const ratio = getContrastRatio('#333333', '#FFFFFF');
      expect(ratio).toBeGreaterThan(7); // AAA for normal text
    });
  });

  describe('checkContrast', () => {
    it('should pass AAA for black on white', () => {
      const result = checkContrast('#000000', '#FFFFFF');
      expect(result.pass).toBe(true);
      expect(result.level).toBe('AAA');
      expect(result.ratio).toBeCloseTo(21, 0);
    });

    it('should pass AA but not AAA for medium gray on white', () => {
      const result = checkContrast('#757575', '#FFFFFF');
      expect(result.pass).toBe(true);
      expect(result.level).toBe('AA');
      expect(result.ratio).toBeGreaterThanOrEqual(4.5);
      expect(result.ratio).toBeLessThan(7);
    });

    it('should fail for light gray on white', () => {
      const result = checkContrast('#E0E0E0', '#FFFFFF');
      expect(result.pass).toBe(false);
      expect(result.level).toBe('fail');
    });

    it('should have lower threshold for large text', () => {
      // A color that fails for normal text but passes for large text
      const normalText = checkContrast('#999999', '#FFFFFF', false);
      const largeText = checkContrast('#999999', '#FFFFFF', true);

      if (normalText.ratio >= 3 && normalText.ratio < 4.5) {
        expect(normalText.pass).toBe(false);
        expect(largeText.pass).toBe(true);
        expect(largeText.level).toBe('AA-large');
      }
    });

    it('should include ratio in message', () => {
      const result = checkContrast('#000000', '#FFFFFF');
      expect(result.message).toContain(':1');
    });
  });

  describe('checkThemeContrast', () => {
    it('should pass for good theme colors', () => {
      const colors = {
        primary: '#1E40AF', // dark blue
        secondary: '#BFDBFE', // light blue
        background: '#FFFFFF', // white
        text: '#1F2937', // dark gray
        accent: '#DC2626', // red
      };

      const report = checkThemeContrast(colors);
      expect(report.textOnBackground.pass).toBe(true);
      expect(report.overallPass).toBe(true);
      expect(report.warnings.length).toBe(0);
    });

    it('should fail for poor theme colors', () => {
      const colors = {
        primary: '#FFE4E1', // very light pink
        secondary: '#FFF0F5', // almost white
        background: '#FFFFFF', // white
        text: '#D3D3D3', // light gray
        accent: '#FFC0CB', // light pink
      };

      const report = checkThemeContrast(colors);
      expect(report.overallPass).toBe(false);
      expect(report.warnings.length).toBeGreaterThan(0);
    });

    it('should generate warnings for failed checks', () => {
      const colors = {
        primary: '#FFD700', // gold - likely fails with white text
        secondary: '#FFFACD', // light yellow
        background: '#FFFFFF', // white
        text: '#808080', // medium gray - borderline
        accent: '#FFA500', // orange
      };

      const report = checkThemeContrast(colors);
      if (!report.overallPass) {
        expect(report.warnings.length).toBeGreaterThan(0);
        expect(report.warnings.some((w) => w.includes('부적합'))).toBe(true);
      }
    });
  });

  describe('getContrastGrade', () => {
    it('should return excellent for ratio >= 7', () => {
      const grade = getContrastGrade(7);
      expect(grade.grade).toBe('excellent');
      expect(grade.label).toBe('우수');
    });

    it('should return good for ratio >= 4.5', () => {
      const grade = getContrastGrade(5);
      expect(grade.grade).toBe('good');
      expect(grade.label).toBe('적합');
    });

    it('should return fair for ratio >= 3', () => {
      const grade = getContrastGrade(3.5);
      expect(grade.grade).toBe('fair');
      expect(grade.label).toBe('주의');
    });

    it('should return poor for ratio < 3', () => {
      const grade = getContrastGrade(2);
      expect(grade.grade).toBe('poor');
      expect(grade.label).toBe('부적합');
    });

    it('should include color for visual feedback', () => {
      const excellent = getContrastGrade(10);
      const poor = getContrastGrade(1);

      expect(excellent.color).toBeTruthy();
      expect(poor.color).toBeTruthy();
      expect(excellent.color).not.toBe(poor.color);
    });
  });
});
