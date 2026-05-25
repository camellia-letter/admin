export interface Invitation {
    id: string;
    slug?: string | null;
    groomName: string;
    brideName: string;
    weddingDate: string;
    venue: string;
    venueAddress: string;
    venueLat?: number;
    venueLng?: number;
    mainImageUrl: string;
    message?: string;
    blocks: InvitationBlock[];
    theme?: InvitationTheme;
    viewCount: number;
    shareCount: number;
    createdAt: Date;
    updatedAt: Date;
}
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
export type ThemePreset = 'classic' | 'modern' | 'nature' | 'elegant' | 'romantic' | 'minimal' | 'spring' | 'summer' | 'autumn' | 'winter' | 'navy' | 'burgundy' | 'forest' | 'beach' | 'garden' | 'midnight' | 'sunset' | 'custom';
export type FontFamily = 'pretendard' | 'noto-serif' | 'gowun-batang' | 'nanum-myeongjo' | 'cafe24-surround';
export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
}
export interface GradientConfig {
    enabled: boolean;
    type: 'linear' | 'radial';
    direction: 'to-b' | 'to-t' | 'to-r' | 'to-l' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl';
    fromColor: string;
    viaColor?: string;
    toColor: string;
}
export interface InvitationTheme {
    preset: ThemePreset;
    colors: ThemeColors;
    fontFamily: FontFamily;
    borderRadius?: 'none' | 'small' | 'medium' | 'large';
    gradient?: GradientConfig;
}
export type BlockType = 'HERO' | 'MESSAGE' | 'INFO' | 'MAP' | 'GALLERY' | 'GUESTBOOK' | 'ACCOUNT' | 'TRANSPORT' | 'RSVP';
export interface HeroBlockData {
    imageUrl: string;
    altText?: string;
}
export interface MessageBlockData {
    title?: string;
    content?: string;
}
export interface GalleryImage {
    url: string;
    caption?: string;
}
export interface GalleryBlockData {
    images?: GalleryImage[];
}
export interface AccountInfo {
    bank: string;
    accountNumber: string;
    holder: string;
}
export interface AccountBlockData {
    groomTitle?: string;
    groomAccounts: AccountInfo[];
    brideTitle?: string;
    brideAccounts: AccountInfo[];
}
export type TransportType = 'subway' | 'bus' | 'car' | 'shuttle' | 'other';
export interface TransportItem {
    type: TransportType;
    title: string;
    description: string;
}
export interface TransportBlockData {
    title?: string;
    items: TransportItem[];
    parkingInfo?: string;
}
export interface InfoBlockData {
    groomName?: string;
    brideName?: string;
    weddingDate?: string;
    venue?: string;
    venueAddress?: string;
}
export interface MapBlockData {
    lat?: number;
    lng?: number;
    venue?: string;
    venueAddress?: string;
}
export interface GuestbookBlockData {
    title?: string;
    description?: string;
    showPasswordField?: boolean;
}
export type AttendanceStatus = 'attending' | 'not_attending' | 'undecided';
export type MealType = 'standard' | 'vegetarian' | 'none';
export interface RsvpBlockData {
    title?: string;
    description?: string;
    deadline?: string;
    showMealOption?: boolean;
    showGuestCount?: boolean;
}
export interface BlockDataByType {
    HERO: HeroBlockData;
    MESSAGE: MessageBlockData;
    INFO: InfoBlockData;
    MAP: MapBlockData;
    GALLERY: GalleryBlockData;
    GUESTBOOK: GuestbookBlockData;
    ACCOUNT: AccountBlockData;
    TRANSPORT: TransportBlockData;
    RSVP: RsvpBlockData;
}
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
}
export declare const THEME_PRESETS: Record<Exclude<ThemePreset, 'custom'>, {
    name: string;
    colors: ThemeColors;
}>;
export declare const DEFAULT_THEME: InvitationTheme;
