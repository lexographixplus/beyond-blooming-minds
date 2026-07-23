import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, PointerEvent, SyntheticEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, GripHorizontal, RotateCcw, X } from 'lucide-react';

type CropModalProps = {
  open: boolean;
  file: File | null;
  aspectRatio?: number;
  title?: string;
  subtitle?: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: (file: File) => Promise<void> | void;
};

type Point = { x: number; y: number };
type Size = { width: number; height: number };

const createImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

const toFile = async (blob: Blob, fileName: string) =>
  new File([blob], fileName, { type: 'image/jpeg', lastModified: Date.now() });

export default function ImageCropModal({
  open, file, aspectRatio = 2 / 3,
  title = 'Crop cover image',
  subtitle = 'Drag the image to frame the part you want, then zoom it to fit the cover.',
  confirmLabel = 'Use cropped image',
  onClose, onConfirm,
}: CropModalProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const previewUrlRef = useRef<string>('');
  const dragStateRef = useRef<{ start: Point; origin: Point } | null>(null);

  const [previewUrl, setPreviewUrl] = useState('');
  const [naturalSize, setNaturalSize] = useState<Size>({ width: 0, height: 0 });
  const [frameSize, setFrameSize] = useState<Size>({ width: 0, height: 0 });
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);

  const coverScale = useMemo(() => {
    if (!naturalSize.width || !naturalSize.height || !frameSize.width || !frameSize.height) return 1;
    return Math.max(frameSize.width / naturalSize.width, frameSize.height / naturalSize.height);
  }, [frameSize, naturalSize]);

  const renderedSize = useMemo(() => ({
    width: naturalSize.width * coverScale * zoom,
    height: naturalSize.height * coverScale * zoom,
  }), [coverScale, naturalSize, zoom]);

  const clampPosition = (next: Point, size = renderedSize) => {
    if (!frameSize.width || !frameSize.height || !size.width || !size.height) return next;
    return {
      x: Math.min(0, Math.max(frameSize.width - size.width, next.x)),
      y: Math.min(0, Math.max(frameSize.height - size.height, next.y)),
    };
  };

  useEffect(() => {
    if (!open || !file) {
      setPreviewUrl(''); setNaturalSize({ width: 0, height: 0 }); setFrameSize({ width: 0, height: 0 });
      setPosition({ x: 0, y: 0 }); setZoom(1); setReady(false); previewUrlRef.current = '';
      return;
    }
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url; setPreviewUrl(url); setNaturalSize({ width: 0, height: 0 });
    setPosition({ x: 0, y: 0 }); setZoom(1); setReady(false);
    return () => URL.revokeObjectURL(url);
  }, [file, open]);

  useEffect(() => {
    if (!open || !frameRef.current) return;
    const measure = () => {
      const rect = frameRef.current?.getBoundingClientRect();
      if (rect) setFrameSize({ width: rect.width, height: rect.height });
    };
    measure();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (observer && frameRef.current) observer.observe(frameRef.current);
    window.addEventListener('resize', measure);
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, [open]);

  useEffect(() => {
    if (!open || !previewUrl || !frameSize.width || !frameSize.height || !naturalSize.width || !naturalSize.height || ready) return;
    setPosition(clampPosition({ x: (frameSize.width - renderedSize.width) / 2, y: (frameSize.height - renderedSize.height) / 2 }));
    setReady(true);
  }, [open, previewUrl, frameSize, naturalSize, renderedSize.width, renderedSize.height, ready]);

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => setNaturalSize({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight });

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragStateRef.current = { start: { x: e.clientX, y: e.clientY }, origin: position };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current) return;
    setPosition(clampPosition({
      x: dragStateRef.current.origin.x + e.clientX - dragStateRef.current.start.x,
      y: dragStateRef.current.origin.y + e.clientY - dragStateRef.current.start.y,
    }));
  };

  const handlePointerUp = () => { dragStateRef.current = null; };

  const handleZoomChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextZoom = Number(e.target.value);
    setZoom(nextZoom);
    setPosition((prev) => clampPosition(prev, {
      width: naturalSize.width * coverScale * nextZoom,
      height: naturalSize.height * coverScale * nextZoom,
    }));
  };

  const resetCrop = () => {
    setZoom(1);
    setPosition(clampPosition({ x: (frameSize.width - renderedSize.width) / 2, y: (frameSize.height - renderedSize.height) / 2 }));
  };

  const handleConfirm = async () => {
    if (!file || !previewUrlRef.current || !frameSize.width || !frameSize.height || !naturalSize.width || !naturalSize.height) return;
    setSaving(true);
    try {
      const image = await createImage(previewUrlRef.current);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(frameSize.width); canvas.height = Math.round(frameSize.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');
      ctx.drawImage(image, 0, 0, naturalSize.width, naturalSize.height, position.x, position.y, renderedSize.width, renderedSize.height);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Export failed')), 'image/jpeg', 0.94);
      });
      await onConfirm(await toFile(blob, file.name.replace(/\.[^.]+$/, '-cropped.jpg')));
    } finally { setSaving(false); }
  };

  return (
    <AnimatePresence>
      {open && file && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm" onClick={onClose}
        >
          <motion.div initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 28, scale: 0.98 }}
            transition={{ duration: 0.25 }} className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">Image tool</p>
                <h3 className="mt-1.5 text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 transition-colors" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="grid gap-6 overflow-y-auto p-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div ref={frameRef} className="relative max-h-[50vh] overflow-hidden rounded-xl border border-gray-200 bg-gray-900 lg:max-h-[60vh]"
                  style={{ aspectRatio }} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}
                >
                  <img src={previewUrl} alt="Crop preview" draggable={false} onLoad={handleImageLoad} className="absolute left-0 top-0 select-none"
                    style={{ width: `${renderedSize.width}px`, height: `${renderedSize.height}px`, transform: `translate(${position.x}px, ${position.y}px)`, cursor: dragStateRef.current ? 'grabbing' : 'grab' }}
                  />
                  <div className="pointer-events-none absolute inset-0 border border-dashed border-white/40" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={resetCrop} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                    <RotateCcw size={16} />Reset
                  </button>
                  <button type="button" onClick={onClose} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <X size={16} />Cancel
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900"><GripHorizontal size={14} />Adjustments</div>
                <div className="mt-5 space-y-5">
                  <div>
                    <div className="mb-3 flex items-center justify-between text-sm text-gray-600"><span>Zoom</span><span>{Math.round(zoom * 100)}%</span></div>
                    <input type="range" min="1" max="2.5" step="0.01" value={zoom} onChange={handleZoomChange} className="w-full accent-primary-600" />
                  </div>
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">Preview</p>
                    <div className="mt-3 overflow-hidden rounded-lg bg-gray-100">
                      <div className="relative mx-auto aspect-[2/3] w-40 overflow-hidden">
                        {frameSize.width > 0 && (
                          <img src={previewUrl} alt="Thumbnail" draggable={false} className="absolute left-0 top-0 select-none"
                            style={{
                              width: `${(160 / frameSize.width) * renderedSize.width}px`,
                              height: `${(160 / frameSize.width) * renderedSize.height}px`,
                              transform: `translate(${(160 / frameSize.width) * position.x}px, ${(160 / frameSize.width) * position.y}px)`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button type="button" onClick={handleConfirm} disabled={saving}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-70 transition-colors"
                >
                  <Check size={16} />{saving ? 'Applying crop...' : confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
