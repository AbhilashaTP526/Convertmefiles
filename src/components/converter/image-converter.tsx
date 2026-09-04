"use client";

import { useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiDownload, FiLoader, FiRotateCcw } from "react-icons/fi";
import type { ConversionDefinition } from "@/config/conversions";
import { formats } from "@/config/formats";
import { validateImageFile, sanitizeFileBaseName } from "@/lib/security/validate-file";
import type { ImageOutputFormat } from "@/lib/conversion/image";
import { useImageConverter } from "@/hooks/use-image-converter";
import { formatBytes } from "@/lib/utils/format-bytes";
import { FileDropzone } from "@/components/converter/file-dropzone";
import { Button } from "@/components/ui/button";

const outputFormatMap: Record<string, ImageOutputFormat> = {
  jpg: "jpeg",
  png: "png",
  webp: "webp",
};

export function ImageConverter({ conversion }: { conversion: ConversionDefinition }) {
  const source = formats[conversion.source];
  const target = formats[conversion.target];
  const outputFormat = outputFormatMap[conversion.target];
  const isLossyOutput = outputFormat === "jpeg" || outputFormat === "webp";

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [quality, setQuality] = useState(0.92);

  const { status, error, resultUrl, dimensions, convert, cancel, reset } = useImageConverter(outputFormat);

  const accept = [...source.mimeTypes, ...source.extensions].join(",");

  async function handleFile(file: File) {
    reset();
    setSelectedFile(null);
    setValidationError(null);
    setIsValidating(true);
    const result = await validateImageFile(file, conversion.source);
    setIsValidating(false);
    if (!result.ok) {
      setValidationError(result.error ?? "This file couldn't be validated.");
      return;
    }
    setSelectedFile(file);
  }

  function handleConvert() {
    if (selectedFile) convert(selectedFile, isLossyOutput ? quality : undefined);
  }

  function handleReset() {
    cancel();
    setSelectedFile(null);
    setValidationError(null);
  }

  const downloadName = selectedFile
    ? `${sanitizeFileBaseName(selectedFile.name)}.${conversion.target}`
    : `converted.${conversion.target}`;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
      {!selectedFile && status === "idle" && (
        <FileDropzone
          accept={accept}
          label={`Drop your ${source.name} file here`}
          hint={`Accepted: ${source.extensions.join(", ")} · Max 40MB`}
          onFile={handleFile}
          disabled={isValidating}
        />
      )}

      {isValidating && (
        <p role="status" className="mt-4 flex items-center gap-2 text-sm text-zinc-500">
          <FiLoader aria-hidden className="animate-spin" /> Checking file…
        </p>
      )}

      {validationError && (
        <div role="alert" className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <FiAlertCircle aria-hidden className="mt-0.5 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {selectedFile && status === "idle" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium text-zinc-800">{selectedFile.name}</p>
              <p className="text-sm text-zinc-500">{formatBytes(selectedFile.size)}</p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="shrink-0 text-sm font-medium text-zinc-500 hover:text-zinc-800"
            >
              Remove
            </button>
          </div>

          {isLossyOutput && (
            <div>
              <label htmlFor="quality" className="flex items-center justify-between text-sm font-medium text-zinc-700">
                <span>Output quality</span>
                <span>{Math.round(quality * 100)}%</span>
              </label>
              <input
                id="quality"
                type="range"
                min={0.5}
                max={1}
                step={0.01}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="mt-2 w-full accent-indigo-600"
              />
            </div>
          )}

          <Button variant="primary" onClick={handleConvert} className="w-full sm:w-auto">
            Convert to {target.name}
          </Button>
        </div>
      )}

      {status === "converting" && (
        <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
          <FiLoader aria-hidden size={28} className="animate-spin text-indigo-600" />
          <p className="font-medium text-zinc-800">Converting your file…</p>
          <p className="text-sm text-zinc-500">This runs locally in your browser and usually takes a second.</p>
          <button type="button" onClick={handleReset} className="text-sm font-medium text-zinc-500 hover:text-zinc-800">
            Cancel
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4">
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <FiAlertCircle aria-hidden className="mt-0.5 shrink-0" />
            <span>{error ?? "Something went wrong during conversion."}</span>
          </div>
          <Button variant="outline" onClick={handleReset}>
            <FiRotateCcw aria-hidden /> Try again
          </Button>
        </div>
      )}

      {status === "done" && resultUrl && (
        <div className="space-y-4 text-center">
          <div className="flex flex-col items-center gap-2 py-2">
            <FiCheckCircle aria-hidden size={32} className="text-emerald-600" />
            <p className="font-medium text-zinc-800">Your {target.name} file is ready</p>
            {dimensions && (
              <p className="text-sm text-zinc-500">
                {dimensions.width} × {dimensions.height}px
              </p>
            )}
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="primary" as="a" href={resultUrl} download={downloadName}>
              <FiDownload aria-hidden /> Download {target.name}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <FiRotateCcw aria-hidden /> Convert another file
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
