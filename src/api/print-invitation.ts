import apiClient from './client';
import type { PrintInvitationConfig } from '@camellia/shared-types';

/**
 * 실물 청첩장 설정 조회
 */
export const getPrintConfig = async (
  invitationId: string,
): Promise<PrintInvitationConfig | null> => {
  const { data } = await apiClient.get(`/api/invitations/${invitationId}/print/config`);
  return data;
};

/**
 * 실물 청첩장 설정 저장
 */
export const savePrintConfig = async (
  invitationId: string,
  config: PrintInvitationConfig,
): Promise<{ message: string; data: PrintInvitationConfig }> => {
  const { data } = await apiClient.post(`/api/invitations/${invitationId}/print/config`, config);
  return data;
};

/**
 * 실물 청첩장 PDF 다운로드
 */
export const downloadPrintPDF = async (
  invitationId: string,
  config: PrintInvitationConfig,
): Promise<void> => {
  const response = await apiClient.post(
    `/api/invitations/${invitationId}/print/generate-pdf`,
    config,
    {
      responseType: 'blob',
    },
  );

  // Blob을 파일로 다운로드
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = `invitation_${invitationId}_${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * 실물 청첩장 PDF Blob 생성 (미리보기용)
 */
export const generatePrintPDFBlob = async (
  invitationId: string,
  config: PrintInvitationConfig,
): Promise<Blob> => {
  const response = await apiClient.post(
    `/api/invitations/${invitationId}/print/generate-pdf`,
    config,
    {
      responseType: 'blob',
    },
  );

  return new Blob([response.data], { type: 'application/pdf' });
};
