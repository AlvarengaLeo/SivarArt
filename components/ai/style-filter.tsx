"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Download, Share2, Upload, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────
 * Filtro de estilo 100% ON-DEVICE con Canvas 2D puro.
 * Sin dependencias nuevas, sin modelos, sin red (más allá de
 * cargar la imagen de ejemplo). Todo el píxel se procesa en el
 * navegador del usuario → privacidad total.
 * ────────────────────────────────────────────────────────── */

type StyleId = "la-palma" | "naif" | "alto-contraste";

interface StylePreset {
  id: StyleId;
  name: string;
  description: string;
  /** Niveles base de cuantización por canal (menos = más posterizado). */
  levels: number;
  /** Realce de saturación (1 = neutro). */
  saturation: number;
  /** Umbral base para el contorno (menor = más líneas). */
  edge: number;
  /** Grosor relativo del contorno. */
  edgeStrength: number;
}

const PRESETS: Record<StyleId, StylePreset> = {
  "la-palma": {
    id: "la-palma",
    name: "La Palma",
    description: "Naïf de Chalatenango: planos de color y contorno marcado.",
    levels: 5,
    saturation: 1.45,
    edge: 42,
    edgeStrength: 1,
  },
  naif: {
    id: "naif",
    name: "Naïf",
    description: "Más suave y colorido, con líneas finas.",
    levels: 7,
    saturation: 1.3,
    edge: 60,
    edgeStrength: 0.7,
  },
  "alto-contraste": {
    id: "alto-contraste",
    name: "Alto contraste",
    description: "Pocos colores, líneas gruesas, look serigráfico.",
    levels: 3,
    saturation: 1.6,
    edge: 30,
    edgeStrength: 1.4,
  },
};

const SAMPLES = [
  { seed: "obra-2", label: "Pueblo" },
  { seed: "obra-6", label: "Fiesta" },
  { seed: "obra-7", label: "Volcán" },
] as const;

const MAX_DIM = 1024;

/** Limita una dimensión manteniendo proporción. */
function fitSize(w: number, h: number) {
  if (w <= MAX_DIM && h <= MAX_DIM) return { w, h };
  const ratio = w / h;
  return ratio >= 1
    ? { w: MAX_DIM, h: Math.round(MAX_DIM / ratio) }
    : { w: Math.round(MAX_DIM * ratio), h: MAX_DIM };
}

/** Convierte RGB→HSL, sube saturación, vuelve a RGB (sobre el píxel data). */
function boostSaturation(data: Uint8ClampedArray, factor: number) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;
    const d = max - min;
    if (d !== 0) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        default:
          h = (r - g) / d + 4;
      }
      h /= 6;
    }
    s = Math.min(1, s * factor);

    // HSL → RGB
    let nr = l;
    let ng = l;
    let nb = l;
    if (s !== 0) {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const hue = (t: number) => {
        let tt = t;
        if (tt < 0) tt += 1;
        if (tt > 1) tt -= 1;
        if (tt < 1 / 6) return p + (q - p) * 6 * tt;
        if (tt < 1 / 2) return q;
        if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
        return p;
      };
      nr = hue(h + 1 / 3);
      ng = hue(h);
      nb = hue(h - 1 / 3);
    }
    data[i] = nr * 255;
    data[i + 1] = ng * 255;
    data[i + 2] = nb * 255;
  }
}

/** Posteriza cada canal a `levels` niveles. */
function posterize(data: Uint8ClampedArray, levels: number) {
  const step = 255 / (levels - 1);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] / step) * step;
    data[i + 1] = Math.round(data[i + 1] / step) * step;
    data[i + 2] = Math.round(data[i + 2] / step) * step;
  }
}

/**
 * Aplica el estilo completo sobre el contexto offscreen y devuelve
 * el ImageData final listo para pintar.
 */
function applyStyle(
  src: ImageData,
  preset: StylePreset,
  intensity: number, // 0..1
): ImageData {
  const { width, height } = src;
  const out = new ImageData(width, height);
  // copia base
  out.data.set(src.data);

  // 1) saturación (escala con intensidad)
  boostSaturation(out.data, 1 + (preset.saturation - 1) * intensity);

  // 2) posterización: a más intensidad, menos niveles
  const levels = Math.max(
    2,
    Math.round(preset.levels - (preset.levels - 2) * intensity),
  );
  posterize(out.data, levels);

  // 3) contornos negros por detección de bordes simple sobre el ORIGINAL
  //    (diferencia de luminancia con vecino derecho + inferior).
  const sd = src.data;
  const od = out.data;
  const threshold = Math.max(
    8,
    preset.edge - preset.edge * 0.6 * intensity,
  );
  const lum = (idx: number) =>
    0.299 * sd[idx] + 0.587 * sd[idx + 1] + 0.114 * sd[idx + 2];

  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const i = (y * width + x) * 4;
      const right = (y * width + (x + 1)) * 4;
      const down = ((y + 1) * width + x) * 4;
      const l0 = lum(i);
      const gx = Math.abs(l0 - lum(right));
      const gy = Math.abs(l0 - lum(down));
      if (gx + gy > threshold) {
        od[i] = 18;
        od[i + 1] = 27;
        od[i + 2] = 44; // navy-ink
        // grosor: pinta también el vecino derecho según fuerza
        if (preset.edgeStrength >= 1) {
          od[right] = 18;
          od[right + 1] = 27;
          od[right + 2] = 44;
        }
        if (preset.edgeStrength >= 1.3) {
          od[down] = 18;
          od[down + 1] = 27;
          od[down + 2] = 44;
        }
      }
    }
  }

  return out;
}

export function StyleFilter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  // ImageData original (ya escalado) para reprocesar al mover sliders.
  const sourceRef = useRef<ImageData | null>(null);

  const [styleId, setStyleId] = useState<StyleId>("la-palma");
  const [intensity, setIntensity] = useState(0.6);
  const [hasImage, setHasImage] = useState(false);
  const [busy, setBusy] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCanShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
  }, []);

  /** Pinta el resultado actual usando sourceRef + estilo + intensidad. */
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const source = sourceRef.current;
    if (!canvas || !source) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setBusy(true);
    // requestAnimationFrame para no bloquear el thread de UI en el slider.
    requestAnimationFrame(() => {
      const out = applyStyle(source, PRESETS[styleId], intensity);
      canvas.width = out.width;
      canvas.height = out.height;
      ctx.putImageData(out, 0, 0);
      setBusy(false);
    });
  }, [styleId, intensity]);

  useEffect(() => {
    if (hasImage) render();
  }, [hasImage, render]);

  /** Carga una imagen (File o URL) en un canvas offscreen y guarda su ImageData. */
  const loadImage = useCallback((image: HTMLImageElement) => {
    const { w, h } = fitSize(image.naturalWidth, image.naturalHeight);
    const off =
      offscreenRef.current ?? (offscreenRef.current = document.createElement("canvas"));
    off.width = w;
    off.height = h;
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.drawImage(image, 0, 0, w, h);
    sourceRef.current = octx.getImageData(0, 0, w, h);
    setError(null);
    setHasImage(true);
  }, []);

  const onFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError("Subí un archivo de imagen válido.");
        return;
      }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        loadImage(img);
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        setError("No se pudo leer la imagen.");
        URL.revokeObjectURL(url);
      };
      img.src = url;
    },
    [loadImage],
  );

  const onSample = useCallback(
    (seed: string) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => loadImage(img);
      img.onerror = () =>
        setError("No se pudo cargar la imagen de ejemplo.");
      img.src = `https://picsum.photos/seed/${seed}/900/1100`;
    },
    [loadImage],
  );

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `sivarart-${styleId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [styleId]);

  const share = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return download();
      const file = new File([blob], `sivarart-${styleId}.png`, {
        type: "image/png",
      });
      try {
        if (
          navigator.canShare &&
          navigator.canShare({ files: [file] }) &&
          typeof navigator.share === "function"
        ) {
          await navigator.share({
            files: [file],
            title: "Mi obra estilo SivarArt",
            text: "Hecho con el filtro IA estilo La Palma de SivarArt.",
          });
          return;
        }
      } catch {
        /* usuario canceló o no soportado → fallback */
      }
      download();
    }, "image/png");
  }, [download, styleId]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      {/* ── Lienzo ───────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-[4/5] w-full bg-surface-muted">
            {!hasImage && (
              <div className="absolute inset-0 grid place-items-center p-8 text-center">
                <div>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="size-6" />
                  </span>
                  <p className="mt-4 font-display text-lg font-semibold">
                    Subí una foto o elegí un ejemplo
                  </p>
                  <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
                    Todo se procesa aquí, en tu dispositivo. Tu imagen nunca
                    sale del navegador.
                  </p>
                </div>
              </div>
            )}
            <canvas
              ref={canvasRef}
              className={cn(
                "h-full w-full object-contain transition-opacity",
                hasImage ? "opacity-100" : "opacity-0",
                busy && "opacity-70",
              )}
              aria-label="Vista previa del filtro de estilo"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Controles ────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {error && (
          <p
            role="alert"
            className="rounded-md border border-terracotta/40 bg-terracotta/10 px-3 py-2 text-sm text-terracotta"
          >
            {error}
          </p>
        )}

        {/* Fuente de imagen */}
        <div>
          <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Imagen
          </Label>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button asChild variant="secondary" size="sm">
              <label className="cursor-pointer">
                <Upload className="size-4" />
                Subir foto
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
              </label>
            </Button>
            {SAMPLES.map((s) => (
              <Button
                key={s.seed}
                variant="ghost"
                size="sm"
                onClick={() => onSample(s.seed)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Selector de estilo */}
        <div>
          <Label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Estilo
          </Label>
          <div className="mt-2 grid gap-2">
            {(Object.keys(PRESETS) as StyleId[]).map((id) => {
              const p = PRESETS[id];
              const active = id === styleId;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setStyleId(id)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-md border px-4 py-3 text-left transition-colors",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-surface-muted",
                  )}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-medium">{p.name}</span>
                    {active && <Badge>Activo</Badge>}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {p.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Intensidad */}
        <div>
          <div className="flex items-center justify-between">
            <Label
              htmlFor="intensity"
              className="text-xs font-mono uppercase tracking-wider text-muted-foreground"
            >
              Intensidad
            </Label>
            <span className="font-mono text-xs text-muted-foreground">
              {Math.round(intensity * 100)}%
            </span>
          </div>
          <input
            id="intensity"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="mt-3 w-full accent-primary"
          />
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={download} disabled={!hasImage}>
            <Download className="size-4" />
            Descargar PNG
          </Button>
          <Button
            variant="outline"
            onClick={share}
            disabled={!hasImage}
          >
            <Share2 className="size-4" />
            {canShare ? "Compartir" : "Compartir / descargar"}
          </Button>
        </div>

        {/* CTA Hub */}
        <Card className="bg-surface/60">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-display font-semibold">Imprimilo en el Hub</p>
              <p className="text-sm text-muted-foreground">
                Llevá tu creación a una lámina física de calidad galería.
              </p>
            </div>
            <Button asChild size="sm" variant="ghost">
              <Link href="/hub" aria-label="Ir al Hub">
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
