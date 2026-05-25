import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { parseApiError } from '@/lib/errorHandler';
import { useAuthStore } from '@/store/authStore';

// 타입 확장
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _retryCount?: number;
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4002',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15초 타임아웃
});

// 요청 인터셉터 - JWT 토큰 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const parsedError = parseApiError(error);
    const config = error.config;

    // 401 에러 시 홈으로 리다이렉트 (단, 이미 홈에 있다면 무한 루프 방지)
    if (error.response?.status === 401) {
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
      return Promise.reject(error);
    }

    // 재시도 로직 (네트워크 에러 또는 5xx 에러)
    if (config && parsedError.isRetryable && !config._retry) {
      config._retry = true;
      config._retryCount = (config._retryCount || 0) + 1;

      if (config._retryCount <= 2) {
        // 최대 2회 재시도
        await new Promise((resolve) => setTimeout(resolve, 1000 * config._retryCount!));
        return apiClient(config);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
