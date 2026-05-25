import type { InvitationBlock, BlockType, BlockDataByType } from '@/types/invitation';

/**
 * 블록 타입별 기본 데이터를 생성합니다
 */
function getDefaultBlockData(type: BlockType): BlockDataByType[BlockType] {
  switch (type) {
    case 'HEADER':
      return {
        showTitle: true,
      };
    case 'HERO':
      return {
        imageUrl: '',
        altText: '메인 이미지',
      };
    case 'MESSAGE':
      return {
        title: '초대합니다',
        content: '저희 두 사람의 소중한 시작에\n함께해 주시면 감사하겠습니다.',
      };
    case 'INFO':
      return {}; // 기본 정보에서 자동으로 표시
    case 'PARENTS':
      return {
        groomFatherName: '',
        groomMotherName: '',
        brideFatherName: '',
        brideMotherName: '',
      };
    case 'MAP':
      return {}; // 예식장 정보에서 자동으로 표시
    case 'GALLERY':
      return {
        images: [],
      };
    case 'GUESTBOOK':
      return {}; // 방명록은 게스트가 작성
    case 'ACCOUNT':
      return {
        groomTitle: '신랑측',
        groomAccounts: [],
        brideTitle: '신부측',
        brideAccounts: [],
      };
    case 'TRANSPORT':
      return {
        title: '오시는 길 안내',
        items: [],
        parkingInfo: '',
      };
    case 'RSVP':
      return {
        title: '참석 여부',
        description: '참석 여부를 알려주세요.',
        showMealOption: false,
        showGuestCount: true,
      };
  }
}

/**
 * 새로운 블록을 생성합니다
 */
export function createDefaultBlock(type: BlockType, order: number): InvitationBlock {
  return {
    id: crypto.randomUUID(),
    type,
    order,
    data: getDefaultBlockData(type),
  } as InvitationBlock;
}

/**
 * 블록 배열의 순서를 재정렬합니다 (드래그 앤 드롭 후)
 */
export function reorderBlocks(
  blocks: InvitationBlock[],
  startIndex: number,
  endIndex: number,
): InvitationBlock[] {
  const result = Array.from(blocks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  // order 값을 배열 인덱스로 재할당
  return result.map((block, index) => ({
    ...block,
    order: index,
  }));
}

/**
 * 블록 타입의 한글 라벨을 반환합니다
 */
export function getBlockLabel(type: BlockType): string {
  const labels: Record<BlockType, string> = {
    HEADER: '헤더',
    HERO: '메인 이미지',
    MESSAGE: '인사말',
    INFO: '예식 정보',
    PARENTS: '부모님 성함',
    MAP: '오시는 길',
    GALLERY: '갤러리',
    GUESTBOOK: '방명록',
    ACCOUNT: '계좌 정보',
    TRANSPORT: '교통 안내',
    RSVP: '참석 여부',
  };
  return labels[type];
}

/**
 * 블록 타입의 설명을 반환합니다
 */
export function getBlockDescription(type: BlockType): string {
  const descriptions: Record<BlockType, string> = {
    HEADER: '신랑 신부 이름과 타이틀을 표시합니다',
    HERO: '상단 메인 이미지를 추가합니다',
    MESSAGE: '신랑 신부의 인사말을 작성합니다',
    INFO: '예식 일시와 장소 정보를 표시합니다',
    PARENTS: '양가 부모님 성함을 표시합니다',
    MAP: '예식장 위치와 지도를 표시합니다',
    GALLERY: '사진 갤러리를 추가합니다',
    GUESTBOOK: '하객들의 방명록을 표시합니다',
    ACCOUNT: '축의금 계좌 정보를 표시합니다',
    TRANSPORT: '지하철, 버스, 주차 등 교통 안내를 추가합니다',
    RSVP: '하객들의 참석 여부를 수집합니다',
  };
  return descriptions[type];
}

/**
 * 블록 데이터의 유효성을 검증합니다
 */
export function validateBlockData(block: InvitationBlock): { valid: boolean; error?: string } {
  switch (block.type) {
    case 'HERO':
      if (!block.data.imageUrl) {
        return { valid: false, error: '이미지 URL을 입력해주세요' };
      }
      // 간단한 URL 형식 검증
      try {
        new URL(block.data.imageUrl);
      } catch {
        return { valid: false, error: '올바른 URL 형식이 아닙니다' };
      }
      return { valid: true };

    case 'MESSAGE':
      if (!block.data.title && !block.data.content) {
        return { valid: false, error: '제목 또는 내용을 입력해주세요' };
      }
      return { valid: true };

    case 'GALLERY':
      if (!Array.isArray(block.data.images)) {
        return { valid: false, error: '이미지 배열이 올바르지 않습니다' };
      }
      // 이미지 URL 검증
      for (const img of block.data.images) {
        if (!img.url) {
          return { valid: false, error: '이미지 URL을 입력해주세요' };
        }
        try {
          new URL(img.url);
        } catch {
          return { valid: false, error: `올바른 URL 형식이 아닙니다: ${img.url}` };
        }
      }
      return { valid: true };

    case 'HEADER':
    case 'INFO':
    case 'PARENTS':
    case 'MAP':
    case 'GUESTBOOK':
    case 'ACCOUNT':
    case 'TRANSPORT':
    case 'RSVP':
      // 이 블록들은 자동으로 채워지거나 읽기 전용이므로 항상 유효
      return { valid: true };

    default:
      return { valid: true };
  }
}

/**
 * 모든 블록의 유효성을 검증합니다
 */
export function validateAllBlocks(blocks: InvitationBlock[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    const result = validateBlockData(block);
    if (!result.valid) {
      errors.push(`블록 ${index + 1} (${getBlockLabel(block.type)}): ${result.error}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
