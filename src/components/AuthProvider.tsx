import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/api/client';
import { Flex, Loader } from '@mantine/core';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setToken, logout } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const jwt = searchParams.get('jwt');

      if (jwt) {
        try {
          // JWT를 디코딩하여 userId 추출 (payload의 sub 필드)
          const payload = JSON.parse(atob(jwt.split('.')[1]));
          const userId = payload.sub;

          const response = await apiClient.get(`/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          });

          setUser(response.data);
          setToken(jwt);

          searchParams.delete('jwt');
          setSearchParams(searchParams, { replace: true });
        } catch {
          logout();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [searchParams, setSearchParams, setUser, setToken, logout]);

  if (isLoading && searchParams.has('jwt')) {
    return (
      <Flex mih="100vh" align="center" justify="center">
        <Loader size="lg" color="pink" />
      </Flex>
    );
  }

  return <>{children}</>;
};
