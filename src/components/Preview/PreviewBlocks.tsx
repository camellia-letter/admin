import type {
  AccountBlockData,
  TransportBlockData,
  RsvpBlockData,
  TransportType,
  ParentsBlockData,
} from '@/types/invitation';
import { withAlpha } from './themeUtils';

interface ThemeStyles {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fontFamily: string;
  borderRadius: string;
}

// Message Block
export function PreviewMessageBlock({
  data,
  theme,
}: {
  data: { title?: string; content?: string };
  theme: ThemeStyles;
}) {
  if (!data.title && !data.content) return null;

  return (
    <section className="py-8 px-4 max-w-full mx-auto">
      <div className="text-center" style={{ fontFamily: theme.fontFamily }}>
        {data.title && (
          <h2 className="text-sm font-medium mb-4" style={{ color: theme.colors.text }}>
            {data.title}
          </h2>
        )}
        {data.content && (
          <p
            className="text-xs leading-relaxed whitespace-pre-line"
            style={{ color: theme.colors.text, opacity: 0.8 }}
          >
            {data.content}
          </p>
        )}
      </div>
    </section>
  );
}

// Info Block
export function PreviewInfoBlock({
  weddingDate,
  theme,
}: {
  groomName?: string;
  brideName?: string;
  weddingDate: string;
  theme: ThemeStyles;
}) {
  const date = new Date(weddingDate);

  const formattedDate = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  const formattedTime = date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // D-Day 계산
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const wedding = new Date(date);
  wedding.setHours(0, 0, 0, 0);
  const diffTime = wedding.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let ddayText = '';
  if (diffDays > 0) {
    ddayText = `D-${diffDays}`;
  } else if (diffDays === 0) {
    ddayText = 'D-Day';
  } else {
    ddayText = `D+${Math.abs(diffDays)}`;
  }

  return (
    <section
      className="py-8 px-4"
      style={{ backgroundColor: withAlpha(theme.colors.background, 0.5) }}
    >
      <div className="max-w-full mx-auto text-center" style={{ fontFamily: theme.fontFamily }}>
        <h2 className="text-sm font-medium mb-4" style={{ color: theme.colors.text }}>
          예식 일시
        </h2>
        <p className="text-base font-light" style={{ color: theme.colors.text }}>
          {formattedDate}
        </p>
        <p className="text-sm mt-1" style={{ color: theme.colors.primary }}>
          {formattedTime}
        </p>
        <div
          className="mt-4 inline-block px-3 py-1 text-xs font-medium"
          style={{
            backgroundColor: withAlpha(theme.colors.primary, 0.1),
            color: theme.colors.primary,
            borderRadius: theme.borderRadius === '0' ? '9999px' : `calc(${theme.borderRadius} * 4)`,
          }}
        >
          {ddayText}
        </div>
      </div>
    </section>
  );
}

// Map Block
export function PreviewMapBlock({
  venue,
  venueAddress,
  theme,
}: {
  venue: string;
  venueAddress: string;
  theme: ThemeStyles;
}) {
  return (
    <section className="py-8 px-4" style={{ fontFamily: theme.fontFamily }}>
      <div className="max-w-full mx-auto text-center">
        <h2 className="text-sm font-medium mb-4" style={{ color: theme.colors.text }}>
          오시는 길
        </h2>
        <div
          className="bg-white shadow-sm p-4"
          style={{ borderRadius: `calc(${theme.borderRadius} * 2)` }}
        >
          <p className="text-base" style={{ color: theme.colors.text }}>
            {venue}
          </p>
          <p className="text-xs mt-1" style={{ color: theme.colors.text, opacity: 0.6 }}>
            {venueAddress}
          </p>
          <div
            className="mt-3 inline-block px-3 py-1.5 text-xs font-medium text-white"
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: theme.borderRadius,
            }}
          >
            지도 보기
          </div>
        </div>
      </div>
    </section>
  );
}

// Gallery Block
export function PreviewGalleryBlock({
  data,
  theme,
}: {
  data: { images?: { url: string; caption?: string }[] };
  theme: ThemeStyles;
}) {
  const images = data.images || [];
  if (images.length === 0) return null;

  return (
    <section className="py-8 px-4" style={{ fontFamily: theme.fontFamily }}>
      <div className="max-w-full mx-auto">
        <h2 className="text-sm font-medium mb-4 text-center" style={{ color: theme.colors.text }}>
          갤러리
        </h2>
        <div className="grid grid-cols-3 gap-1">
          {images.slice(0, 6).map((image, index) => (
            <div
              key={index}
              className="aspect-square overflow-hidden"
              style={{
                backgroundColor: withAlpha(theme.colors.secondary, 0.2),
                borderRadius: theme.borderRadius,
              }}
            >
              <img
                src={image.url}
                alt={image.caption || `이미지 ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        {images.length > 6 && (
          <p
            className="text-xs text-center mt-2"
            style={{ color: theme.colors.text, opacity: 0.6 }}
          >
            +{images.length - 6}장 더보기
          </p>
        )}
      </div>
    </section>
  );
}

// Account Block
export function PreviewAccountBlock({
  data,
  theme,
}: {
  data: AccountBlockData;
  theme: ThemeStyles;
}) {
  const {
    groomTitle = '신랑측',
    groomAccounts = [],
    brideTitle = '신부측',
    brideAccounts = [],
  } = data;
  const hasGroomAccounts = groomAccounts.length > 0;
  const hasBrideAccounts = brideAccounts.length > 0;

  if (!hasGroomAccounts && !hasBrideAccounts) return null;

  return (
    <section
      className="py-8 px-4"
      style={{
        background: `linear-gradient(to bottom, ${withAlpha(theme.colors.secondary, 0.2)}, ${theme.colors.background})`,
        fontFamily: theme.fontFamily,
      }}
    >
      <div className="max-w-full mx-auto">
        <h2 className="text-sm font-medium text-center mb-4" style={{ color: theme.colors.text }}>
          마음 전하실 곳
        </h2>
        <div className="space-y-3">
          {hasGroomAccounts && (
            <div
              className="border p-3 text-center"
              style={{
                backgroundColor: withAlpha(theme.colors.primary, 0.05),
                borderColor: withAlpha(theme.colors.primary, 0.2),
                borderRadius: theme.borderRadius,
              }}
            >
              <p className="text-xs font-medium" style={{ color: theme.colors.primary }}>
                {groomTitle}
              </p>
              <p className="text-xs mt-1" style={{ color: theme.colors.text, opacity: 0.7 }}>
                {groomAccounts.length}개 계좌
              </p>
            </div>
          )}
          {hasBrideAccounts && (
            <div
              className="border p-3 text-center"
              style={{
                backgroundColor: withAlpha(theme.colors.accent, 0.05),
                borderColor: withAlpha(theme.colors.accent, 0.2),
                borderRadius: theme.borderRadius,
              }}
            >
              <p className="text-xs font-medium" style={{ color: theme.colors.accent }}>
                {brideTitle}
              </p>
              <p className="text-xs mt-1" style={{ color: theme.colors.text, opacity: 0.7 }}>
                {brideAccounts.length}개 계좌
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Transport Block
const transportIcons: Record<TransportType, string> = {
  subway: '🚇',
  bus: '🚌',
  car: '🚗',
  shuttle: '🚐',
  other: '📍',
};

export function PreviewTransportBlock({
  data,
  theme,
}: {
  data: TransportBlockData;
  theme: ThemeStyles;
}) {
  const { title = '오시는 길 안내', items = [], parkingInfo = '' } = data;
  const hasItems = items.length > 0;
  const hasParkingInfo = parkingInfo && parkingInfo.trim() !== '';

  if (!hasItems && !hasParkingInfo) return null;

  return (
    <section
      className="py-8 px-4"
      style={{ backgroundColor: theme.colors.background, fontFamily: theme.fontFamily }}
    >
      <div className="max-w-full mx-auto">
        <h2 className="text-sm font-medium text-center mb-4" style={{ color: theme.colors.text }}>
          {title}
        </h2>
        <div className="space-y-2">
          {items.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="border p-2 flex items-center gap-2"
              style={{
                backgroundColor: withAlpha(theme.colors.primary, 0.05),
                borderColor: withAlpha(theme.colors.primary, 0.1),
                borderRadius: theme.borderRadius,
              }}
            >
              <span className="text-lg">{transportIcons[item.type] || '📍'}</span>
              <span className="text-xs" style={{ color: theme.colors.text }}>
                {item.title}
              </span>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-xs text-center" style={{ color: theme.colors.text, opacity: 0.6 }}>
              +{items.length - 3}개 더보기
            </p>
          )}
          {hasParkingInfo && (
            <div
              className="border p-2 flex items-center gap-2"
              style={{
                backgroundColor: withAlpha(theme.colors.secondary, 0.1),
                borderColor: withAlpha(theme.colors.secondary, 0.2),
                borderRadius: theme.borderRadius,
              }}
            >
              <span className="text-lg">🅿️</span>
              <span className="text-xs" style={{ color: theme.colors.text }}>
                주차 안내
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Guestbook Block
export function PreviewGuestbookBlock({ theme }: { theme: ThemeStyles }) {
  return (
    <section className="py-8 px-4" style={{ fontFamily: theme.fontFamily }}>
      <div className="max-w-full mx-auto">
        <h2 className="text-sm font-medium mb-4 text-center" style={{ color: theme.colors.text }}>
          방명록
        </h2>
        <div
          className="bg-white shadow-sm p-4"
          style={{ borderRadius: `calc(${theme.borderRadius} * 2)` }}
        >
          <div className="space-y-2">
            <input
              type="text"
              placeholder="이름"
              disabled
              className="w-full px-2 py-1.5 border text-xs"
              style={{
                borderColor: theme.colors.secondary,
                borderRadius: theme.borderRadius,
              }}
            />
            <textarea
              placeholder="축하 메시지"
              disabled
              rows={2}
              className="w-full px-2 py-1.5 border text-xs resize-none"
              style={{
                borderColor: theme.colors.secondary,
                borderRadius: theme.borderRadius,
              }}
            />
            <button
              disabled
              className="w-full py-1.5 text-xs text-white"
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: theme.borderRadius,
              }}
            >
              작성하기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// RSVP Block
export function PreviewRsvpBlock({ data, theme }: { data: RsvpBlockData; theme: ThemeStyles }) {
  const { title = '참석 여부' } = data;

  return (
    <section
      className="py-8 px-4"
      style={{
        background: `linear-gradient(to bottom, ${withAlpha(theme.colors.secondary, 0.2)}, ${theme.colors.background})`,
        fontFamily: theme.fontFamily,
      }}
    >
      <div className="max-w-full mx-auto">
        <h2 className="text-sm font-medium text-center mb-4" style={{ color: theme.colors.text }}>
          {title}
        </h2>
        <div className="grid grid-cols-3 gap-1">
          {['참석', '불참', '미정'].map((label, index) => (
            <div
              key={index}
              className="border p-2 text-center"
              style={{
                borderColor: index === 0 ? theme.colors.primary : theme.colors.secondary,
                backgroundColor: index === 0 ? withAlpha(theme.colors.primary, 0.1) : 'transparent',
                borderRadius: theme.borderRadius,
              }}
            >
              <span className="text-lg">{['😊', '😢', '🤔'][index]}</span>
              <p className="text-xs mt-1" style={{ color: theme.colors.text }}>
                {label}
              </p>
            </div>
          ))}
        </div>
        <button
          disabled
          className="w-full mt-3 py-1.5 text-xs text-white"
          style={{
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius,
          }}
        >
          참석 여부 제출
        </button>
      </div>
    </section>
  );
}

// Hero Block
export function PreviewHeroBlock({
  data,
  theme,
}: {
  data: { imageUrl?: string };
  theme: ThemeStyles;
}) {
  if (!data.imageUrl) return null;

  return (
    <section className="relative w-full">
      <div className="relative w-full h-40 overflow-hidden">
        <img src={data.imageUrl} alt="메인 이미지" className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, transparent, transparent, ${withAlpha(theme.colors.background, 0.3)})`,
          }}
        />
      </div>
    </section>
  );
}

// Parents Block
export function PreviewParentsBlock({
  data,
  groomName,
  brideName,
  theme,
}: {
  data: ParentsBlockData;
  groomName: string;
  brideName: string;
  theme: ThemeStyles;
}) {
  const { groomFatherName, groomMotherName, brideFatherName, brideMotherName } = data;

  const hasGroomParents = groomFatherName || groomMotherName;
  const hasBrideParents = brideFatherName || brideMotherName;

  if (!hasGroomParents && !hasBrideParents) return null;

  return (
    <section
      className="py-8 px-4"
      style={{ backgroundColor: theme.colors.background, fontFamily: theme.fontFamily }}
    >
      <div className="max-w-full mx-auto space-y-6">
        {hasGroomParents && (
          <div className="flex justify-between items-center gap-2">
            <span className="text-sm" style={{ color: theme.colors.text, minWidth: 50 }}>
              신랑
            </span>
            <div className="flex-1 flex items-center justify-center gap-2">
              <div className="flex flex-col items-center gap-1">
                {groomFatherName && (
                  <span className="text-sm" style={{ color: theme.colors.text }}>
                    {groomFatherName}
                  </span>
                )}
                {groomMotherName && (
                  <span className="text-sm" style={{ color: theme.colors.text }}>
                    {groomMotherName}
                  </span>
                )}
              </div>
              {groomFatherName && groomMotherName && (
                <span className="text-xs" style={{ color: theme.colors.text, opacity: 0.6 }}>
                  의
                </span>
              )}
            </div>
            <div
              className="flex items-center gap-1"
              style={{ minWidth: 80, justifyContent: 'flex-end' }}
            >
              <span className="text-xs" style={{ color: theme.colors.text, opacity: 0.6 }}>
                아들
              </span>
              <span className="text-sm" style={{ color: theme.colors.text }}>
                {groomName}
              </span>
            </div>
          </div>
        )}

        {hasGroomParents && hasBrideParents && (
          <div className="h-px" style={{ backgroundColor: theme.colors.text, opacity: 0.1 }} />
        )}

        {hasBrideParents && (
          <div className="flex justify-between items-center gap-2">
            <span className="text-sm" style={{ color: theme.colors.text, minWidth: 50 }}>
              신부
            </span>
            <div className="flex-1 flex items-center justify-center gap-2">
              <div className="flex flex-col items-center gap-1">
                {brideFatherName && (
                  <span className="text-sm" style={{ color: theme.colors.text }}>
                    {brideFatherName}
                  </span>
                )}
                {brideMotherName && (
                  <span className="text-sm" style={{ color: theme.colors.text }}>
                    {brideMotherName}
                  </span>
                )}
              </div>
              {brideFatherName && brideMotherName && (
                <span className="text-xs" style={{ color: theme.colors.text, opacity: 0.6 }}>
                  의
                </span>
              )}
            </div>
            <div
              className="flex items-center gap-1"
              style={{ minWidth: 80, justifyContent: 'flex-end' }}
            >
              <span className="text-xs" style={{ color: theme.colors.text, opacity: 0.6 }}>
                딸
              </span>
              <span className="text-sm" style={{ color: theme.colors.text }}>
                {brideName}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
