import { useState, useRef, useCallback } from "react";
import { SnapCrop, SnapCropRef } from "./components/SnapCrop";
import { ColorPicker } from "./components/ColorPicker";
import { AspectRatio, CropMode, ExportFormat } from "./types";
import { validateImageFile, fileToDataUrl } from "./utils/imageHelpers";

function App() {
  const snapCropRef = useRef<SnapCropRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [mode, setMode] = useState<CropMode>("crop");
  const [aspect, setAspect] = useState<AspectRatio>("16:9");
  const [fillColor, setFillColor] = useState("#7A7A7A");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("jpeg");
  const [exportQuality, setExportQuality] = useState(90);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  // Crop mode controls - external state
  const [zoom, setZoom] = useState(1);
  const [cropShape, setCropShape] = useState<"rect" | "round">("round");

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

  // Toolbar button styles
  const toolbarBtnBase =
    "flex items-center gap-1.5 px-3.5 py-2 bg-elevated border border-[#333] rounded-lg text-white text-sm cursor-pointer transition-all duration-200 hover:bg-[#3a3a3a] hover:border-[#444] disabled:opacity-50 disabled:cursor-not-allowed";
  const toolbarBtnActive = "!bg-[#4a9eff] !border-[#4a9eff]";
  const toolbarBtnPrimary =
    "!bg-[#4a9eff] !border-[#4a9eff] hover:!bg-[#3a8eef]";

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center gap-4 px-5 py-3 bg-surface border-b border-[#333] flex-wrap max-md:p-2.5 max-md:gap-2">
        <div className="flex items-center gap-2">
          <button
            className={`${toolbarBtnBase} ${toolbarBtnPrimary}`}
            onClick={handleUploadClick}
          >
            <span className="text-base">📤</span>
            上传图片
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            className={`${toolbarBtnBase} ${
              mode === "crop" ? toolbarBtnActive : ""
            }`}
            onClick={() => setMode("crop")}
          >
            <span className="text-base">✂️</span>
            裁剪
          </button>
          <button
            className={`${toolbarBtnBase} ${
              mode === "fill" ? toolbarBtnActive : ""
            }`}
            onClick={() => setMode("fill")}
          >
            <span className="text-base">🖼️</span>
            填充
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="px-3 py-2 bg-elevated border border-[#333] rounded-lg text-white text-sm cursor-pointer font-semibold min-w-[80px]"
            value={aspect}
            onChange={(e) => setAspect(e.target.value as AspectRatio)}
          >
            <option value="16:9">16:9</option>
            <option value="9:16">9:16</option>
            <option value="1:1">1:1</option>
            <option value="4:3">4:3</option>
            <option value="3:4">3:4</option>
          </select>
        </div>

        {mode === "crop" && (
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-2 bg-elevated rounded-lg text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={cropShape === "round"}
                onChange={(e) =>
                  setCropShape(e.target.checked ? "round" : "rect")
                }
                className="w-4 h-4 accent-[#4a9eff] cursor-pointer"
              />
              <span className="text-[#888]">圆形</span>
            </label>
            <label className="flex items-center gap-2 px-3 py-2 bg-elevated rounded-lg text-sm text-[#888] cursor-default">
              <span>缩放</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-[100px] h-1 appearance-none bg-[#444] rounded cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <span className="min-w-[36px] text-right text-white font-medium">
                {zoom.toFixed(1)}x
              </span>
            </label>
          </div>
        )}

        {mode === "fill" && (
          <div className="flex items-center gap-2">
            <ColorPicker color={fillColor} onChange={setFillColor} />
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <select
            className="px-3 py-2 bg-elevated border border-[#333] rounded-lg text-white text-sm cursor-pointer"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
          >
            <option value="jpeg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WEBP</option>
          </select>

          {exportFormat !== "png" && (
            <div className="flex items-center gap-2 px-3 py-2 bg-elevated rounded-lg text-sm max-md:hidden">
              <label className="text-[#888]">质量</label>
              <input
                type="range"
                min={60}
                max={100}
                value={exportQuality}
                onChange={(e) => setExportQuality(Number(e.target.value))}
                className="w-20 h-1 appearance-none bg-[#444] rounded cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <span className="text-white">{exportQuality}%</span>
            </div>
          )}

          <button
            className={`${toolbarBtnBase} ${toolbarBtnPrimary} min-w-[100px] justify-center`}
            onClick={handleExport}
            disabled={!image || isExporting}
          >
            <span className="text-base">⬇️</span>
            {isExporting ? "导出中..." : "导出"}
          </button>
        </div>
      </header>

      <main className="flex-1 relative flex items-center justify-center p-5 bg-[#393939] overflow-hidden max-md:p-2.5">
        <section className="w-[500px] h-[300px] mx-auto bg-[#6a6c6b] rounded-2xl overflow-hidden">
          {error && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 bg-[#ff4a4a] rounded-lg text-white text-sm z-[100] animate-[slideDown_0.3s_ease]">
              {error}
              <button
                className="bg-transparent border-none text-white text-lg cursor-pointer opacity-80 hover:opacity-100"
                onClick={() => setError(null)}
              >
                ×
              </button>
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
              cropShape={cropShape}
            />
          ) : (
            <div
              className="flex flex-col items-center justify-center w-full h-full max-h-[400px] border-2 border-dashed border-[#333] rounded-2xl cursor-pointer transition-all duration-300 hover:border-[#4a9eff] hover:bg-[rgba(74,158,255,0.05)]"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={handleUploadClick}
            >
              <div className="text-6xl mb-4 opacity-60">📁</div>
              <p className="text-lg text-[#333] mb-2">
                点击或拖拽图片到此处上传
              </p>
              <p className="text-sm text-[#999]">
                支持 JPG、PNG、WEBP、GIF 格式，最大 10MB
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="flex items-center gap-6 px-5 py-2.5 bg-surface border-t border-[#333] text-[13px] text-[#888] max-md:flex-wrap max-md:gap-3">
        <span>模式: {mode === "crop" ? "裁剪" : "填充"}</span>
        <span>比例: {aspect}</span>
        {mode === "crop" && (
          <span className="ml-auto text-[#888] italic">
            拖动或缩放画框选择区域，双击重置
          </span>
        )}
        {mode === "fill" && (
          <span className="ml-auto text-[#888] italic">
            拖动图片调整位置，双击重置
          </span>
        )}
      </footer>
    </div>
  );
}

export default App;
