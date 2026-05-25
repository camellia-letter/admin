import type { AttendanceStatus, MealType } from './invitation';

export interface Rsvp {
  id: string;
  invitationId: string;
  name: string;
  phoneNumber?: string;
  attendance: AttendanceStatus;
  guestCount?: number; // 본인 포함 참석 인원
  mealType?: MealType;
  message?: string; // 축하 메시지
  side?: 'groom' | 'bride'; // 신랑측/신부측
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRsvpDto {
  invitationId: string;
  name: string;
  phoneNumber?: string;
  attendance: AttendanceStatus;
  guestCount?: number;
  mealType?: MealType;
  message?: string;
  side?: 'groom' | 'bride';
}

export interface UpdateRsvpDto {
  attendance?: AttendanceStatus;
  guestCount?: number;
  mealType?: MealType;
  message?: string;
}

// RSVP 통계
export interface RsvpStats {
  total: number;
  attending: number;
  notAttending: number;
  undecided: number;
  totalGuests: number; // 참석 예정 총 인원 (동반 포함)
  groomSide: number;
  brideSide: number;
}
