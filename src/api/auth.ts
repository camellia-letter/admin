import apiClient from './client';

interface TokenResponse {
  accessToken: string;
  expiresIn: number;
}

export const exchangeToken = async (
  userId: string,
  sessionToken: string,
): Promise<TokenResponse> => {
  const { data } = await apiClient.post('/api/auth/token', {
    userId,
    sessionToken,
  });
  return data;
};
