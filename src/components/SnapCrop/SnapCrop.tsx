import {
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { CropMode, CropModeRef } from "./CropMode";
import { FillMode } from "./FillMode";
import {
  CropArea,
  AspectRatioValue,
  CropMode as TCropMode,
  ExportFormat,
  Point,
  CropperProps,
} from "./types";
import {
  getCroppedImg,
  downloadBlob,
  getExtension,
} from "../../utils/cropImage";
import { getFilledImg, FillImagePosition } from "../../utils/fillImage";

export interface SnapCropProps
  extends Partial<
    Omit<CropperProps, "onCropChange" | "onZoomChange" | "crop" | "zoom">
  > {
  /** Image source URL or base64 string */
  image: string;
  /** Aspect ratio of the crop area (preset string or custom number) */
  aspect?: AspectRatioValue;
  /** Mode: 'crop' for cropping, 'fill' for filling */
  mode?: TCropMode;
  /** Fill color for fill mode (hex or rgba) */
  fillColor?: string;
  /** Callback when crop area changes (crop mode only) */
  onCropChange?: (croppedArea: CropArea, croppedAreaPixels: CropArea) => void;
  /** Controlled crop position */
  crop?: Point;
  /** Callback when crop position changes */
  onCropPositionChange?: (crop: Point) => void;
  /** Controlled zoom level */
  zoom?: number;
  /** Callback when zoom changes */
  onZoomChange?: (zoom: number) => void;
  /** Custom class name */
  className?: string;
}

export interface SnapCropRef {
  /** Export the current crop/fill result */
  export: (options?: {
    format?: ExportFormat;
    quality?: number;
    filename?: string;
  }) => Promise<void>;
  /** Get the current crop/fill result as a Blob */
  getBlob: (options?: {
    format?: ExportFormat;
    quality?: number;
  }) => Promise<Blob>;
  /** Reset crop/fill to default position */
  reset: () => void;
}

export const SnapCrop = forwardRef<SnapCropRef, SnapCropProps>(
  (
    {
      image,
      aspect = "16:9",
      mode = "crop",
      fillColor = "#FFFFFF",
      onCropChange,
      crop,
      onCropPositionChange,
      zoom,
      onZoomChange,
      className = "",
      // Pass through Cropper props
      minZoom,
      maxZoom,
      zoomSpeed,
      showGrid,
      cropShape,
      objectFit,
      ...restCropperProps
    },
    ref
  ) => {
    const cropModeRef = useRef<CropModeRef>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
      null
    );
    const [fillPosition, setFillPosition] = useState<FillImagePosition>({
      x: 0,
      y: 0,
    });
    const currentAspect = useRef(aspect);
    currentAspect.current = aspect;

    const currentCropShape = useRef(cropShape);
    currentCropShape.current = cropShape;

    const handleCropComplete = useCallback(
      (croppedArea: CropArea, pixels: CropArea) => {
        setCroppedAreaPixels(pixels);
        onCropChange?.(croppedArea, pixels);
      },
      [onCropChange]
    );

    const handlePositionChange = useCallback((position: FillImagePosition) => {
      setFillPosition(position);
    }, []);

    const getBlob = useCallback(
      async (options?: { format?: ExportFormat; quality?: number }) => {
        const format = options?.format || "jpeg";
        const quality = options?.quality ?? 0.9;

        if (mode === "crop") {
          if (!croppedAreaPixels) {
            throw new Error("No crop area defined");
          }
          return getCroppedImg(
            image,
            croppedAreaPixels,
            format,
            quality,
            currentCropShape.current
          );
        } else {
          return getFilledImg(
            image,
            currentAspect.current,
            fillPosition,
            fillColor,
            format,
            quality
          );
        }
      },
      [mode, image, croppedAreaPixels, fillPosition, fillColor]
    );

    const exportImage = useCallback(
      async (options?: {
        format?: ExportFormat;
        quality?: number;
        filename?: string;
      }) => {
        const format = options?.format || "jpeg";
        const quality = options?.quality ?? 0.9;
        const blob = await getBlob({ format, quality });

        const filename =
          options?.filename || `image_processed.${getExtension(format)}`;
        downloadBlob(blob, filename);
      },
      [getBlob]
    );

    const reset = useCallback(() => {
      if (mode === "crop" && cropModeRef.current) {
        cropModeRef.current.reset();
      } else if (mode === "fill") {
        setFillPosition({ x: 0, y: 0 });
      }
    }, [mode]);

    useImperativeHandle(
      ref,
      () => ({
        export: exportImage,
        getBlob,
        reset,
      }),
      [exportImage, getBlob, reset]
    );

    return (
      <div className={`snap-crop relative w-full h-full ${className}`}>
        {mode === "crop" ? (
          <CropMode
            ref={cropModeRef}
            image={image}
            aspect={aspect}
            onCropComplete={handleCropComplete}
            crop={crop}
            onCropChange={onCropPositionChange}
            zoom={zoom}
            onZoomChange={onZoomChange}
            minZoom={minZoom}
            maxZoom={maxZoom}
            zoomSpeed={zoomSpeed}
            showGrid={showGrid}
            cropShape={cropShape}
            objectFit={objectFit}
            {...restCropperProps}
          />
        ) : (
          <FillMode
            image={image}
            aspect={aspect}
            fillColor={fillColor}
            onPositionChange={handlePositionChange}
          />
        )}
      </div>
    );
  }
);

SnapCrop.displayName = "SnapCrop";
