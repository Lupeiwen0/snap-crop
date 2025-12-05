import { CropArea, ExportFormat } from "../types";

/**
 * Create an image element from a source URL
 */
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.crossOrigin = "anonymous";
    image.src = url;
  });

/**
 * Get the cropped image as a blob
 * @param cropShape - Shape of the crop area: "rect" for rectangle, "round" for circle
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: CropArea,
  format: ExportFormat = "jpeg",
  quality: number = 0.9,
  cropShape: "rect" | "round" = "rect"
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Apply elliptical mask if cropShape is "round"
  if (cropShape === "round") {
    ctx.beginPath();
    ctx.ellipse(
      pixelCrop.width / 2,
      pixelCrop.height / 2,
      pixelCrop.width / 2,
      pixelCrop.height / 2,
      0,
      0,
      2 * Math.PI
    );
    ctx.closePath();
    ctx.clip();
  }

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // For circular crops, force PNG format to preserve transparency
  const actualFormat = cropShape === "round" ? "png" : format;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas is empty"));
        }
      },
      `image/${actualFormat}`,
      quality
    );
  });
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get file extension from format
 */
export function getExtension(format: ExportFormat): string {
  return format === "jpeg" ? "jpg" : format;
}
