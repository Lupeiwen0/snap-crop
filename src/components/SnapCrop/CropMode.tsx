import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import Cropper from "react-easy-crop";
import {
  CropArea,
  AspectRatio,
  ASPECT_RATIOS,
  Point,
  CropperProps,
} from "./types";
import "./CropMode.css";

export interface CropModeProps extends Partial<CropperProps> {
  /** Image source URL or base64 string */
  image: string;
  /** Aspect ratio of the crop area */
  aspect: AspectRatio;
  /** Callback when crop is complete */
  onCropComplete: (croppedArea: CropArea, croppedAreaPixels: CropArea) => void;
  /** Controlled crop position */
  crop?: Point;
  /** Callback when crop position changes */
  onCropChange?: (crop: Point) => void;
  /** Controlled zoom level */
  zoom?: number;
  /** Callback when zoom changes */
  onZoomChange?: (zoom: number) => void;
}

export interface CropModeRef {
  /** Reset crop position and zoom to default */
  reset: () => void;
}

export const CropMode = forwardRef<CropModeRef, CropModeProps>(
  (
    {
      image,
      aspect,
      onCropComplete,
      crop: controlledCrop,
      onCropChange,
      zoom: controlledZoom,
      onZoomChange,
      // Cropper props with defaults
      minZoom = 1,
      maxZoom = 3,
      zoomSpeed = 0.2,
      showGrid = true,
      cropShape = "rect",
      objectFit = "contain",
      ...restCropperProps
    },
    ref
  ) => {
    // Internal state for uncontrolled mode
    const [internalCrop, setInternalCrop] = useState<Point>({ x: 0, y: 0 });
    const [internalZoom, setInternalZoom] = useState(1);

    // Use controlled or internal state
    const crop = controlledCrop ?? internalCrop;
    const zoom = controlledZoom ?? internalZoom;

    // Handle crop change
    const handleCropChange = useCallback(
      (newCrop: Point) => {
        if (onCropChange) {
          onCropChange(newCrop);
        } else {
          setInternalCrop(newCrop);
        }
      },
      [onCropChange]
    );

    // Handle zoom change
    const handleZoomChange = useCallback(
      (newZoom: number) => {
        if (onZoomChange) {
          onZoomChange(newZoom);
        } else {
          setInternalZoom(newZoom);
        }
      },
      [onZoomChange]
    );

    // Reset when aspect changes
    useEffect(() => {
      handleCropChange({ x: 0, y: 0 });
      handleZoomChange(1);
    }, [aspect, handleCropChange, handleZoomChange]);

    const handleCropCompleteInternal = useCallback(
      (croppedArea: CropArea, croppedAreaPixels: CropArea) => {
        onCropComplete(croppedArea, croppedAreaPixels);
      },
      [onCropComplete]
    );

    const handleDoubleClick = useCallback(() => {
      handleCropChange({ x: 0, y: 0 });
      handleZoomChange(1);
    }, [handleCropChange, handleZoomChange]);

    // Expose reset method via ref
    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          handleCropChange({ x: 0, y: 0 });
          handleZoomChange(1);
        },
      }),
      [handleCropChange, handleZoomChange]
    );

    return (
      <div className="crop-mode" onDoubleClick={handleDoubleClick}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={ASPECT_RATIOS[aspect]}
          onCropChange={handleCropChange}
          onZoomChange={handleZoomChange}
          onCropComplete={handleCropCompleteInternal}
          showGrid={showGrid}
          cropShape={cropShape}
          objectFit={objectFit}
          minZoom={minZoom}
          maxZoom={maxZoom}
          zoomSpeed={zoomSpeed}
          {...restCropperProps}
        />
      </div>
    );
  }
);

CropMode.displayName = "CropMode";
