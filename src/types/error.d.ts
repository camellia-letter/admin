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
export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
}
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
export declare enum ErrorCode {
    UNAUTHORIZED = "AUTH_001",
    FORBIDDEN = "AUTH_002",
    TOKEN_EXPIRED = "AUTH_003",
    NOT_FOUND = "RESOURCE_001",
    ALREADY_EXISTS = "RESOURCE_002",
    CONFLICT = "RESOURCE_003",
    VALIDATION_ERROR = "VALIDATION_001",
    INVALID_INPUT = "VALIDATION_002",
    INTERNAL_ERROR = "SERVER_001",
    DATABASE_ERROR = "SERVER_002",
    EXTERNAL_SERVICE_ERROR = "SERVER_003",
    NETWORK_ERROR = "NETWORK_001",
    TIMEOUT = "NETWORK_002"
}
export declare const HTTP_TO_ERROR_CODE: Record<number, ErrorCode>;
export declare const ERROR_MESSAGES: Record<ErrorCode, string>;
export declare const RETRYABLE_ERROR_CODES: ErrorCode[];
export declare function isRetryableError(code: ErrorCode): boolean;
