import apiClient from './client';
import type { PrintInvitationConfig } from '@camellia/shared-types';

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
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.search) searchParams.set('search', params.search);
  if (params.hasConfig !== undefined) searchParams.set('hasConfig', params.hasConfig.toString());

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
