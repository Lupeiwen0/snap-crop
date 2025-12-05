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
