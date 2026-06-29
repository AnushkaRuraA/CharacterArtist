import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

export const PortfolioLightbox = ({ item, onClose }) => {
  const [activeImg, setActiveImg] = useState(0);
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setActiveImg((p) => (p + 1) % item.images.length);
      if (e.key === 'ArrowLeft') setActiveImg((p) => (p - 1 + item.images.length) % item.images.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, item.images.length]);

  const tags = [...(item.software || []), ...(item.tags || [])];
  const currentImage = item.images?.[activeImg];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-sm flex"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center border border-dark-border text-off-white/50 hover:text-amber hover:border-amber transition-colors z-10"
        >
          ✕
        </button>

        {/* Main image */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
          <motion.div
            key={activeImg}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-h-full max-w-full"
          >
            {currentImage?.url ? (
              <img
                src={currentImage.url}
                alt={item.title}
                className="max-h-[80vh] max-w-full object-contain"
              />
            ) : (
              <div className="w-96 h-96 bg-dark-surface flex items-center justify-center">
                <span className="text-off-white/20">No image</span>
              </div>
            )}
          </motion.div>

          {/* Nav arrows */}
          {item.images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg((p) => (p - 1 + item.images.length) % item.images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-dark-border text-off-white/50 hover:border-amber hover:text-amber transition-colors flex items-center justify-center"
              >
                ←
              </button>
              <button
                onClick={() => setActiveImg((p) => (p + 1) % item.images.length)}
                className="absolute right-[320px] top-1/2 -translate-y-1/2 w-10 h-10 border border-dark-border text-off-white/50 hover:border-amber hover:text-amber transition-colors flex items-center justify-center hidden md:flex"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Sidebar info */}
        <div className="w-full md:w-80 bg-dark-surface border-l border-dark-border flex flex-col overflow-y-auto md:relative absolute bottom-0 left-0 right-0 md:bottom-auto max-h-[40vh] md:max-h-full">
          <div className="p-6 flex flex-col gap-5 flex-1">
            <div>
              <p className="section-label text-amber mb-2">{item.category}</p>
              <h2 className="font-display font-bold text-off-white text-xl">{item.title}</h2>
              {item.year && <p className="font-body text-off-white/30 text-xs mt-1">{item.year}</p>}
            </div>

            {item.description && (
              <p className="font-body text-off-white/60 text-sm leading-relaxed border-t border-dark-border pt-4">
                {item.description}
              </p>
            )}

            <div className="flex flex-col gap-3 text-xs font-body">
              {item.engine && (
                <div className="flex justify-between">
                  <span className="text-off-white/30 uppercase tracking-wider">Engine</span>
                  <span className="text-off-white/70">{item.engine}</span>
                </div>
              )}
              {item.polyCount && (
                <div className="flex justify-between">
                  <span className="text-off-white/30 uppercase tracking-wider">Poly Count</span>
                  <span className="text-off-white/70">{item.polyCount}</span>
                </div>
              )}
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 border border-dark-border text-off-white/30 text-xs">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Thumbnails */}
            {item.images.length > 1 && (
              <div className="flex gap-2 flex-wrap mt-auto pt-4 border-t border-dark-border">
                {item.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={cn('w-12 h-12 overflow-hidden border-2 transition-colors', i === activeImg ? 'border-amber' : 'border-transparent opacity-50')}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* 3D embed */}
            {item.modelEmbedUrl && (
              <div className="pt-4 border-t border-dark-border">
                <p className="section-label mb-3">3D Preview</p>
                <iframe
                  src={item.modelEmbedUrl}
                  title="3D Model"
                  className="w-full aspect-video border border-dark-border"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
