import { ExternalLink, Play } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import Button from '@/components/ui/Button';

interface YoutubePreviewProps {
   youtubeId: string;
   embedUrl: string;
   title: string;
}

export function YoutubePreview({ youtubeId, embedUrl, title }: YoutubePreviewProps): ReactElement {
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [isThumbnailBroken, setIsThumbnailBroken] = useState<boolean>(false);

   return (
      <div className="w-full max-w-md space-y-2">
         <div className="relative aspect-video overflow-hidden rounded-xl bg-ink-900 ring-1 ring-ink-100">
            {isPlaying ? (
               <iframe
                  src={`${embedUrl}&autoplay=1`}
                  title={title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="size-full"
               />
            ) : (
               <>
                  {!isThumbnailBroken && (
                     <img
                        src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
                        alt=""
                        onError={() => setIsThumbnailBroken(true)}
                        className="size-full object-cover opacity-80"
                     />
                  )}
                  <div className="absolute inset-0 grid place-items-center">
                     <Button
                        variant="light"
                        icon={<Play className="size-4" aria-hidden="true" />}
                        onClick={() => setIsPlaying(true)}
                     >
                        Phát thử trailer
                     </Button>
                  </div>
               </>
            )}
         </div>
         <a
            href={`https://www.youtube.com/watch?v=${youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700 hover:underline"
         >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            Mở trên YouTube
         </a>
      </div>
   );
}

export default YoutubePreview;
