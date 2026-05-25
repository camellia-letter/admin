import { AxiosError } from 'axios';
import { ApiErrorResponse, ErrorCode, ERROR_MESSAGES, isRetryableError } from '@/types/invitation';

export interface ParsedError {
  code: ErrorCode;
  message: string;
  isRetryable: boolean;
}

/**
 * API 에러를 파싱하여 표준화된 형식으로 변환
 */
export function parseApiError(error: unknown): ParsedError {
  // Axios 에러인 경우
  if (error instanceof AxiosError) {
    // 네트워크 에러 (응답 없음)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return {
          code: ErrorCode.TIMEOUT,
          message: ERROR_MESSAGES[ErrorCode.TIMEOUT],
          isRetryable: true,
        };
      }
      return {
        code: ErrorCode.NETWORK_ERROR,
        message: ERROR_MESSAGES[ErrorCode.NETWORK_ERROR],
        isRetryable: true,
      };
    }

    // API 에러 응답 (표준화된 형식)
    const apiError = error.response.data as ApiErrorResponse;
    if (apiError?.error?.code) {
      const code = apiError.error.code as ErrorCode;
      return {
        code,
        message: apiError.error.message || ERROR_MESSAGES[code],
        isRetryable: isRetryableError(code),
      };
    }

    // HTTP 상태 코드 기반 기본 에러
    const status = error.response.status;
    if (status === 401) {
      return {
        code: ErrorCode.UNAUTHORIZED,
        message: ERROR_MESSAGES[ErrorCode.UNAUTHORIZED],
        isRetryable: false,
      };
    }
    if (status === 403) {
      return {
        code: ErrorCode.FORBIDDEN,
        message: ERROR_MESSAGES[ErrorCode.FORBIDDEN],
        isRetryable: false,
      };
    }
    if (status === 404) {
      return {
        code: ErrorCode.NOT_FOUND,
        message: ERROR_MESSAGES[ErrorCode.NOT_FOUND],
        isRetryable: false,
      };
    }
    if (status >= 500) {
      return {
        code: ErrorCode.INTERNAL_ERROR,
        message: ERROR_MESSAGES[ErrorCode.INTERNAL_ERROR],
        isRetryable: true,
      };
    }

    return {
      code: ErrorCode.VALIDATION_ERROR,
      message: ERROR_MESSAGES[ErrorCode.VALIDATION_ERROR],
      isRetryable: false,
    };
  }

  // 일반 Error 객체
  if (error instanceof Error) {
    return {
      code: ErrorCode.INTERNAL_ERROR,
      message: error.message || ERROR_MESSAGES[ErrorCode.INTERNAL_ERROR],
      isRetryable: false,
    };
  }

  // 알 수 없는 에러
  return {
    code: ErrorCode.INTERNAL_ERROR,
    message: '알 수 없는 오류가 발생했습니다.',
    isRetryable: false,
  };
}

/**
 * 에러 메시지 추출 (간단한 버전)
 */
export function getErrorMessage(error: unknown): string {
  return parseApiError(error).message;
}
