import {
  Stack,
  Text,
  TextInput,
  Textarea,
  Select,
  Button,
  ActionIcon,
  Paper,
  Flex,
  Group,
  Box,
} from '@mantine/core';
import { DeleteIcon, AddIcon, CopyIcon } from '@/components/ui/icons';
import type { TransportItem, TransportType, TransportBlockData } from '@camellia/shared-types';

interface TransportBlockEditorProps {
  blockId: string;
  data: TransportBlockData;
  onChange: (data: TransportBlockData) => void;
}

const transportTypes: { value: TransportType; label: string }[] = [
  { value: 'subway', label: '지하철' },
  { value: 'bus', label: '버스' },
  { value: 'car', label: '자가용' },
  { value: 'shuttle', label: '셔틀버스' },
  { value: 'other', label: '기타' },
];

export const TransportBlockEditor = ({ data, onChange }: TransportBlockEditorProps) => {
  const blockData: TransportBlockData = {
    title: data.title || '오시는 길 안내',
    items: data.items || [],
    parkingInfo: data.parkingInfo || '',
  };

  const handleTitleChange = (value: string) => {
    onChange({ ...data, title: value });
  };

  const handleParkingInfoChange = (value: string) => {
    onChange({ ...data, parkingInfo: value });
  };

  const handleAddItem = () => {
    const newItem: TransportItem = {
      type: 'subway',
      title: '지하철',
      description: '',
    };
    onChange({ ...data, items: [...blockData.items, newItem] });
  };

  const handleUpdateItem = (index: number, field: keyof TransportItem, value: string) => {
    const items = [...blockData.items];
    if (field === 'type') {
      const typeValue = value as TransportType;
      const typeLabel = transportTypes.find((t) => t.value === typeValue)?.label || value;
      items[index] = { ...items[index], type: typeValue, title: typeLabel };
    } else {
      items[index] = { ...items[index], [field]: value };
    }
    onChange({ ...data, items });
  };

  const handleRemoveItem = (index: number) => {
    const items = blockData.items.filter((_, i) => i !== index);
    onChange({ ...data, items });
  };

  const handleDuplicateItem = (index: number) => {
    const itemToDuplicate = blockData.items[index];
    const items = [
      ...blockData.items.slice(0, index + 1),
      { ...itemToDuplicate },
      ...blockData.items.slice(index + 1),
    ];
    onChange({ ...data, items });
  };

  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        예식장까지 오시는 교통 정보를 입력하세요.
      </Text>

      {/* 섹션 타이틀 */}
      <TextInput
        label="섹션 제목"
        value={blockData.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        placeholder="오시는 길 안내"
        size="sm"
      />

      {/* 교통 수단 목록 */}
      {blockData.items.length > 0 && (
        <Stack gap="sm">
          <Text size="sm" fw={500}>
            교통 수단 ({blockData.items.length}개)
          </Text>
          {blockData.items.map((item, index) => (
            <Paper key={index} withBorder p="sm" bg="gray.0">
              <Flex justify="space-between" align="center" mb="xs">
                <Text size="sm" fw={500} c="dimmed">
                  교통 수단 {index + 1}
                </Text>
                <Group gap={4}>
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => handleDuplicateItem(index)}
                    title="복제"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleRemoveItem(index)}
                    title="삭제"
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </ActionIcon>
                </Group>
              </Flex>
              <Stack gap="xs">
                <Flex gap="xs">
                  <Select
                    value={item.type}
                    onChange={(value) => handleUpdateItem(index, 'type', value || 'subway')}
                    data={transportTypes.map((type) => ({ value: type.value, label: type.label }))}
                    size="sm"
                    w={120}
                  />
                  <TextInput
                    value={item.title}
                    onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                    placeholder="표시될 제목"
                    size="sm"
                    style={{ flex: 1 }}
                  />
                </Flex>
                <Textarea
                  value={item.description}
                  onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                  placeholder="상세 안내 (예: 2호선 강남역 5번 출구에서 도보 10분)"
                  rows={2}
                  size="sm"
                  autosize={false}
                />
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      {/* 교통 수단 추가 버튼 */}
      <Button
        onClick={handleAddItem}
        color="blue"
        fullWidth
        leftSection={<AddIcon className="w-4 h-4" />}
      >
        교통 수단 추가
      </Button>

      {/* 주차 안내 */}
      <Box style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }} pt="md">
        <Textarea
          label="주차 안내 (선택)"
          value={blockData.parkingInfo}
          onChange={(e) => handleParkingInfoChange(e.target.value)}
          placeholder="예: 건물 지하 주차장 이용 가능 (2시간 무료)"
          rows={2}
          size="sm"
          autosize={false}
        />
      </Box>

      {blockData.items.length === 0 && !blockData.parkingInfo && (
        <Text size="sm" c="dimmed" ta="center" py="xs">
          위 버튼을 눌러 교통 정보를 추가하세요
        </Text>
      )}
    </Stack>
  );
};
