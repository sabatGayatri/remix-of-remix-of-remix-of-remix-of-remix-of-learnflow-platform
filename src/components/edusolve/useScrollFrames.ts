import { useEffect, useRef, useState } from "react";

import stage1 from "@/assets/hero-stage-1.png";
import stage2 from "@/assets/hero-stage-2.png";
import stage3 from "@/assets/hero-stage-3.png";

export const TOTAL_FRAMES = 192;
export const FALLBACK_FRAMES = [stage1, stage2, stage3];

const buildFramePath = (index: number) => {
  const padded = String(index).padStart(3, "0");
  return `/frames/frame_${padded}_delay-0.041s.png`;
};

interface UseScrollFramesOptions {
  totalScrollHeight: number; // multiplier of viewport height
  preloadCount?: number;
}

export function useScrollFrames({ totalScrollHeight, preloadCount = 24 }: UseScrollFramesOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const fallbackImagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Preload fallback images first (always available)
  useEffect(() => {
    let mounted = true;
    let loaded = 0;
    const total = FALLBACK_FRAMES.length;
    FALLBACK_FRAMES.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (!mounted) return;
        fallbackImagesRef.current[i] = img;
        loaded++;
        if (loaded === total) {
          setReady(true);
          drawFrame(currentFrameRef.current);
        }
      };
      img.onerror = () => {
        loaded++;
        if (loaded === total) setReady(true);
      };
    });
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Try to preload real frames
  useEffect(() => {
    let mounted = true;
    let loadedCount = 0;
    let firstFrameFailed = false;

    const loadFrame = (index: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.src = buildFramePath(index);
        img.onload = () => {
          if (!mounted) return resolve();
          imagesRef.current[index] = img;
          loadedCount++;
          setLoadProgress(loadedCount / TOTAL_FRAMES);
          if (index === currentFrameRef.current) drawFrame(index);
          resolve();
        };
        img.onerror = () => {
          if (index === 0) firstFrameFailed = true;
          resolve();
        };
      });

    (async () => {
      // Test first frame first
      await loadFrame(0);
      if (firstFrameFailed) {
        setUsingFallback(true);
        return;
      }
      // Load priority batch
      const priority = Array.from({ length: Math.min(preloadCount, TOTAL_FRAMES) }, (_, i) => i);
      await Promise.all(priority.map(loadFrame));
      // Lazy load the rest in chunks
      for (let i = preloadCount; i < TOTAL_FRAMES; i += 8) {
        if (!mounted) return;
        const batch = Array.from({ length: 8 }, (_, k) => i + k).filter((n) => n < TOTAL_FRAMES);
        await Promise.all(batch.map(loadFrame));
      }
    })();

    return () => { mounted = false; };
  }, [preloadCount]);

  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    let img: HTMLImageElement | null = null;
    if (!usingFallback) {
      // find nearest loaded frame
      img = imagesRef.current[frameIndex];
      if (!img) {
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          if (imagesRef.current[frameIndex - offset]) { img = imagesRef.current[frameIndex - offset]!; break; }
          if (imagesRef.current[frameIndex + offset]) { img = imagesRef.current[frameIndex + offset]!; break; }
        }
      }
    }
    if (!img) {
      // fallback: pick stage by progress
      const stageIdx = Math.min(
        FALLBACK_FRAMES.length - 1,
        Math.floor((frameIndex / TOTAL_FRAMES) * FALLBACK_FRAMES.length)
      );
      img = fallbackImagesRef.current[stageIdx] ?? null;
    }
    if (!img) return;

    // cover-fit
    const imgRatio = img.width / img.height;
    const canvasRatio = w / h;
    let dw = w, dh = h, dx = 0, dy = 0;
    if (imgRatio > canvasRatio) {
      dh = h;
      dw = h * imgRatio;
      dx = (w - dw) / 2;
    } else {
      dw = w;
      dh = w / imgRatio;
      dy = (h - dh) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Scroll handler
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
        const progress = scrollable > 0 ? scrolled / scrollable : 0;
        setScrollProgress(progress);
        const frame = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(progress * (TOTAL_FRAMES - 1))));
        currentFrameRef.current = frame;
        drawFrame(frame);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usingFallback, ready]);

  return {
    canvasRef,
    containerRef,
    loadProgress: usingFallback ? 1 : loadProgress,
    ready,
    usingFallback,
    scrollProgress,
    totalScrollHeight,
  };
}
