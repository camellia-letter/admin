import {
  Stack,
  Text,
  TextInput,
  Button,
  ActionIcon,
  Paper,
  Flex,
  Group,
  Textarea,
  Switch,
} from '@mantine/core';
import { DeleteIcon, AddIcon, CopyIcon } from '@/components/ui/icons';
import type { AccountInfo, AccountBlockData } from '@camellia-letter/shared-types';

interface AccountBlockEditorProps {
  blockId: string;
  data: AccountBlockData;
  onChange: (data: AccountBlockData) => void;
}

export const AccountBlockEditor = ({ data, onChange }: AccountBlockEditorProps) => {
  const blockData: AccountBlockData = {
    title: data.title || '마음 전하실 곳',
    description: data.description || '',
    initialCollapsed: data.initialCollapsed !== undefined ? data.initialCollapsed : true,
    groomTitle: data.groomTitle || '신랑측',
    groomAccounts: data.groomAccounts || [],
    brideTitle: data.brideTitle || '신부측',
    brideAccounts: data.brideAccounts || [],
  };

  const handleTitleChange = (side: 'groom' | 'bride', value: string) => {
    const key = side === 'groom' ? 'groomTitle' : 'brideTitle';
    onChange({ ...data, [key]: value });
  };

  const handleAddAccount = (side: 'groom' | 'bride') => {
    const key = side === 'groom' ? 'groomAccounts' : 'brideAccounts';
    const accounts = side === 'groom' ? blockData.groomAccounts : blockData.brideAccounts;
    const newAccount: AccountInfo = { bank: '', accountNumber: '', holder: '' };
    onChange({ ...data, [key]: [...accounts, newAccount] });
  };

  const handleUpdateAccount = (
    side: 'groom' | 'bride',
    index: number,
    field: keyof AccountInfo,
    value: string,
  ) => {
    const key = side === 'groom' ? 'groomAccounts' : 'brideAccounts';
    const accounts = side === 'groom' ? [...blockData.groomAccounts] : [...blockData.brideAccounts];
    accounts[index] = { ...accounts[index], [field]: value };
    onChange({ ...data, [key]: accounts });
  };

  const handleRemoveAccount = (side: 'groom' | 'bride', index: number) => {
    const key = side === 'groom' ? 'groomAccounts' : 'brideAccounts';
    const accounts = side === 'groom' ? blockData.groomAccounts : blockData.brideAccounts;
    const newAccounts = accounts.filter((_, i) => i !== index);
    onChange({ ...data, [key]: newAccounts });
  };

  const handleDuplicateAccount = (side: 'groom' | 'bride', index: number) => {
    const key = side === 'groom' ? 'groomAccounts' : 'brideAccounts';
    const accounts = side === 'groom' ? blockData.groomAccounts : blockData.brideAccounts;
    const accountToDuplicate = accounts[index];
    const newAccounts = [
      ...accounts.slice(0, index + 1),
      { ...accountToDuplicate },
      ...accounts.slice(index + 1),
    ];
    onChange({ ...data, [key]: newAccounts });
  };

  const renderAccountSection = (
    side: 'groom' | 'bride',
    title: string,
    accounts: AccountInfo[],
  ) => {
    const sideLabel = side === 'groom' ? '신랑' : '신부';
    const bgColor =
      side === 'groom' ? 'var(--mantine-color-blue-0)' : 'var(--mantine-color-pink-0)';
    const borderColor =
      side === 'groom' ? 'var(--mantine-color-blue-2)' : 'var(--mantine-color-pink-2)';
    const buttonColor = side === 'groom' ? 'blue' : 'pink';

    return (
      <Paper p="md" withBorder style={{ backgroundColor: bgColor, borderColor }}>
        <Stack gap="sm">
          <TextInput
            label={`${sideLabel}측 섹션 제목`}
            value={title}
            onChange={(e) => handleTitleChange(side, e.target.value)}
            placeholder={`${sideLabel}측`}
            size="sm"
          />

          {accounts.length > 0 && (
            <Stack gap="sm">
              {accounts.map((account, index) => (
                <Paper key={index} p="sm" withBorder bg="white">
                  <Flex justify="space-between" align="center" mb="xs">
                    <Text size="sm" fw={500} c="dimmed">
                      계좌 {index + 1}
                    </Text>
                    <Group gap={4}>
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleDuplicateAccount(side, index)}
                        title="계좌 복제"
                      >
                        <CopyIcon className="w-4 h-4" />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleRemoveAccount(side, index)}
                        title="계좌 삭제"
                      >
                        <DeleteIcon className="w-4 h-4" />
                      </ActionIcon>
                    </Group>
                  </Flex>
                  <Stack gap="xs">
                    <TextInput
                      value={account.bank}
                      onChange={(e) => handleUpdateAccount(side, index, 'bank', e.target.value)}
                      placeholder="은행명 (예: 국민은행)"
                      size="xs"
                    />
                    <TextInput
                      value={account.accountNumber}
                      onChange={(e) =>
                        handleUpdateAccount(side, index, 'accountNumber', e.target.value)
                      }
                      placeholder="계좌번호"
                      size="xs"
                    />
                    <TextInput
                      value={account.holder}
                      onChange={(e) => handleUpdateAccount(side, index, 'holder', e.target.value)}
                      placeholder="예금주"
                      size="xs"
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}

          <Button
            onClick={() => handleAddAccount(side)}
            color={buttonColor}
            fullWidth
            leftSection={<AddIcon className="w-4 h-4" />}
          >
            {sideLabel}측 계좌 추가
          </Button>
        </Stack>
      </Paper>
    );
  };

  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        축의금을 보내실 분들을 위한 계좌 정보를 입력하세요.
      </Text>

      <Paper p="md" withBorder bg="gray.0">
        <Stack gap="sm">
          <TextInput
            label="블록 제목"
            value={blockData.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            placeholder="마음 전하실 곳"
            size="sm"
          />
          <Textarea
            label="안내 문구"
            value={blockData.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            placeholder="멀리서 축하의 마음을 전해주시는 분들을 위해 작은 안내를 드립니다."
            rows={3}
            size="sm"
          />
          <Switch
            label="초기 상태를 접힌 상태로 표시"
            checked={blockData.initialCollapsed}
            onChange={(e) => onChange({ ...data, initialCollapsed: e.currentTarget.checked })}
            size="sm"
          />
        </Stack>
      </Paper>

      {renderAccountSection('groom', blockData.groomTitle || '', blockData.groomAccounts)}
      {renderAccountSection('bride', blockData.brideTitle || '', blockData.brideAccounts)}

      {blockData.groomAccounts.length === 0 && blockData.brideAccounts.length === 0 && (
        <Text size="sm" c="dimmed" ta="center" py="xs">
          위 버튼을 눌러 계좌 정보를 추가하세요
        </Text>
      )}
    </Stack>
  );
};
