import { MIN_IMAGE_SIZE, MAX_IMAGE_SIZE, MAX_FILE_SIZE } from "../types";

export interface ImageValidation {
  valid: boolean;
  error?: string;
  width?: number;
  height?: number;
}

/**
 * Validate an image file
 */
export async function validateImageFile(file: File): Promise<ImageValidation> {
  // Check file type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "不支持的图片格式，请上传 JPG、PNG、WEBP 或 GIF 格式的图片",
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `图片大小超过限制，请上传小于 ${
        MAX_FILE_SIZE / 1024 / 1024
      }MB 的图片`,
    };
  }

  // Check image dimensions
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      if (img.width < MIN_IMAGE_SIZE || img.height < MIN_IMAGE_SIZE) {
        resolve({
          valid: false,
          error: `图片尺寸过小，请上传至少 ${MIN_IMAGE_SIZE}×${MIN_IMAGE_SIZE} 像素的图片`,
        });
        return;
      }

      if (img.width > MAX_IMAGE_SIZE || img.height > MAX_IMAGE_SIZE) {
        resolve({
          valid: false,
          error: `图片尺寸过大，请上传不超过 ${MAX_IMAGE_SIZE}×${MAX_IMAGE_SIZE} 像素的图片`,
        });
        return;
      }

      resolve({
        valid: true,
        width: img.width,
        height: img.height,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: "无法读取图片，请确保文件未损坏",
      });
    };

    img.src = url;
  });
}

/**
 * Convert a file to base64 data URL
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Get image natural dimensions from URL
 */
export function getImageDimensions(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = src;
  });
}
