import { useState, useRef, useCallback } from "react";
import { SnapCrop, SnapCropRef } from "./components/SnapCrop";
import { ColorPicker } from "./components/ColorPicker";
import { AspectRatio, CropMode, ExportFormat } from "./types";
import { validateImageFile, fileToDataUrl } from "./utils/imageHelpers";
import "./App.css";

function App() {
  const snapCropRef = useRef<SnapCropRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [mode, setMode] = useState<CropMode>("crop");
  const [aspect, setAspect] = useState<AspectRatio>("16:9");
  const [fillColor, setFillColor] = useState("#000000");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("jpeg");
  const [exportQuality, setExportQuality] = useState(90);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  // Crop mode controls - external state
  const [zoom, setZoom] = useState(1);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    const validation = await validateImageFile(file);

    if (!validation.valid) {
      setError(validation.error || "无法加载图片");
      return;
    }

    const dataUrl = await fileToDataUrl(file);
    setImage(dataUrl);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleExport = useCallback(async () => {
    if (!snapCropRef.current) return;

    setIsExporting(true);
    try {
      await snapCropRef.current.export({
        format: exportFormat,
        quality: exportQuality / 100,
        filename: `image_${aspect.replace(":", "x")}_${Date.now()}.${
          exportFormat === "jpeg" ? "jpg" : exportFormat
        }`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "导出失败");
    } finally {
      setIsExporting(false);
    }
  }, [exportFormat, exportQuality, aspect]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="app">
      <header className="toolbar">
        <div className="toolbar-section">
          <button className="toolbar-btn primary" onClick={handleUploadClick}>
            <span className="icon">📤</span>
            上传图片
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleInputChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="toolbar-section">
          <button
            className={`toolbar-btn ${mode === "crop" ? "active" : ""}`}
            onClick={() => setMode("crop")}
          >
            <span className="icon">✂️</span>
            裁剪
          </button>
          <button
            className={`toolbar-btn ${mode === "fill" ? "active" : ""}`}
            onClick={() => setMode("fill")}
          >
            <span className="icon">🖼️</span>
            填充
          </button>
        </div>

        {mode === "crop" && (
          <div className="toolbar-section">
            <label className="zoom-control">
              <span>缩放</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="zoom-slider"
              />
              <span className="zoom-value">{zoom.toFixed(1)}x</span>
            </label>
          </div>
        )}

        <div className="toolbar-section">
          <button
            className={`toolbar-btn aspect-btn ${
              aspect === "16:9" ? "active" : ""
            }`}
            onClick={() => setAspect("16:9")}
          >
            16:9
          </button>
          <button
            className={`toolbar-btn aspect-btn ${
              aspect === "9:16" ? "active" : ""
            }`}
            onClick={() => setAspect("9:16")}
          >
            9:16
          </button>
        </div>

        <div className="toolbar-section">
          <ColorPicker
            color={fillColor}
            onChange={setFillColor}
            disabled={mode === "crop"}
          />
        </div>

        <div className="toolbar-section toolbar-export">
          <select
            className="export-select"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
          >
            <option value="jpeg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WEBP</option>
          </select>

          {exportFormat !== "png" && (
            <div className="quality-control">
              <label>质量</label>
              <input
                type="range"
                min={60}
                max={100}
                value={exportQuality}
                onChange={(e) => setExportQuality(Number(e.target.value))}
              />
              <span>{exportQuality}%</span>
            </div>
          )}

          <button
            className="toolbar-btn primary export-btn"
            onClick={handleExport}
            disabled={!image || isExporting}
          >
            <span className="icon">⬇️</span>
            {isExporting ? "导出中..." : "导出"}
          </button>
        </div>
      </header>

      <main className="canvas-area">
        <section style={{ width: "500px", height: "300px", margin: "0 auto" }}>
          {error && (
            <div className="error-toast">
              {error}
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          {image ? (
            <SnapCrop
              ref={snapCropRef}
              image={image}
              aspect={aspect}
              mode={mode}
              fillColor={fillColor}
              zoom={zoom}
              onZoomChange={setZoom}
            />
          ) : (
            <div
              className="upload-zone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleUploadClick}
            >
              <div className="upload-icon">📁</div>
              <p className="upload-text">点击或拖拽图片到此处上传</p>
              <p className="upload-hint">
                支持 JPG、PNG、WEBP、GIF 格式，最大 10MB
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="status-bar">
        <span>模式: {mode === "crop" ? "裁剪" : "填充"}</span>
        <span>比例: {aspect}</span>
        {mode === "crop" && (
          <span className="hint">拖动或缩放画框选择区域，双击重置</span>
        )}
        {mode === "fill" && (
          <span className="hint">拖动图片调整位置，双击重置</span>
        )}
      </footer>
    </div>
  );
}

export default App;
