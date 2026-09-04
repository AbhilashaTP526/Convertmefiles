"use client";

import { useEffect, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiDownload, FiLoader, FiRotateCcw } from "react-icons/fi";
import type { ConversionDefinition } from "@/config/conversions";
import { formats, type ImageFormatId } from "@/config/formats";
import { validateImageFile, sanitizeFileBaseName } from "@/lib/security/validate-file";
import type { ImageOutputFormat } from "@/lib/conversion/image";
import { useImageConverter } from "@/hooks/use-image-converter";
import { formatBytes } from "@/lib/utils/format-bytes";
import { trackEvent } from "@/lib/analytics/track";
import { FileDropzone } from "@/components/converter/file-dropzone";
import { Button } from "@/components/ui/button";

const outputFormatMap: Record<string, ImageOutputFormat> = {
  jpg: "jpeg",
  png: "png",
  webp: "webp",
};

export function CompressImageConverter({ conversion }: { conversion: ConversionDefinition }) {
  // This component only ever renders for compress-engine conversions (see [slug]/page.tsx), where source === target.
  const sourceFormat = conversion.source as ImageFormatId;
  const source = formats[conversion.source];
  const outputFormat = outputFormatMap[conversion.source];
  const isLossless = sourceFormat === "png";

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  // 1-100: for jpg/webp this is quality; for png (lossless) it drives dimension scale instead.
  const [level, setLevel] = useState(75);

  const { status, error, resultBlob, resultUrl, dimensions, convert, cancel, reset } = useImageConverter(outputFormat);

  const accept = [...source.mimeTypes, ...source.extensions].join(",");

  async function handleFile(file: File) {
    reset();
    setSelectedFile(null);
    setValidationError(null);
    setIsValidating(true);
    const result = await validateImageFile(file, sourceFormat);
    setIsValidating(false);
    if (!result.ok) {
      setValidationError(result.error ?? "This file couldn't be validated.");
      return;
    }
    setSelectedFile(file);
  }

  useEffect(() => {
    if (status === "done") trackEvent({ event: "conversion_completed", slug: conversion.slug });
    if (status === "error") trackEvent({ event: "conversion_failed", slug: conversion.slug });
  }, [status, conversion.slug]);

  function handleCompress() {
    if (!selectedFile) return;
    trackEvent({ event: "conversion_started", slug: conversion.slug });
    if (isLossless) {
      // No quality lever for PNG — shrink dimensions instead, from 100% down to 25% of original.
      const scale = 0.25 + 0.75 * (level / 100);
      convert(selectedFile, undefined, scale < 1 ? scale : undefined);
    } else {
      convert(selectedFile, level / 100);
    }
  }

  function handleReset() {
    cancel();
    setSelectedFile(null);
    setValidationError(null);
  }

  const downloadName = selectedFile
    ? `${sanitizeFileBaseName(selectedFile.name)}-compressed.${conversion.source}`
    : `compressed.${conversion.source}`;

  const reduction =
    selectedFile && resultBlob && selectedFile.size > 0
      ? Math.round((1 - resultBlob.size / selectedFile.size) * 100)
      : null;

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

          <div>
            <label htmlFor="level" className="flex items-center justify-between text-sm font-medium text-zinc-700">
              <span>{isLossless ? "Image size" : "Quality"}</span>
              <span>
                {isLossless ? Math.round(25 + 75 * (level / 100)) : level}%
              </span>
            </label>
            <input
              id="level"
              type="range"
              min={10}
              max={100}
              step={1}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="mt-2 w-full accent-indigo-600"
            />
            <p className="mt-1.5 text-xs text-zinc-500">
              {isLossless
                ? "PNG can't be quality-compressed — lower this to shrink the image's dimensions instead."
                : "Lower quality produces a smaller file."}
            </p>
          </div>

          <Button variant="primary" onClick={handleCompress} className="w-full sm:w-auto">
            Compress
          </Button>
        </div>
      )}

      {status === "converting" && (
        <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
          <FiLoader aria-hidden size={28} className="animate-spin text-indigo-600" />
          <p className="font-medium text-zinc-800">Compressing your file…</p>
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
            <span>{error ?? "Something went wrong during compression."}</span>
          </div>
          <Button variant="outline" onClick={handleReset}>
            <FiRotateCcw aria-hidden /> Try again
          </Button>
        </div>
      )}

      {status === "done" && resultUrl && resultBlob && selectedFile && (
        <div className="space-y-4 text-center">
          <div className="flex flex-col items-center gap-2 py-2">
            <FiCheckCircle aria-hidden size={32} className="text-emerald-600" />
            <p className="font-medium text-zinc-800">Your compressed {source.name} is ready</p>
            <p className="text-sm text-zinc-500">
              {formatBytes(selectedFile.size)} → {formatBytes(resultBlob.size)}
              {dimensions && ` · ${dimensions.width} × ${dimensions.height}px`}
            </p>
            {reduction !== null && reduction > 0 ? (
              <p className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                {reduction}% smaller
              </p>
            ) : (
              <p className="text-sm text-zinc-500">This file was already well-optimized — try a lower level for more savings.</p>
            )}
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="primary" as="a" href={resultUrl} download={downloadName}>
              <FiDownload aria-hidden /> Download {source.name}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <FiRotateCcw aria-hidden /> Compress another file
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
