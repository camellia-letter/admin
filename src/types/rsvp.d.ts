import type { AttendanceStatus, MealType } from './invitation';
export interface Rsvp {
    id: string;
    invitationId: string;
    name: string;
    phoneNumber?: string;
    attendance: AttendanceStatus;
    guestCount?: number;
    mealType?: MealType;
    message?: string;
    side?: 'groom' | 'bride';
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
export interface RsvpStats {
    total: number;
    attending: number;
    notAttending: number;
    undecided: number;
    totalGuests: number;
    groomSide: number;
    brideSide: number;
}
