# Snap Crop

A React image cropping component with both **Crop Mode** and **Fill Mode**.

## Features

- 🖼️ **Crop Mode**: Crop images by adjusting the crop frame
- 📐 **Fill Mode**: Position images within a fixed frame with customizable fill color
- 🎨 **Color Picker**: Choose from presets or custom colors for fill areas
- 📏 **Aspect Ratios**: Support for 16:9, 9:16, 1:1, 4:3, 3:4
- 💾 **Export**: Export to JPEG, PNG, or WebP with quality control
- 📱 **Responsive**: Works on desktop and mobile

## Installation

```bash
npm install snap-crop
```

## Usage

```tsx
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

## Props

| Prop           | Type                                          | Default     | Description                     |
| -------------- | --------------------------------------------- | ----------- | ------------------------------- |
| `image`        | `string`                                      | required    | Image source URL or base64      |
| `aspect`       | `'16:9' \| '9:16' \| '1:1' \| '4:3' \| '3:4'` | `'16:9'`    | Aspect ratio                    |
| `mode`         | `'crop' \| 'fill'`                            | `'crop'`    | Operating mode                  |
| `fillColor`    | `string`                                      | `'#FFFFFF'` | Fill color for fill mode        |
| `onCropChange` | `function`                                    | -           | Callback when crop area changes |
| `className`    | `string`                                      | -           | Custom CSS class                |

## Ref Methods

### `export(options)`

Export the current crop/fill result as a downloaded file.

### `getBlob(options)`

Get the current crop/fill result as a Blob.

## Modes

### Crop Mode

- Image is fixed, adjust the crop frame
- Zoom and pan controls available
- Double-click to reset

### Fill Mode

- Frame is fixed at the aspect ratio
- Drag image to adjust position
- Fill color applies to empty areas
- Double-click to reset position

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build library
npm run build:lib

# Type check
npm run typecheck
```

## License

MIT
