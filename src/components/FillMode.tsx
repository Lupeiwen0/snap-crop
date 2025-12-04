import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
import { AspectRatio, ASPECT_RATIOS } from "../types";
import { calculateFillDimensions, FillImagePosition } from "../utils/fillImage";
import { getImageDimensions } from "../utils/imageHelpers";
import "./FillMode.css";

interface FillModeProps {
  image: string;
  aspect: AspectRatio;
  fillColor: string;
  onPositionChange: (position: FillImagePosition) => void;
}

export function FillMode({
  image,
  aspect,
  fillColor,
  onPositionChange,
}: FillModeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<FillImagePosition>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Load image dimensions
  useEffect(() => {
    getImageDimensions(image).then(setImageDimensions);
    setPosition({ x: 0, y: 0 });
  }, [image]);

  // Update container size using ResizeObserver
  // ResizeObserver triggers immediately when observation starts, so no setTimeout needed
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setContainerSize({ width, height });
        }
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [aspect]);

  // Reset position when aspect changes
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [aspect]);

  // Calculate fill dimensions based on aspect ratio
  const fillDims = useMemo(() => {
    if (!imageDimensions) return null;
    return calculateFillDimensions(
      imageDimensions.width,
      imageDimensions.height,
      aspect
    );
  }, [imageDimensions, aspect]);

  // Calculate display scale to fit container - frame should always fit within container
  const displayScale = useMemo(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return 1;

    const availableWidth = containerSize.width;
    const availableHeight = containerSize.height;

    // Use the aspect ratio to calculate frame dimensions that fit the container
    const aspectRatio = ASPECT_RATIOS[aspect];

    // Calculate the largest frame that fits in the container
    let frameDisplayWidth: number;
    let frameDisplayHeight: number;

    if (aspectRatio >= 1) {
      // Landscape frame (16:9) - width is longer
      frameDisplayWidth = availableWidth;
      frameDisplayHeight = availableWidth / aspectRatio;

      if (frameDisplayHeight > availableHeight) {
        frameDisplayHeight = availableHeight;
        frameDisplayWidth = availableHeight * aspectRatio;
      }
    } else {
      // Portrait frame (9:16) - height is longer
      frameDisplayHeight = availableHeight;
      frameDisplayWidth = availableHeight * aspectRatio;

      if (frameDisplayWidth > availableWidth) {
        frameDisplayWidth = availableWidth;
        frameDisplayHeight = availableWidth / aspectRatio;
      }
    }

    // Return the scale factor based on the target output dimensions
    if (fillDims) {
      return frameDisplayWidth / fillDims.frameWidth;
    }

    return 1;
  }, [containerSize, aspect, fillDims]);

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!fillDims || (!fillDims.canMoveX && !fillDims.canMoveY)) return;

      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x * displayScale,
        y: e.clientY - position.y * displayScale,
      });
    },
    [position, displayScale, fillDims]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !fillDims) return;

      let newX = (e.clientX - dragStart.x) / displayScale;
      let newY = (e.clientY - dragStart.y) / displayScale;

      // Clamp to bounds
      if (fillDims.canMoveX) {
        newX = Math.max(-fillDims.maxMoveX, Math.min(fillDims.maxMoveX, newX));
      } else {
        newX = 0;
      }

      if (fillDims.canMoveY) {
        newY = Math.max(-fillDims.maxMoveY, Math.min(fillDims.maxMoveY, newY));
      } else {
        newY = 0;
      }

      setPosition({ x: newX, y: newY });
    },
    [isDragging, dragStart, displayScale, fillDims]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onPositionChange(position);
    }
  }, [isDragging, position, onPositionChange]);

  const handleDoubleClick = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    onPositionChange({ x: 0, y: 0 });
  }, [onPositionChange]);

  // Calculate positions for rendering
  const canMove = fillDims && (fillDims.canMoveX || fillDims.canMoveY);

  // Show loading state until we have valid container size and image dimensions
  const isReady =
    fillDims && containerSize.width > 0 && containerSize.height > 0;

  if (!isReady) {
    return (
      <div ref={containerRef} className="fill-mode">
        <div className="fill-mode-loading">加载中...</div>
      </div>
    );
  }

  const frameWidth = fillDims.frameWidth * displayScale;
  const frameHeight = fillDims.frameHeight * displayScale;

  const frameStyle = {
    width: frameWidth,
    height: frameHeight,
    backgroundColor: fillColor === "transparent" ? "transparent" : fillColor,
  };

  const imageStyle = {
    width: fillDims.imageWidth * displayScale,
    height: fillDims.imageHeight * displayScale,
    left: `calc(50% + ${position.x * displayScale}px)`,
    top: `calc(50% + ${position.y * displayScale}px)`,
    transform: "translate(-50%, -50%)",
    cursor: canMove ? (isDragging ? "grabbing" : "grab") : "default",
  };

  return (
    <div
      ref={containerRef}
      className="fill-mode"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Checkered border container */}
      <div className="fill-frame-container">
        <div
          className={`fill-frame ${
            fillColor === "transparent" ? "transparent-bg" : ""
          }`}
          style={frameStyle}
        >
          <img
            src={image}
            alt="Preview"
            className="fill-image"
            style={imageStyle}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            draggable={false}
          />

          {/* Grid overlay - Rule of thirds */}
          <div className="fill-grid">
            <div
              className="fill-grid-line fill-grid-v1"
              style={{ left: `${frameWidth / 3}px` }}
            />
            <div
              className="fill-grid-line fill-grid-v2"
              style={{ left: `${(frameWidth * 2) / 3}px` }}
            />
            <div
              className="fill-grid-line fill-grid-h1"
              style={{ top: `${frameHeight / 3}px` }}
            />
            <div
              className="fill-grid-line fill-grid-h2"
              style={{ top: `${(frameHeight * 2) / 3}px` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
