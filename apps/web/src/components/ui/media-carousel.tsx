'use client';

import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function isVideo(key: string): boolean {
  return /\.(mp4|webm)$/i.test(key);
}

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

const transition = { type: 'spring' as const, stiffness: 300, damping: 30 };

interface MediaCarouselProps {
  items: string[];
  alt?: string;
  className?: string;
}

export function MediaCarousel({ items, alt = '', className = '' }: MediaCarouselProps) {
  const [[currentIndex, direction], setSlide] = useState([0, 0]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const navigate = useCallback(
    (newIndex: number) => {
      if (videoRef.current) videoRef.current.pause();
      setSlide([newIndex, newIndex > currentIndex ? 1 : -1]);
    },
    [currentIndex],
  );

  const prev = useCallback(() => {
    if (currentIndex > 0) navigate(currentIndex - 1);
  }, [currentIndex, navigate]);

  const next = useCallback(() => {
    if (currentIndex < items.length - 1) navigate(currentIndex + 1);
  }, [currentIndex, items.length, navigate]);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];
  const showControls = items.length > 1;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={transition}
          className="w-full"
        >
          {isVideo(currentItem) ? (
            <video
              ref={videoRef}
              src={`/uploads/${currentItem}`}
              controls
              playsInline
              muted
              className="h-48 w-full object-cover"
            />
          ) : (
            <img
              src={`/uploads/${currentItem}`}
              alt={`${alt} ${currentIndex + 1}`}
              className="h-48 w-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {showControls && (
        <>
          {currentIndex > 0 && (
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white transition-colors hover:bg-black/50"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
          {currentIndex < items.length - 1 && (
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white transition-colors hover:bg-black/50"
            >
              <ChevronRight className="size-4" />
            </button>
          )}

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => navigate(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex ? 'w-4 bg-[#37352f]' : 'w-1.5 bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
