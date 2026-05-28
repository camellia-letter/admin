import apiClient from './client';

export interface GeocodeResult {
  lat: number;
  lng: number;
  address: string;
}

export const geocodeAddress = async (
  address: string
): Promise<GeocodeResult> => {
  const { data } = await apiClient.get('/api/maps/geocode', {
    params: { query: address },
  });
  return data;
};
