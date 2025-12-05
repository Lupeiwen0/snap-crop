import type {
  CropperProps as BaseCropperProps,
  Point,
  Area,
} from "react-easy-crop";

// Re-export react-easy-crop types
export type { Point, Area };
export type CropperProps = Omit<BaseCropperProps, "image" | "aspect">;

// SnapCrop specific types
export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3" | "3:4";
/** Aspect ratio value: can be a preset string or custom number (width/height ratio) */
export type AspectRatioValue = AspectRatio | number;
export type CropMode = "crop" | "fill";
export type ExportFormat = "jpeg" | "png" | "webp";

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Constants
export const ASPECT_RATIOS: Record<AspectRatio, number> = {
  "16:9": 16 / 9,
  "9:16": 9 / 16,
  "1:1": 1,
  "4:3": 4 / 3,
  "3:4": 3 / 4,
};

/**
 * Convert AspectRatioValue to numeric value
 * @param aspect - Preset string ("16:9", "1:1", etc.) or custom number
 * @returns Numeric aspect ratio (width / height)
 */
export function getAspectRatioValue(aspect: AspectRatioValue): number {
  if (typeof aspect === "number") {
    return aspect;
  }
  return ASPECT_RATIOS[aspect];
}
