"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface FounderCarouselProps {
  images: string[];
  alt?: string;
  width?: number;
  height?: number;
}

export default function FounderCarousel({ images, alt, width = 140, height = 140 }: FounderCarouselProps) {
  const imgs = images && images.length > 0 ? images : ["/H1/staff1.jpeg"];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % imgs.length), 4000);
    return () => clearInterval(t);
  }, [imgs.length]);

  return (
    <div className="relative flex items-center">
      <div style={{ width, height }} className="relative rounded-full overflow-hidden flex-shrink-0">
        <Image src={imgs[idx]} alt={alt || "founder"} width={width} height={height} style={{ objectFit: "cover" }} />
      </div>

      <div className="ml-4 flex flex-col items-start">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIdx((i) => (i - 1 + imgs.length) % imgs.length)}
            className="px-2 py-1 bg-white/80 rounded-full shadow-sm text-sm hover:bg-white"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={() => setIdx((i) => (i + 1) % imgs.length)}
            className="px-2 py-1 bg-white/80 rounded-full shadow-sm text-sm hover:bg-white"
          >
            ▶
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2">Image {idx + 1} of {imgs.length}</div>
      </div>
    </div>
  );
}
