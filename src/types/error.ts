/**
 * API 에러 응답 타입
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
    path?: string;
  };
}

/**
 * API 성공 응답 타입
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * API 응답 타입 (성공 또는 실패)
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * 에러 코드 enum
 */
export enum ErrorCode {
  // 인증/권한 관련 (AUTH)
  UNAUTHORIZED = 'AUTH_001',
  FORBIDDEN = 'AUTH_002',
  TOKEN_EXPIRED = 'AUTH_003',

  // 리소스 관련 (RESOURCE)
  NOT_FOUND = 'RESOURCE_001',
  ALREADY_EXISTS = 'RESOURCE_002',
  CONFLICT = 'RESOURCE_003',

  // 유효성 검사 관련 (VALIDATION)
  VALIDATION_ERROR = 'VALIDATION_001',
  INVALID_INPUT = 'VALIDATION_002',

  // 서버 관련 (SERVER)
  INTERNAL_ERROR = 'SERVER_001',
  DATABASE_ERROR = 'SERVER_002',
  EXTERNAL_SERVICE_ERROR = 'SERVER_003',

  // 네트워크 관련 (NETWORK)
  NETWORK_ERROR = 'NETWORK_001',
  TIMEOUT = 'NETWORK_002',
}

/**
 * HTTP 상태 코드 -> 에러 코드 매핑
 */
export const HTTP_TO_ERROR_CODE: Record<number, ErrorCode> = {
  400: ErrorCode.VALIDATION_ERROR,
  401: ErrorCode.UNAUTHORIZED,
  403: ErrorCode.FORBIDDEN,
  404: ErrorCode.NOT_FOUND,
  409: ErrorCode.CONFLICT,
  500: ErrorCode.INTERNAL_ERROR,
};

/**
 * 사용자 친화적 에러 메시지
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.UNAUTHORIZED]: '로그인이 필요합니다.',
  [ErrorCode.FORBIDDEN]: '접근 권한이 없습니다.',
  [ErrorCode.TOKEN_EXPIRED]: '세션이 만료되었습니다. 다시 로그인해주세요.',
  [ErrorCode.NOT_FOUND]: '요청하신 정보를 찾을 수 없습니다.',
  [ErrorCode.ALREADY_EXISTS]: '이미 존재하는 정보입니다.',
  [ErrorCode.CONFLICT]: '다른 사용자가 수정 중입니다. 새로고침 후 다시 시도해주세요.',
  [ErrorCode.VALIDATION_ERROR]: '입력 정보를 확인해주세요.',
  [ErrorCode.INVALID_INPUT]: '올바르지 않은 입력입니다.',
  [ErrorCode.INTERNAL_ERROR]: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  [ErrorCode.DATABASE_ERROR]: '데이터 처리 중 오류가 발생했습니다.',
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: '외부 서비스 연결에 실패했습니다.',
  [ErrorCode.NETWORK_ERROR]: '네트워크 연결을 확인해주세요.',
  [ErrorCode.TIMEOUT]: '요청 시간이 초과되었습니다.',
};

/**
 * 재시도 가능한 에러 코드 목록
 */
export const RETRYABLE_ERROR_CODES: ErrorCode[] = [
  ErrorCode.NETWORK_ERROR,
  ErrorCode.TIMEOUT,
  ErrorCode.INTERNAL_ERROR,
  ErrorCode.EXTERNAL_SERVICE_ERROR,
];

/**
 * 에러가 재시도 가능한지 확인
 */
export function isRetryableError(code: ErrorCode): boolean {
  return RETRYABLE_ERROR_CODES.includes(code);
}
