"use client";

import { useCallback, useId, useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { cn } from "@/lib/utils/cn";

interface FileDropzoneProps {
  accept: string;
  label: string;
  hint: string;
  disabled?: boolean;
  multiple?: boolean;
  onFile?: (file: File) => void;
  onFiles?: (files: File[]) => void;
}

export function FileDropzone({ accept, label, hint, onFile, onFiles, disabled, multiple }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      if (multiple) {
        onFiles?.(Array.from(fileList));
      } else {
        onFile?.(fileList[0]);
      }
    },
    [multiple, onFile, onFiles]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-colors",
        isDragging ? "border-indigo-500 bg-indigo-50" : "border-zinc-300 bg-zinc-50",
        disabled && "pointer-events-none opacity-60"
      )}
    >
      <FiUploadCloud aria-hidden size={36} className="text-indigo-500" />
      <p className="mt-3 font-medium text-zinc-800">{label}</p>
      <p className="mt-1 text-sm text-zinc-500">{hint}</p>

      <label htmlFor={inputId} className="mt-4 inline-flex cursor-pointer items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">
        {multiple ? "Choose Files" : "Choose File"}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      <p className="mt-4 text-xs font-medium text-emerald-700">Files stay on your device — nothing is uploaded.</p>
    </div>
  );
}
