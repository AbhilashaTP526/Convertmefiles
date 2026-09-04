"use client";

import { useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiDownload, FiLoader, FiRotateCcw } from "react-icons/fi";
import type { ConversionDefinition } from "@/config/conversions";
import { formats, type VideoFormatId } from "@/config/formats";
import { validateVideoFile, sanitizeFileBaseName } from "@/lib/security/validate-file";
import { loadFFmpegEngine } from "@/lib/conversion/ffmpeg-engine";
import { convertVideo, type VideoOutputFormat } from "@/lib/conversion/video";
import { formatBytes } from "@/lib/utils/format-bytes";
import { trackEvent } from "@/lib/analytics/track";
import { FileDropzone } from "@/components/converter/file-dropzone";
import { Button } from "@/components/ui/button";

type Status = "idle" | "loading-engine" | "converting" | "done" | "error";

export function VideoConverter({ conversion }: { conversion: ConversionDefinition }) {
  const source = formats[conversion.source];
  const target = formats[conversion.target];
  const sourceFormat = conversion.source as VideoFormatId;
  const outputFormat = conversion.target as VideoOutputFormat;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const accept = [...source.mimeTypes, ...source.extensions].join(",");

  async function handleFile(file: File) {
    setValidationError(null);
    setIsValidating(true);
    const result = await validateVideoFile(file, sourceFormat);
    setIsValidating(false);
    if (!result.ok) {
      setValidationError(result.error ?? "This file couldn't be validated.");
      return;
    }
    setSelectedFile(file);
  }

  function handleReset() {
    setStatus("idle");
    setError(null);
    setProgress(0);
    setSelectedFile(null);
    setValidationError(null);
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }

  async function handleConvert() {
    if (!selectedFile) return;
    setError(null);
    setProgress(0);
    trackEvent({ event: "conversion_started", slug: conversion.slug });

    try {
      setStatus("loading-engine");
      await loadFFmpegEngine((ratio) => setProgress(ratio));

      setStatus("converting");
      setProgress(0);
      const blob = await convertVideo(selectedFile, outputFormat, {
        onProgress: (ratio) => setProgress(ratio),
      });

      setResultUrl(URL.createObjectURL(blob));
      setStatus("done");
      trackEvent({ event: "conversion_completed", slug: conversion.slug });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed unexpectedly.");
      setStatus("error");
      trackEvent({ event: "conversion_failed", slug: conversion.slug });
    }
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
          hint={`Accepted: ${source.extensions.join(", ")} · Max 100MB`}
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

          <Button variant="primary" onClick={handleConvert} className="w-full sm:w-auto">
            Convert to {target.name}
          </Button>
        </div>
      )}

      {status === "loading-engine" && (
        <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
          <FiLoader aria-hidden size={28} className="animate-spin text-indigo-600" />
          <p className="font-medium text-zinc-800">Loading the video engine…</p>
          <p className="text-sm text-zinc-500">
            This downloads once (about 30MB) and is cached by your browser for next time.
          </p>
          <ProgressBar ratio={progress} />
        </div>
      )}

      {status === "converting" && (
        <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
          <FiLoader aria-hidden size={28} className="animate-spin text-indigo-600" />
          <p className="font-medium text-zinc-800">Converting your video…</p>
          <p className="text-sm text-zinc-500">
            Video encoding is CPU-intensive — larger or longer clips take a while. Keep this tab open.
          </p>
          <ProgressBar ratio={progress} />
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
          </div>

          {conversion.target === "gif" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resultUrl} alt="Converted GIF preview" className="mx-auto max-h-72 rounded-lg border border-zinc-200" />
          ) : (
            <video src={resultUrl} controls className="mx-auto max-h-72 w-full rounded-lg border border-zinc-200 bg-black" />
          )}

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

function ProgressBar({ ratio }: { ratio: number }) {
  const percent = Math.round(Math.min(1, Math.max(0, ratio)) * 100);
  return (
    <div className="w-full max-w-xs">
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-indigo-600 transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-zinc-500">{percent}%</p>
    </div>
  );
}
