import { createTheme } from '@mantine/core';

export const colors = {
  dark: [
    '#C1C2C5',
    '#A6A7AB',
    '#909296',
    '#5C5F66',
    '#373A40',
    '#2C2E33',
    '#25262b',
    '#1A1B1E',
    '#141517',
    '#101113',
  ],
  gray: [
    '#F8F9FA',
    '#F1F3F5',
    '#E9ECEF',
    '#DEE2E6',
    '#CED4DA',
    '#ADB5BD',
    '#868E96',
    '#495057',
    '#343A40',
    '#212529',
  ],
  red: [
    '#FFF5F5',
    '#FFE3E3',
    '#FFC9C9',
    '#FFA8A8',
    '#FF8787',
    '#FF6B6B',
    '#FA5252',
    '#F03E3E',
    '#E03131',
    '#C92A2A',
  ],
  pink: [
    '#FFF0F6',
    '#FFDEEB',
    '#FCC2D7',
    '#FAA2C1',
    '#F783AC',
    '#F06595',
    '#E64980',
    '#D6336C',
    '#C2255C',
    '#A61E4D',
  ],
  grape: [
    '#F8F0FC',
    '#F3D9FA',
    '#EEBEFA',
    '#E599F7',
    '#DA77F2',
    '#CC5DE8',
    '#BE4BDB',
    '#AE3EC9',
    '#9C36B5',
    '#862E9C',
  ],
  violet: [
    '#F3F0FF',
    '#E5DBFF',
    '#D0BFFF',
    '#B197FC',
    '#9775FA',
    '#845EF7',
    '#7950F2',
    '#7048E8',
    '#6741D9',
    '#5F3DC4',
  ],
  indigo: [
    '#EDF2FF',
    '#DBE4FF',
    '#BAC8FF',
    '#91A7FF',
    '#748FFC',
    '#5C7CFA',
    '#4C6EF5',
    '#4263EB',
    '#3B5BDB',
    '#364FC7',
  ],
  blue: [
    '#E7F5FF',
    '#D0EBFF',
    '#A5D8FF',
    '#74C0FC',
    '#4DABF7',
    '#339AF0',
    '#228BE6',
    '#1C7ED6',
    '#1971C2',
    '#1864AB',
  ],
  cyan: [
    '#E3FAFC',
    '#C5F6FA',
    '#99E9F2',
    '#66D9E8',
    '#3BC9DB',
    '#22B8CF',
    '#15AABF',
    '#1098AD',
    '#0C8599',
    '#0B7285',
  ],
  teal: [
    '#E6FCF5',
    '#C3FAE8',
    '#96F2D7',
    '#63E6BE',
    '#38D9A9',
    '#20C997',
    '#12B886',
    '#0CA678',
    '#099268',
    '#087F5B',
  ],
  green: [
    '#EBFBEE',
    '#D3F9D8',
    '#B2F2BB',
    '#8CE99A',
    '#69DB7C',
    '#51CF66',
    '#40C057',
    '#37B24D',
    '#2F9E44',
    '#2B8A3E',
  ],
  lime: [
    '#F4FCE3',
    '#E9FAC8',
    '#D8F5A2',
    '#C0EB75',
    '#A9E34B',
    '#94D82D',
    '#82C91E',
    '#74B816',
    '#66A80F',
    '#5C940D',
  ],
  yellow: [
    '#FFF9DB',
    '#FFF3BF',
    '#FFEC99',
    '#FFE066',
    '#FFD43B',
    '#FCC419',
    '#FAB005',
    '#F59F00',
    '#F08C00',
    '#E67700',
  ],
  orange: [
    '#FFF4E6',
    '#FFE8CC',
    '#FFD8A8',
    '#FFC078',
    '#FFA94D',
    '#FF922B',
    '#FD7E14',
    '#F76707',
    '#E8590C',
    '#D9480F',
  ],
  white: [
    '#FFFFFF',
    '#FFFFFF',
    '#FFFFFF',
    '#FFFFFF',
    '#FFFFFF',
    '#FFFFFF',
    '#FFFFFF',
    '#FFFFFF',
    '#FFFFFF',
    '#FFFFFF',
  ],
} as const;

// 디자인 토큰 - Mantine 기본값 기반
export const fontSizes = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  md: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
} as const;

export const spacing = {
  xs: '0.625rem', // 10px
  sm: '0.75rem', // 12px
  md: '1rem', // 16px
  lg: '1.25rem', // 20px
  xl: '1.5rem', // 24px
} as const;

export const radius = {
  xs: '0.125rem', // 2px
  sm: '0.25rem', // 4px
  md: '0.5rem', // 8px
  lg: '1rem', // 16px
  xl: '2rem', // 32px
} as const;

export const lineHeights = {
  xs: '1.4',
  sm: '1.45',
  md: '1.55',
  lg: '1.6',
  xl: '1.65',
} as const;

export const breakpoints = {
  xs: '36em', // 576px - Mobile
  sm: '48em', // 768px - Tablet
  md: '62em', // 992px - Desktop
  lg: '75em', // 1200px - Large Desktop
  xl: '88em', // 1408px - Extra Large
} as const;

export const headings = {
  sizes: {
    h1: { fontSize: '2.125rem', lineHeight: '1.3', fontWeight: '700' }, // 34px
    h2: { fontSize: '1.625rem', lineHeight: '1.35', fontWeight: '700' }, // 26px
    h3: { fontSize: '1.375rem', lineHeight: '1.4', fontWeight: '700' }, // 22px
    h4: { fontSize: '1.125rem', lineHeight: '1.45', fontWeight: '700' }, // 18px
    h5: { fontSize: '1rem', lineHeight: '1.5', fontWeight: '700' }, // 16px
    h6: { fontSize: '0.875rem', lineHeight: '1.5', fontWeight: '700' }, // 14px
  },
} as const;

export const theme = createTheme({
  colors,
  fontSizes,
  spacing,
  radius,
  lineHeights,
  breakpoints,
  headings,
});
