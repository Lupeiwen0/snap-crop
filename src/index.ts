// Main component
export { SnapCrop } from "./SnapCrop";
export type { SnapCropProps, SnapCropRef } from "./SnapCrop";

// Sub-components
export { CropMode } from "./components/CropMode";
export { FillMode } from "./components/FillMode";
export { ColorPicker } from "./components/ColorPicker";

// Types
export type {
  AspectRatio,
  CropMode as TCropMode,
  CropArea,
  ExportFormat,
  ExportOptions,
  CropperProps,
  Point,
  Area,
} from "./types";

export type { CropModeProps, CropModeRef } from "./components/CropMode";

export {
  ASPECT_RATIOS,
  DEFAULT_SIZES,
  PRESET_COLORS,
  MIN_IMAGE_SIZE,
  MAX_IMAGE_SIZE,
  MAX_FILE_SIZE,
} from "./types";

// Utilities
export {
  getCroppedImg,
  downloadBlob,
  getExtension,
  createImage,
} from "./utils/cropImage";
export { getFilledImg, calculateFillDimensions } from "./utils/fillImage";
export type { FillImagePosition, FillImageDimensions } from "./utils/fillImage";
export {
  validateImageFile,
  fileToDataUrl,
  getImageDimensions,
} from "./utils/imageHelpers";
export type { ImageValidation } from "./utils/imageHelpers";
