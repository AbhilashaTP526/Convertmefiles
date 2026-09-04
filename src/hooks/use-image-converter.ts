"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ImageOutputFormat } from "@/lib/conversion/image";
import type { ImageConvertRequest, ImageConvertResponse } from "@/workers/image-convert.worker";

export type ConverterStatus = "idle" | "converting" | "done" | "error";

export interface UseImageConverterResult {
  status: ConverterStatus;
  error: string | null;
  resultBlob: Blob | null;
  resultUrl: string | null;
  dimensions: { width: number; height: number } | null;
  convert: (file: File, quality?: number) => void;
  cancel: () => void;
  reset: () => void;
}

export function useImageConverter(outputFormat: ImageOutputFormat): UseImageConverterResult {
  const [status, setStatus] = useState<ConverterStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  useEffect(() => {
    resultUrlRef.current = resultUrl;
  }, [resultUrl]);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setResultBlob(null);
    setDimensions(null);
    setResultUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  const cancel = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    reset();
  }, [reset]);

  const convert = useCallback(
    (file: File, quality?: number) => {
      workerRef.current?.terminate();
      reset();
      setStatus("converting");

      const worker = new Worker(new URL("../workers/image-convert.worker.ts", import.meta.url), {
        type: "module",
      });
      workerRef.current = worker;

      worker.onmessage = (event: MessageEvent<ImageConvertResponse>) => {
        const data = event.data;
        if (data.success) {
          const url = URL.createObjectURL(data.blob);
          setResultBlob(data.blob);
          setResultUrl(url);
          setDimensions({ width: data.width, height: data.height });
          setStatus("done");
        } else {
          setError(data.error);
          setStatus("error");
        }
        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
      };

      worker.onerror = () => {
        setError("Conversion failed unexpectedly. Try a different file or reload the page.");
        setStatus("error");
        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
      };

      const request: ImageConvertRequest = { file, outputFormat, quality };
      worker.postMessage(request);
    },
    [outputFormat, reset]
  );

  return { status, error, resultBlob, resultUrl, dimensions, convert, cancel, reset };
}
