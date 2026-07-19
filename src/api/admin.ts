import apiClient from './client';
import type { PrintInvitationConfig } from '@camellia-letter/shared-types';

export interface AdminInvitation {
  id: string;
  groomName: string;
  brideName: string;
  weddingDate: Date;
  venue: string;
  slug: string | null;
  userId: string;
  user: {
    name: string | null;
    email: string | null;
  };
  hasPrintConfig: boolean;
  printConfigTemplate: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAllInvitationsParams {
  page?: number;
  limit?: number;
  search?: string;
  hasConfig?: boolean;
}

export interface PaginatedInvitationsResponse {
  message: string;
  data: {
    data: AdminInvitation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PrintInvitationStatsResponse {
  message: string;
  data: {
    totalInvitations: number;
    totalWithPrintConfig: number;
    configUsageRate: number;
    templateStats: Array<{
      template: string;
      count: number;
      percentage: number;
    }>;
    layoutStats: Array<{
      layout: string;
      count: number;
      percentage: number;
    }>;
    paperSizeStats: Array<{
      paperSize: string;
      count: number;
      percentage: number;
    }>;
  };
}

/**
 * 관리자 전용 API 클라이언트
 */

/**
 * 모든 청첩장 목록 조회 (관리자)
 */
export async function getAllInvitations(
  params: GetAllInvitationsParams = {},
): Promise<PaginatedInvitationsResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) {searchParams.set('page', params.page.toString());}
  if (params.limit) {searchParams.set('limit', params.limit.toString());}
  if (params.search) {searchParams.set('search', params.search);}
  if (params.hasConfig !== undefined) {searchParams.set('hasConfig', params.hasConfig.toString());}

  const url = `/api/admin/invitations${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await apiClient.get(url);
  return response.data;
}

/**
 * 특정 청첩장 실물 설정 조회 (관리자)
 */
export async function getInvitationPrintConfig(invitationId: string): Promise<{
  message: string;
  data: PrintInvitationConfig | null;
}> {
  const response = await apiClient.get(`/api/admin/invitations/${invitationId}/print/config`);
  return response.data;
}

/**
 * 실물 청첩장 통계 조회 (관리자)
 */
export async function getPrintInvitationStats(): Promise<PrintInvitationStatsResponse> {
  const response = await apiClient.get('/api/admin/print-invitations/stats');
  return response.data;
}

/**
 * User Management API
 */

export type UserStatus = 'PENDING' | 'ACTIVE' | 'REJECTED';

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  status: UserStatus;
  role: string;
  createdAt: Date;
  approvedBy: string | null;
  approvedAt: Date | null;
  rejectedBy: string | null;
  rejectedAt: Date | null;
  rejectionReason: string | null;
}

export interface GetUsersParams {
  status?: UserStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedUsersResponse {
  message: string;
  data: {
    users: AdminUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * 사용자 목록 조회 (관리자)
 */
export const getUsers = async (params: GetUsersParams = {}): Promise<PaginatedUsersResponse> => {
  const searchParams = new URLSearchParams();
  if (params.status) {searchParams.set('status', params.status);}
  if (params.page) {searchParams.set('page', params.page.toString());}
  if (params.limit) {searchParams.set('limit', params.limit.toString());}

  const url = `/api/admin/users${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await apiClient.get(url);
  return response.data;
};

/**
 * 사용자 승인 (관리자)
 */
export const approveUser = async (userId: string): Promise<{ message: string; data: AdminUser }> => {
  const response = await apiClient.post(`/api/admin/users/${userId}/approve`);
  return response.data;
};

/**
 * 사용자 거부 (관리자)
 */
export const rejectUser = async (userId: string, reason: string): Promise<{ message: string; data: AdminUser }> => {
  const response = await apiClient.post(`/api/admin/users/${userId}/reject`, { reason });
  return response.data;
};
