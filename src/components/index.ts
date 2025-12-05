// Main component
export * from "./SnapCrop";

// Types - re-exported from SnapCrop component
export type {
  AspectRatio,
  AspectRatioValue,
  CropMode as TCropMode,
  CropArea,
  ExportFormat,
  CropperProps,
  Point,
  Area,
} from "./SnapCrop";

export { ASPECT_RATIOS, getAspectRatioValue } from "./SnapCrop";

// Additional types from main types file
export type { ExportOptions } from "../types";

export {
  DEFAULT_SIZES,
  PRESET_COLORS,
  MIN_IMAGE_SIZE,
  MAX_IMAGE_SIZE,
  MAX_FILE_SIZE,
} from "../types";

// Utilities
export {
  getCroppedImg,
  downloadBlob,
  getExtension,
  createImage,
} from "../utils/cropImage";

export { getFilledImg, calculateFillDimensions } from "../utils/fillImage";
export type {
  FillImagePosition,
  FillImageDimensions,
} from "../utils/fillImage";

export {
  validateImageFile,
  fileToDataUrl,
  getImageDimensions,
} from "../utils/imageHelpers";

export type { ImageValidation } from "../utils/imageHelpers";
