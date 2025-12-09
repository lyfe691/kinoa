import sharp from "sharp";

type RGB = { r: number; g: number; b: number };

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [h * 360, s * 100, l * 100];
}

export function getVibrantColor(
  pixels: Buffer,
  width: number,
  height: number,
): RGB | null {
  let best: RGB | null = null;
  let bestScore = -1;

  // Sample pixels (RGB format, 3 bytes per pixel)
  const totalPixels = width * height;
  const step = Math.max(1, Math.floor(totalPixels / 100)); // Sample ~100 pixels

  for (let i = 0; i < totalPixels; i += step) {
    const offset = i * 3;
    const r = pixels[offset];
    const g = pixels[offset + 1];
    const b = pixels[offset + 2];

    const [, s, l] = rgbToHsl(r, g, b);
    const saturationScore = s / 100;
    const lightnessScore = 1 - Math.abs(l - 50) / 50;
    const score = saturationScore * 0.7 + lightnessScore * 0.3;

    if (score > bestScore) {
      bestScore = score;
      best = { r, g, b };
    }
  }

  return best;
}

export async function extractImageColor(
  buffer: Buffer,
): Promise<string | null> {
  try {
    const { data, info } = await sharp(buffer)
      .resize(50, 50, { fit: "cover" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const vibrant = getVibrantColor(data, info.width, info.height);

    if (vibrant) {
      return `${vibrant.r}, ${vibrant.g}, ${vibrant.b}`;
    }
    return null;
  } catch (error) {
    console.error("Error extracting color from buffer:", error);
    return null;
  }
}
