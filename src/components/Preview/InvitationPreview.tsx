import type { UpdateInvitationDto, InvitationBlock } from '@camellia/shared-types';
import { getThemeStyles, withAlpha } from './themeUtils';
import {
  PreviewMessageBlock,
  PreviewInfoBlock,
  PreviewMapBlock,
  PreviewGalleryBlock,
  PreviewAccountBlock,
  PreviewTransportBlock,
  PreviewGuestbookBlock,
  PreviewRsvpBlock,
  PreviewHeroBlock,
  PreviewParentsBlock,
} from './PreviewBlocks';

interface InvitationPreviewProps {
  formData: UpdateInvitationDto;
}

export default function InvitationPreview({ formData }: InvitationPreviewProps) {
  const theme = getThemeStyles(formData.theme);
  const blocks = formData.blocks || [];

  return (
    <div
      className="min-h-full"
      style={{
        background: `linear-gradient(to bottom, ${withAlpha(theme.colors.secondary, 0.15)}, ${theme.colors.background}, ${withAlpha(theme.colors.secondary, 0.15)})`,
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Hero Section - 신랑 & 신부 이름 */}
      <section className="pt-10 pb-8 px-4 text-center">
        <p
          className="text-xs tracking-widest mb-3"
          style={{ color: theme.colors.primary, opacity: 0.8 }}
        >
          WEDDING INVITATION
        </p>
        <h1 className="text-xl font-serif mb-2" style={{ color: theme.colors.text }}>
          {formData.groomName || '신랑'} & {formData.brideName || '신부'}
        </h1>
        <div
          className="w-12 h-px mx-auto mt-4"
          style={{ backgroundColor: theme.colors.secondary }}
        />
      </section>

      {/* Dynamic Blocks Rendering */}
      {blocks.length > 0 ? (
        <BlockRenderer blocks={blocks} formData={formData} theme={theme} />
      ) : (
        <FallbackContent formData={formData} theme={theme} />
      )}

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs" style={{ color: theme.colors.text, opacity: 0.5 }}>
          {formData.groomName || '신랑'} ♥ {formData.brideName || '신부'}
        </p>
      </footer>
    </div>
  );
}

// Block Renderer
function BlockRenderer({
  blocks,
  formData,
  theme,
}: {
  blocks: InvitationBlock[];
  formData: UpdateInvitationDto;
  theme: ReturnType<typeof getThemeStyles>;
}) {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <>
      {sortedBlocks.map((block) => {
        switch (block.type) {
          case 'HERO':
            return <PreviewHeroBlock key={block.id} data={block.data} theme={theme} />;
          case 'MESSAGE':
            return <PreviewMessageBlock key={block.id} data={block.data} theme={theme} />;
          case 'INFO':
            return (
              <PreviewInfoBlock
                key={block.id}
                groomName={formData.groomName || ''}
                brideName={formData.brideName || ''}
                weddingDate={formData.weddingDate || new Date().toISOString()}
                theme={theme}
              />
            );
          case 'MAP':
            return (
              <PreviewMapBlock
                key={block.id}
                venue={formData.venue || '예식장'}
                venueAddress={formData.venueAddress || '주소'}
                theme={theme}
              />
            );
          case 'PARENTS':
            return (
              <PreviewParentsBlock
                key={block.id}
                data={block.data}
                groomName={formData.groomName || ''}
                brideName={formData.brideName || ''}
                theme={theme}
              />
            );
          case 'GALLERY':
            return <PreviewGalleryBlock key={block.id} data={block.data} theme={theme} />;
          case 'ACCOUNT':
            return <PreviewAccountBlock key={block.id} data={block.data} theme={theme} />;
          case 'TRANSPORT':
            return <PreviewTransportBlock key={block.id} data={block.data} theme={theme} />;
          case 'GUESTBOOK':
            return <PreviewGuestbookBlock key={block.id} theme={theme} />;
          case 'RSVP':
            return <PreviewRsvpBlock key={block.id} data={block.data} theme={theme} />;
          default:
            return null;
        }
      })}
    </>
  );
}

// Fallback content when no blocks
function FallbackContent({
  formData,
  theme,
}: {
  formData: UpdateInvitationDto;
  theme: ReturnType<typeof getThemeStyles>;
}) {
  return (
    <>
      {/* Message Section */}
      {formData.message && (
        <PreviewMessageBlock
          data={{ title: '초대합니다', content: formData.message }}
          theme={theme}
        />
      )}

      {/* Info Section */}
      <PreviewInfoBlock
        groomName={formData.groomName || ''}
        brideName={formData.brideName || ''}
        weddingDate={formData.weddingDate || new Date().toISOString()}
        theme={theme}
      />

      {/* Map Section */}
      <PreviewMapBlock
        venue={formData.venue || '예식장'}
        venueAddress={formData.venueAddress || '주소'}
        theme={theme}
      />
    </>
  );
}
