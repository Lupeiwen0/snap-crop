// Re-export SnapCrop types for backward compatibility
export type {
  AspectRatio,
  AspectRatioValue,
  CropMode,
  CropArea,
  ExportFormat,
  CropperProps,
  Point,
  Area,
} from "./components/SnapCrop/types";

export {
  ASPECT_RATIOS,
  getAspectRatioValue,
} from "./components/SnapCrop/types";

// Types not specific to SnapCrop
export interface ExportOptions {
  format?: "jpeg" | "png" | "webp";
  quality?: number; // 0-1, for jpeg and webp
}

// Constants
export const DEFAULT_SIZES: Record<
  "16:9" | "9:16" | "1:1" | "4:3" | "3:4",
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
