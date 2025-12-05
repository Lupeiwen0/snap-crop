# Snap Crop

[![npm version](https://img.shields.io/npm/v/snap-crop.svg)](https://www.npmjs.com/package/snap-crop)
[![license](https://img.shields.io/npm/l/snap-crop.svg)](https://github.com/Lupeiwen0/snap-crop/blob/main/LICENSE)

A React image cropping component with both **Crop Mode** and **Fill Mode**.

## ✨ Features

- 🖼️ **Crop Mode**: Crop images by adjusting the crop frame with zoom and pan
- 📐 **Fill Mode**: Position images within a fixed frame with customizable fill color
- 📝 **Aspect Ratios**: Support for 16:9, 9:16, 1:1, 4:3, 3:4
- 💾 **Export**: Export to JPEG, PNG, or WebP with quality control
- 📱 **Responsive**: Works on desktop and mobile
- ⚡ **Controlled & Uncontrolled**: Supports both controlled and uncontrolled usage patterns
- 🔧 **Flexible API**: Pass through all `react-easy-crop` props for full customization

## 📦 Installation

```bash
npm install snap-crop
```

```bash
yarn add snap-crop
```

```bash
pnpm add snap-crop
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-dom react-easy-crop
```

## 🚀 Quick Start

```tsx
import { useRef } from "react";
import { SnapCrop, SnapCropRef } from "snap-crop";
import "snap-crop/style.css";

function App() {
  const snapCropRef = useRef<SnapCropRef>(null);

  const handleExport = async () => {
    await snapCropRef.current?.export({
      format: "jpeg",
      quality: 0.9,
      filename: "cropped-image.jpg",
    });
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <SnapCrop
        ref={snapCropRef}
        image="/path/to/image.jpg"
        aspect="16:9"
        mode="crop"
        fillColor="#FFFFFF"
      />
      <button onClick={handleExport}>Export</button>
    </div>
  );
}
```

## 📖 Usage Examples

### Basic Crop Mode

```tsx
import { SnapCrop, SnapCropRef } from "snap-crop";
import "snap-crop/style.css";

function CropExample() {
  const ref = useRef<SnapCropRef>(null);

  return (
    <div style={{ width: "600px", height: "400px" }}>
      <SnapCrop
        ref={ref}
        image="/photo.jpg"
        aspect="16:9"
        mode="crop"
        showGrid={true}
      />
    </div>
  );
}
```

### Fill Mode with Custom Color

```tsx
function FillExample() {
  const ref = useRef<SnapCropRef>(null);

  return (
    <div style={{ width: "600px", height: "400px" }}>
      <SnapCrop
        ref={ref}
        image="/photo.jpg"
        aspect="9:16"
        mode="fill"
        fillColor="#000000"
      />
    </div>
  );
}
```

### Controlled Zoom & Position

You can control the zoom level and crop position externally:

```tsx
function ControlledExample() {
  const ref = useRef<SnapCropRef>(null);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  return (
    <div>
      <input
        type="range"
        min={1}
        max={3}
        step={0.1}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
      />
      <span>{zoom.toFixed(1)}x</span>

      <div style={{ width: "600px", height: "400px" }}>
        <SnapCrop
          ref={ref}
          image="/photo.jpg"
          aspect="16:9"
          mode="crop"
          zoom={zoom}
          onZoomChange={setZoom}
          crop={crop}
          onCropPositionChange={setCrop}
        />
      </div>
    </div>
  );
}
```

### Export as Blob

Use `getBlob()` to get the image as a Blob for uploading:

```tsx
const handleUpload = async () => {
  const blob = await snapCropRef.current?.getBlob({
    format: "png",
    quality: 1,
  });

  if (blob) {
    const formData = new FormData();
    formData.append("file", blob, "image.png");
    await fetch("/api/upload", { method: "POST", body: formData });
  }
};
```

## 📋 API Reference

### SnapCrop Props

| Prop        | Type          | Default      | Description                                                         |
| ----------- | ------------- | ------------ | ------------------------------------------------------------------- |
| `image`     | `string`      | **required** | Image source URL or base64 string                                   |
| `aspect`    | `AspectRatio` | `'16:9'`     | Aspect ratio: `'16:9'` \| `'9:16'` \| `'1:1'` \| `'4:3'` \| `'3:4'` |
| `mode`      | `CropMode`    | `'crop'`     | Operating mode: `'crop'` \| `'fill'`                                |
| `fillColor` | `string`      | `'#FFFFFF'`  | Fill color for fill mode (hex or `'transparent'`)                   |
| `className` | `string`      | `''`         | Custom CSS class                                                    |

#### Crop Mode Control Props

| Prop                   | Type                                       | Description                                         |
| ---------------------- | ------------------------------------------ | --------------------------------------------------- |
| `crop`                 | `Point`                                    | Controlled crop position `{ x: number, y: number }` |
| `onCropPositionChange` | `(crop: Point) => void`                    | Callback when crop position changes                 |
| `zoom`                 | `number`                                   | Controlled zoom level                               |
| `onZoomChange`         | `(zoom: number) => void`                   | Callback when zoom changes                          |
| `onCropChange`         | `(croppedArea, croppedAreaPixels) => void` | Callback when crop area changes                     |

#### Cropper Props (passed through from react-easy-crop)

| Prop        | Type                     | Default     | Description                      |
| ----------- | ------------------------ | ----------- | -------------------------------- |
| `minZoom`   | `number`                 | `1`         | Minimum zoom level               |
| `maxZoom`   | `number`                 | `3`         | Maximum zoom level               |
| `zoomSpeed` | `number`                 | `0.2`       | Zoom speed multiplier            |
| `showGrid`  | `boolean`                | `true`      | Show grid overlay                |
| `cropShape` | `'rect'` \| `'round'`    | `'rect'`    | Shape of the crop area           |
| `objectFit` | `'contain'` \| `'cover'` | `'contain'` | How the image fits the container |

### SnapCrop Ref Methods

Access these methods via `useRef`:

```tsx
const snapCropRef = useRef<SnapCropRef>(null);
```

#### `export(options?)`

Export the current crop/fill result as a downloaded file.

```tsx
await snapCropRef.current?.export({
  format: "jpeg", // 'jpeg' | 'png' | 'webp'
  quality: 0.9, // 0-1 (for jpeg and webp only)
  filename: "image.jpg",
});
```

#### `getBlob(options?)`

Get the current crop/fill result as a Blob.

```tsx
const blob = await snapCropRef.current?.getBlob({
  format: "png",
  quality: 1,
});
```

#### `reset()`

Reset crop/fill to default position and zoom.

```tsx
snapCropRef.current?.reset();
```

## 🎨 Styling

Import the default styles:

```tsx
import "snap-crop/style.css";
```

The component uses CSS classes that you can override:

| Class         | Description         |
| ------------- | ------------------- |
| `.snap-crop`  | Main container      |
| `.crop-mode`  | Crop mode container |
| `.fill-mode`  | Fill mode container |
| `.fill-frame` | Fill mode frame     |
| `.fill-image` | Image in fill mode  |

### Custom Styling Example

```css
.snap-crop {
  border-radius: 8px;
  overflow: hidden;
}

.fill-mode .fill-frame {
  border-radius: 4px;
}
```

## 📤 Exported Utilities

The package also exports utility functions:

```tsx
import {
  // Image processing
  getCroppedImg,
  getFilledImg,
  downloadBlob,
  createImage,

  // File validation
  validateImageFile,
  fileToDataUrl,
  getImageDimensions,

  // Constants
  ASPECT_RATIOS,
  DEFAULT_SIZES,
  PRESET_COLORS,
  MIN_IMAGE_SIZE,
  MAX_IMAGE_SIZE,
  MAX_FILE_SIZE,
} from "snap-crop";
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build library
npm run build:lib

# Type check
npm run typecheck

# Lint
npm run lint
```

## 📝 Modes

### Crop Mode

- Adjust crop frame by dragging
- Zoom with mouse wheel or pinch gesture
- Pan image when zoomed
- Double-click to reset to default

### Fill Mode

- Image is scaled to fit within the frame (short edge touches frame edge)
- Drag image to adjust position within frame
- Fill color applies to empty areas around the image
- Double-click to reset position

## 📄 License

MIT © [Lupeiwen0](https://github.com/Lupeiwen0)
