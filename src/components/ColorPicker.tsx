import { useState, useCallback } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { PRESET_COLORS } from "../types";
import "./ColorPicker.css";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

export function ColorPicker({
  color,
  onChange,
  disabled = false,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetClick = useCallback(
    (presetColor: string) => {
      onChange(presetColor);
    },
    [onChange]
  );

  const handleColorChange = useCallback(
    (newColor: string) => {
      onChange(newColor);
    },
    [onChange]
  );

  const displayColor = color === "transparent" ? "transparent" : color;
  const isTransparent = color === "transparent";

  return (
    <div className={`color-picker ${disabled ? "disabled" : ""}`}>
      <button
        type="button"
        className={`color-picker-trigger ${
          isTransparent ? "transparent-preview" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{ backgroundColor: isTransparent ? "transparent" : color }}
        title="选择填充颜色"
      >
        <span className="color-picker-label">填充色</span>
      </button>

      {isOpen && !disabled && (
        <>
          <div
            className="color-picker-backdrop"
            onClick={() => setIsOpen(false)}
          />
          <div className="color-picker-popover">
            <div className="color-picker-header">
              <span>选择填充颜色</span>
              <button
                type="button"
                className="color-picker-close"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="color-picker-presets">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  className={`color-preset ${
                    preset.value === "transparent" ? "transparent-preview" : ""
                  } ${color === preset.value ? "active" : ""}`}
                  style={{
                    backgroundColor:
                      preset.value === "transparent"
                        ? "transparent"
                        : preset.value,
                  }}
                  onClick={() => handlePresetClick(preset.value)}
                  title={preset.label}
                />
              ))}
            </div>

            <div className="color-picker-custom">
              <HexColorPicker
                color={isTransparent ? "#ffffff" : color}
                onChange={handleColorChange}
              />
              <div className="color-picker-input-wrapper">
                <span className="color-picker-hash">#</span>
                <HexColorInput
                  color={isTransparent ? "ffffff" : color}
                  onChange={handleColorChange}
                  className="color-picker-input"
                  placeholder="FFFFFF"
                />
              </div>
            </div>

            <div className="color-picker-preview">
              <span>预览:</span>
              <div
                className={`color-preview-box ${
                  isTransparent ? "transparent-preview" : ""
                }`}
                style={{ backgroundColor: displayColor }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
