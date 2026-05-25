export interface GuestBook {
  id: string;
  invitationId: string;
  name: string;
  message: string;
  password?: string;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGuestBookDto {
  invitationId: string;
  name: string;
  message: string;
  password?: string;
}

export interface UpdateGuestBookDto {
  isVisible?: boolean;
}

export interface DeleteGuestBookDto {
  password?: string;
}
