import { createImage } from "./cropImage";
import { ExportFormat, AspectRatio, DEFAULT_SIZES } from "../types";

export interface FillImagePosition {
  x: number;
  y: number;
}

export interface FillImageDimensions {
  imageWidth: number;
  imageHeight: number;
  frameWidth: number;
  frameHeight: number;
  fillTop: number;
  fillBottom: number;
  fillLeft: number;
  fillRight: number;
  canMoveX: boolean;
  canMoveY: boolean;
  maxMoveX: number;
  maxMoveY: number;
}

/**
 * Calculate fill mode dimensions
 * According to PRD: 图片自动缩放至：图片长边 = 画框短边
 * The image is scaled so that its long edge equals the frame's short edge.
 * This means the image will always fit completely inside the frame,
 * with fill color on the remaining sides.
 */
export function calculateFillDimensions(
  imageWidth: number,
  imageHeight: number,
  aspect: AspectRatio
): FillImageDimensions {
  const defaultSize = DEFAULT_SIZES[aspect];
  const frameWidth = defaultSize.width;
  const frameHeight = defaultSize.height;

  // Calculate scale ratios for both dimensions
  const scaleX = frameWidth / imageWidth;
  const scaleY = frameHeight / imageHeight;

  // Use the smaller scale to ensure image fits within frame (contain mode)
  // This ensures one edge fills the frame completely, the other edge has fill
  const scale = Math.min(scaleX, scaleY);
  const scaledWidth = Math.round(imageWidth * scale);
  const scaledHeight = Math.round(imageHeight * scale);

  // Calculate fill areas
  const fillLeft = Math.max(0, Math.floor((frameWidth - scaledWidth) / 2));
  const fillRight = Math.max(0, frameWidth - scaledWidth - fillLeft);
  const fillTop = Math.max(0, Math.floor((frameHeight - scaledHeight) / 2));
  const fillBottom = Math.max(0, frameHeight - scaledHeight - fillTop);

  // Calculate movement constraints - image can move within the fill area
  const canMoveX = scaledWidth < frameWidth;
  const canMoveY = scaledHeight < frameHeight;
  const maxMoveX = canMoveX ? Math.floor((frameWidth - scaledWidth) / 2) : 0;
  const maxMoveY = canMoveY ? Math.floor((frameHeight - scaledHeight) / 2) : 0;

  return {
    imageWidth: scaledWidth,
    imageHeight: scaledHeight,
    frameWidth,
    frameHeight,
    fillTop,
    fillBottom,
    fillLeft,
    fillRight,
    canMoveX,
    canMoveY,
    maxMoveX,
    maxMoveY,
  };
}

/**
 * Get filled image as a blob (image + fill color composite)
 */
export async function getFilledImg(
  imageSrc: string,
  aspect: AspectRatio,
  position: FillImagePosition,
  fillColor: string,
  format: ExportFormat = "jpeg",
  quality: number = 0.9
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const dims = calculateFillDimensions(image.width, image.height, aspect);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = dims.frameWidth;
  canvas.height = dims.frameHeight;

  // Fill background
  if (fillColor === "transparent") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Calculate image position with offset
  const centerX = (dims.frameWidth - dims.imageWidth) / 2;
  const centerY = (dims.frameHeight - dims.imageHeight) / 2;
  const drawX = centerX + position.x;
  const drawY = centerY + position.y;

  // Draw scaled image
  ctx.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    drawX,
    drawY,
    dims.imageWidth,
    dims.imageHeight
  );

  return new Promise((resolve, reject) => {
    const mimeType = format === "jpeg" ? "image/jpeg" : `image/${format}`;
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas is empty"));
        }
      },
      mimeType,
      quality
    );
  });
}
