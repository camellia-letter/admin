export type PrintLayoutType = 'single' | 'double' | 'bifold' | 'trifold';
export type PaperSize = 'A5' | 'A4' | 'DL' | 'custom';
export type PrintTemplate = 'classic-simple' | 'classic-photo' | 'modern-minimal' | 'modern-bifold' | 'romantic-floral' | 'romantic-bifold' | 'elegant-gold' | 'nature-green' | 'vintage-beige';
export type QRCodePosition = 'top-right' | 'bottom-center' | 'bottom-right';
export type QRCodeSize = 'small' | 'medium' | 'large';
export interface QRCodeConfig {
    enabled: boolean;
    url: string;
    position: QRCodePosition;
    size: QRCodeSize;
    label?: string;
}
export interface PrintContentElements {
    message: boolean;
    gallery: boolean;
    galleryImageCount: 1 | 2 | 3;
    transport: boolean;
    contactInfo: boolean;
    accountInfo: boolean;
    qrCode: QRCodeConfig;
}
export interface PrintCustomColors {
    primary?: string;
    secondary?: string;
    text?: string;
    background?: string;
    accent?: string;
}
export interface PrintCustomFontSizes {
    title?: number;
    heading?: number;
    body?: number;
    caption?: number;
}
export interface PrintInvitationConfig {
    layoutType: PrintLayoutType;
    template: PrintTemplate;
    paperSize: PaperSize;
    elements: PrintContentElements;
    customFontFamily?: string;
    customColors?: PrintCustomColors;
    customFontSizes?: PrintCustomFontSizes;
    createdAt?: string;
    updatedAt?: string;
}
export interface PDFGenerationOptions {
    config: PrintInvitationConfig;
    dpi?: 300 | 600;
    colorMode?: 'CMYK' | 'RGB';
    bleed?: number;
}
export declare const DEFAULT_QR_CODE_CONFIG: QRCodeConfig;
export declare const DEFAULT_PRINT_CONTENT_ELEMENTS: PrintContentElements;
export declare const DEFAULT_PRINT_INVITATION_CONFIG: PrintInvitationConfig;
