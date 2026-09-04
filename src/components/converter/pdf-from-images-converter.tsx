"use client";

import { useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiDownload, FiLoader, FiRotateCcw, FiX } from "react-icons/fi";
import type { ConversionDefinition } from "@/config/conversions";
import { formats } from "@/config/formats";
import { validateImageFile } from "@/lib/security/validate-file";
import { convertImagesToPdf } from "@/lib/conversion/pdf";
import { formatBytes } from "@/lib/utils/format-bytes";
import { FileDropzone } from "@/components/converter/file-dropzone";
import { Button } from "@/components/ui/button";

type Status = "idle" | "converting" | "done" | "error";

export function PdfFromImagesConverter({ conversion }: { conversion: ConversionDefinition }) {
  const source = formats[conversion.source] as (typeof formats)["jpg" | "png"];
  const sourceFormat = conversion.source as "jpg" | "png";

  const [files, setFiles] = useState<File[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const accept = [...source.mimeTypes, ...source.extensions].join(",");

  async function handleFiles(newFiles: File[]) {
    setValidationError(null);
    setIsValidating(true);
    const validated: File[] = [];
    for (const file of newFiles) {
      const result = await validateImageFile(file, sourceFormat);
      if (!result.ok) {
        setValidationError(`"${file.name}": ${result.error}`);
        setIsValidating(false);
        return;
      }
      validated.push(file);
    }
    setIsValidating(false);
    setFiles((prev) => [...prev, ...validated]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function resetResult() {
    setStatus("idle");
    setError(null);
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }

  function handleReset() {
    resetResult();
    setFiles([]);
    setValidationError(null);
  }

  async function handleConvert() {
    if (files.length === 0) return;
    resetResult();
    setStatus("converting");
    try {
      const blob = await convertImagesToPdf(files, sourceFormat);
      setResultUrl(URL.createObjectURL(blob));
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF creation failed unexpectedly.");
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
      {status === "idle" && (
        <>
          <FileDropzone
            accept={accept}
            multiple
            label={`Drop your ${source.name} file(s) here`}
            hint={`Accepted: ${source.extensions.join(", ")} · Each page becomes one image · Max 40MB per file`}
            onFiles={handleFiles}
            disabled={isValidating}
          />

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

          {files.length > 0 && (
            <div className="mt-5 space-y-4">
              <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200">
                {files.map((file, index) => (
                  <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-800">
                        {index + 1}. {file.name}
                      </p>
                      <p className="text-xs text-zinc-500">{formatBytes(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      aria-label={`Remove ${file.name}`}
                      className="shrink-0 rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                    >
                      <FiX aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
              <Button variant="primary" onClick={handleConvert} className="w-full sm:w-auto">
                Convert {files.length} {files.length === 1 ? "file" : "files"} to PDF
              </Button>
            </div>
          )}
        </>
      )}

      {status === "converting" && (
        <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
          <FiLoader aria-hidden size={28} className="animate-spin text-indigo-600" />
          <p className="font-medium text-zinc-800">Creating your PDF…</p>
          <p className="text-sm text-zinc-500">This runs locally in your browser.</p>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4">
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <FiAlertCircle aria-hidden className="mt-0.5 shrink-0" />
            <span>{error ?? "Something went wrong while creating the PDF."}</span>
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
            <p className="font-medium text-zinc-800">
              Your PDF is ready ({files.length} {files.length === 1 ? "page" : "pages"})
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="primary" as="a" href={resultUrl} download="converted.pdf">
              <FiDownload aria-hidden /> Download PDF
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <FiRotateCcw aria-hidden /> Convert more files
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
