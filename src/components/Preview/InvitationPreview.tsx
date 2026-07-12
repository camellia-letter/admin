import type { UpdateInvitationDto, InvitationBlock } from '@camellia-letter/shared-types';
import { getThemeStyles, withAlpha } from './themeUtils';
import {
  PreviewHeaderBlock,
  PreviewMessageBlock,
  PreviewInfoBlock,
  PreviewMapBlock,
  PreviewGalleryBlock,
  PreviewAccountBlock,
  PreviewTransportBlock,
  PreviewGuestbookBlock,
  PreviewRsvpBlock,
  PreviewHeroBlock,
  PreviewWeddingSummaryBlock,
  PreviewParentsBlock,
  PreviewSnapUploadBlock,
} from './PreviewBlocks';

interface InvitationPreviewProps {
  formData: UpdateInvitationDto;
}

export const InvitationPreview = ({ formData }: InvitationPreviewProps) => {
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
      {/* Dynamic Blocks Rendering */}
      {blocks.length > 0 ? (
        <BlockRenderer blocks={blocks} formData={formData} theme={theme} />
      ) : (
        <FallbackContent formData={formData} theme={theme} />
      )}
    </div>
  );
};

// Block Renderer
const BlockRenderer = ({
  blocks,
  formData,
  theme,
}: {
  blocks: InvitationBlock[];
  formData: UpdateInvitationDto;
  theme: ReturnType<typeof getThemeStyles>;
}) => {
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <>
      {sortedBlocks.map((block) => {
        switch (block.type) {
          case 'HEADER':
            return (
              <PreviewHeaderBlock
                key={block.id}
                data={block.data}
                groomName={formData.groomName || ''}
                brideName={formData.brideName || ''}
                theme={theme}
              />
            );
          case 'HERO':
            return <PreviewHeroBlock key={block.id} data={block.data} theme={theme} />;
          case 'WEDDING_SUMMARY':
            return (
              <PreviewWeddingSummaryBlock
                key={block.id}
                groomName={formData.groomName || ''}
                brideName={formData.brideName || ''}
                weddingDate={formData.weddingDate || new Date().toISOString()}
                venue={formData.venue || ''}
                theme={theme}
              />
            );
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
                venueLat={formData.venueLat}
                venueLng={formData.venueLng}
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
          case 'SNAP_UPLOAD':
            return <PreviewSnapUploadBlock key={block.id} data={block.data} theme={theme} />;
          default:
            return null;
        }
      })}
    </>
  );
}

// Fallback content when no blocks
const FallbackContent = ({
  formData,
  theme,
}: {
  formData: UpdateInvitationDto;
  theme: ReturnType<typeof getThemeStyles>;
}) => {
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
        venueLat={formData.venueLat}
        venueLng={formData.venueLng}
        theme={theme}
      />
    </>
  );
}
