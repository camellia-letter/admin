import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { ThemeEditor } from './index';
import { DEFAULT_THEME } from '@camellia-letter/shared-types';

// Toast mock
vi.mock('../ui/Toast', () => ({
  useToast: () => ({
    addToast: vi.fn(),
  }),
}));

// Custom render with MantineProvider
const renderWithMantine = (ui: React.ReactElement) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe('ThemeEditor', () => {
  const mockOnChange = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('기본 테마로 렌더링된다', () => {
    renderWithMantine(<ThemeEditor theme={undefined} onChange={mockOnChange} />);

    expect(screen.getByText('테마 프리셋')).toBeInTheDocument();
    expect(screen.getByText('미리보기')).toBeInTheDocument();
    expect(screen.getByText('폰트')).toBeInTheDocument();
  });

  it('미리보기에 신랑 ♥ 신부가 표시된다', () => {
    renderWithMantine(<ThemeEditor theme={DEFAULT_THEME} onChange={mockOnChange} />);

    // 미리보기 영역에 텍스트가 표시되는지 확인 (여러 개 있을 수 있음)
    expect(screen.getAllByText('신랑 ♥ 신부').length).toBeGreaterThan(0);
    expect(screen.getByText('결혼합니다')).toBeInTheDocument();
  });

  it('프리셋 변경 시 onChange가 호출된다', () => {
    renderWithMantine(<ThemeEditor theme={DEFAULT_THEME} onChange={mockOnChange} />);

    // 기본 카테고리의 첫 번째 프리셋 버튼 클릭
    const presetButtons = screen.getAllByRole('button');
    const classicButton = presetButtons.find((btn) => btn.textContent?.includes('클래식'));

    if (classicButton) {
      fireEvent.click(classicButton);
      expect(mockOnChange).toHaveBeenCalled();
    }
  });

  it('커스텀 모드로 전환할 수 있다', () => {
    renderWithMantine(<ThemeEditor theme={DEFAULT_THEME} onChange={mockOnChange} />);

    const customButton = screen.getByText('커스텀 색상 직접 설정');
    fireEvent.click(customButton);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        preset: 'custom',
      }),
    );
  });

  it('폰트 변경 시 onChange가 호출된다', () => {
    renderWithMantine(<ThemeEditor theme={DEFAULT_THEME} onChange={mockOnChange} />);

    // 노토 세리프 폰트 선택
    const notoSerifButton = screen.getByText('노토 세리프').closest('button');
    if (notoSerifButton) {
      fireEvent.click(notoSerifButton);

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          fontFamily: 'noto-serif',
        }),
      );
    }
  });

  it('모서리 둥글기 변경 시 onChange가 호출된다', () => {
    renderWithMantine(<ThemeEditor theme={DEFAULT_THEME} onChange={mockOnChange} />);

    const largeButton = screen.getByText('크게');
    fireEvent.click(largeButton);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        borderRadius: 'large',
      }),
    );
  });

  it('그라디언트 토글 시 onChange가 호출된다', () => {
    renderWithMantine(<ThemeEditor theme={DEFAULT_THEME} onChange={mockOnChange} />);

    // 그라디언트 배경 토글 찾기
    const gradientToggle = screen
      .getByText('그라디언트 배경')
      .parentElement?.querySelector('button');

    if (gradientToggle) {
      fireEvent.click(gradientToggle);
      expect(mockOnChange).toHaveBeenCalled();
    }
  });

  it('색상 대비 검사 패널이 표시된다', () => {
    renderWithMantine(<ThemeEditor theme={DEFAULT_THEME} onChange={mockOnChange} />);

    expect(screen.getByText('색상 대비 검사')).toBeInTheDocument();
  });

  it('테마 내보내기 버튼이 존재한다', () => {
    renderWithMantine(<ThemeEditor theme={DEFAULT_THEME} onChange={mockOnChange} />);

    expect(screen.getByText('내보내기')).toBeInTheDocument();
  });

  it('테마 가져오기 버튼이 존재한다', () => {
    renderWithMantine(<ThemeEditor theme={DEFAULT_THEME} onChange={mockOnChange} />);

    expect(screen.getByText('가져오기')).toBeInTheDocument();
  });
});
