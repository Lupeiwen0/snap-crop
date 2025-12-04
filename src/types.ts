import type {
  CropperProps as BaseCropperProps,
  Point,
  Area,
} from "react-easy-crop";

// Re-export react-easy-crop types
export type { Point, Area };
export type CropperProps = Omit<BaseCropperProps, "image" | "aspect">;

// Types
export type AspectRatio = "16:9" | "9:16" | "1:1" | "4:3" | "3:4";
export type CropMode = "crop" | "fill";
export type ExportFormat = "jpeg" | "png" | "webp";

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SnapCropProps {
  /** Image source URL or base64 string */
  image: string;
  /** Aspect ratio of the crop area */
  aspect?: AspectRatio;
  /** Mode: 'crop' for cropping, 'fill' for filling */
  mode?: CropMode;
  /** Fill color for fill mode (hex or rgba) */
  fillColor?: string;
  /** Callback when crop/position changes */
  onCropChange?: (crop: CropArea) => void;
  /** Callback when crop is complete */
  onCropComplete?: (croppedArea: CropArea, croppedAreaPixels: CropArea) => void;
  /** Custom class name */
  className?: string;
}

export interface ExportOptions {
  format?: ExportFormat;
  quality?: number; // 0-1, for jpeg and webp
}

// Constants
export const ASPECT_RATIOS: Record<AspectRatio, number> = {
  "16:9": 16 / 9,
  "9:16": 9 / 16,
  "1:1": 1,
  "4:3": 4 / 3,
  "3:4": 3 / 4,
};

export const DEFAULT_SIZES: Record<
  AspectRatio,
  { width: number; height: number }
> = {
  "16:9": { width: 1920, height: 1080 },
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
  "4:3": { width: 1920, height: 1440 },
  "3:4": { width: 1440, height: 1920 },
};

export const PRESET_COLORS = [
  { label: "White", value: "#FFFFFF" },
  { label: "Black", value: "#000000" },
  { label: "Light Gray", value: "#F5F5F5" },
  { label: "Transparent", value: "transparent" },
];

// Min/Max constraints
export const MIN_IMAGE_SIZE = 256;
export const MAX_IMAGE_SIZE = 8000;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
