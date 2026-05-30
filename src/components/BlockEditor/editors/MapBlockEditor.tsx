import { useState } from 'react';
import {
  Stack,
  TextInput,
  Button,
  Text,
  Alert,
  Flex,
  Loader,
} from '@mantine/core';
import {
  IconMap,
  IconSearch,
  IconCheck,
  IconAlertCircle,
} from '@tabler/icons-react';
import type { MapBlockData } from '@camellia-letter/shared-types';
import { geocodeAddress } from '../../../api/maps';

interface MapBlockEditorProps {
  blockId: string;
  data: MapBlockData;
  onChange: (data: MapBlockData) => void;
}

export const MapBlockEditor = ({ data, onChange }: MapBlockEditorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('주소를 입력해주세요');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await geocodeAddress(searchQuery.trim());

      onChange({
        ...data,
        lat: result.lat,
        lng: result.lng,
        venueAddress: result.address,
      });

      setSuccess(
        `좌표를 찾았습니다: (${result.lat.toFixed(6)}, ${result.lng.toFixed(6)})`
      );
      setSearchQuery('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || '주소를 찾을 수 없습니다. 다시 시도해주세요.');
      } else {
        setError('주소를 찾을 수 없습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Stack gap="md">
      <Alert color="blue" icon={<IconMap size={20} />}>
        <Text size="sm" fw={500}>
          지도 블록
        </Text>
        <Text size="sm" mt="xs">
          주소를 검색하여 지도 좌표를 자동으로 설정합니다. "기본 정보"의 예식장
          정보가 자동으로 표시됩니다.
        </Text>
      </Alert>

      <Stack gap="xs">
        <Text size="sm" fw={500}>
          주소 검색
        </Text>
        <Flex gap="sm">
          <TextInput
            style={{ flex: 1 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="예: 서울특별시 강남구 테헤란로 152"
            disabled={isSearching}
          />
          <Button
            onClick={handleSearch}
            loading={isSearching}
            leftSection={isSearching ? <Loader size="xs" /> : <IconSearch size={16} />}
            disabled={isSearching || !searchQuery.trim()}
          >
            검색
          </Button>
        </Flex>
        <Text size="xs" c="dimmed">
          도로명 주소 또는 지번 주소를 입력하세요
        </Text>
      </Stack>

      {success && (
        <Alert
          color="green"
          icon={<IconCheck size={20} />}
          onClose={() => setSuccess(null)}
          withCloseButton
        >
          <Text size="sm">{success}</Text>
        </Alert>
      )}

      {error && (
        <Alert
          color="red"
          icon={<IconAlertCircle size={20} />}
          onClose={() => setError(null)}
          withCloseButton
        >
          <Text size="sm">{error}</Text>
        </Alert>
      )}

      {data.lat !== undefined && data.lng !== undefined && (
        <Alert color="teal" icon={<IconCheck size={20} />}>
          <Text size="sm" fw={500}>
            현재 설정된 좌표
          </Text>
          <Text size="sm" mt="xs">
            위도: {data.lat.toFixed(6)} / 경도: {data.lng.toFixed(6)}
          </Text>
          {data.venueAddress && (
            <Text size="xs" c="dimmed" mt="xs">
              주소: {data.venueAddress}
            </Text>
          )}
        </Alert>
      )}

      {(data.lat === undefined || data.lng === undefined) && (
        <Alert color="yellow" icon={<IconAlertCircle size={20} />}>
          <Text size="sm">
            아직 좌표가 설정되지 않았습니다. 주소를 검색해주세요.
          </Text>
        </Alert>
      )}

      <Stack gap="xs">
        <Text size="sm" fw={500}>
          길찾기 도착지명 (선택)
        </Text>
        <TextInput
          value={data.destinationName || ''}
          onChange={(e) =>
            onChange({
              ...data,
              destinationName: e.target.value.trim() || undefined,
            })
          }
          placeholder="예: 더링크서울 5층"
        />
        <Text size="xs" c="dimmed">
          카카오/네이버 길찾기 버튼에 표시될 이름입니다. 미입력 시 예식장 이름이 사용됩니다.
        </Text>
      </Stack>
    </Stack>
  );
};
