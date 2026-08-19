// ToolHelix — Typed API client for FastAPI backend with robust client-side fallbacks

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

// Generic fetcher with error handling
async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = API_BASE ? `${API_BASE}${path}` : path;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "API error");
  }

  return res.json() as Promise<T>;
}

// ── Converters ───────────────────────────────────────────────────────────────

export interface ImageConvertResponse {
  success: boolean;
  filename: string;
  format: string;
  data: string;      // base64
  mime_type: string;
}

export async function convertImageFormat(
  file: File,
  targetFormat: string
): Promise<ImageConvertResponse> {
  try {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("target_format", targetFormat);
    return await apiFetch<ImageConvertResponse>("/api/converters/image-format", {
      method: "POST",
      body: fd,
    });
  } catch {
    // Client-side HTML5 Canvas fallback
    return convertImageFormatClient(file, targetFormat);
  }
}

async function convertImageFormatClient(file: File, targetFormat: string): Promise<ImageConvertResponse> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0);

      const fmtLower = targetFormat.toLowerCase();
      const mimeType = fmtLower === "jpeg" || fmtLower === "jpg" ? "image/jpeg" : fmtLower === "webp" ? "image/webp" : "image/png";
      const dataUrl = canvas.toDataURL(mimeType, 0.92);
      const base64Data = dataUrl.split(",")[1];
      const stem = file.name.includes(".") ? file.name.substring(0, file.name.lastIndexOf(".")) : file.name;
      const ext = fmtLower === "jpeg" ? "jpg" : fmtLower;

      resolve({
        success: true,
        filename: `${stem}.${ext}`,
        format: targetFormat.toUpperCase(),
        data: base64Data,
        mime_type: mimeType,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for client conversion"));
    };
    img.src = url;
  });
}

// ── Generators ───────────────────────────────────────────────────────────────

export interface QRCodeResponse {
  success: boolean;
  data: string;      // base64 PNG
  mime_type: string;
  filename: string;
}

export interface QRCodeRequest {
  content: string;
  size?: number;
  border?: number;
  fg_color?: string;
  bg_color?: string;
}

export async function generateQRCode(req: QRCodeRequest): Promise<QRCodeResponse> {
  try {
    return await apiFetch<QRCodeResponse>("/api/generators/qr-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
  } catch {
    // QuickChart API fallback for QR generation
    const fg = (req.fg_color || "#000000").replace("#", "");
    const bg = (req.bg_color || "#ffffff").replace("#", "");
    const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(req.content)}&size=300&dark=${fg}&light=${bg}&margin=${req.border || 4}`;
    const resp = await fetch(qrUrl);
    const blob = await resp.blob();
    const buffer = await blob.arrayBuffer();
    const base64 = btoa(
      new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
    return {
      success: true,
      data: base64,
      mime_type: "image/png",
      filename: "qrcode.png",
    };
  }
}

// ── Developer Tools ──────────────────────────────────────────────────────────

export interface JSONFormatResponse {
  success: boolean;
  formatted?: string;
  valid: boolean;
  type?: string;
  size?: number;
  error?: string;
  line?: number;
  column?: number;
}

export async function formatJSON(
  content: string,
  indent = 2,
  sortKeys = false
): Promise<JSONFormatResponse> {
  try {
    return await apiFetch<JSONFormatResponse>("/api/dev/json-format", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, indent, sort_keys: sortKeys }),
    });
  } catch {
    // Client-side JSON formatting fallback
    if (!content.trim()) {
      return { success: false, valid: false, error: "Input cannot be empty" };
    }
    try {
      let parsed = JSON.parse(content);
      if (sortKeys && typeof parsed === "object" && parsed !== null) {
        parsed = sortKeysDeep(parsed);
      }
      const formatted = JSON.stringify(parsed, null, Math.max(0, Math.min(indent, 8)));
      return {
        success: true,
        formatted,
        valid: true,
        type: Array.isArray(parsed) ? "Array" : typeof parsed,
        size: content.length,
      };
    } catch (e: any) {
      return {
        success: false,
        valid: false,
        error: e.message || "Invalid JSON syntax",
      };
    }
  }
}

function sortKeysDeep(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sortKeysDeep);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((acc: any, key: string) => {
        acc[key] = sortKeysDeep(obj[key]);
        return acc;
      }, {});
  }
  return obj;
}

// ── Text Tools ───────────────────────────────────────────────────────────────

export interface TextDiffResponse {
  success: boolean;
  diff: string;
  added: number;
  removed: number;
  identical: boolean;
}

export async function compareText(
  original: string,
  modified: string,
  contextLines = 3
): Promise<TextDiffResponse> {
  try {
    return await apiFetch<TextDiffResponse>("/api/text/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ original, modified, context_lines: contextLines }),
    });
  } catch {
    // Client-side simple diff fallback
    const origLines = original.split("\n");
    const modLines = modified.split("\n");
    let added = 0;
    let removed = 0;
    const diffLines: string[] = ["--- Original\n", "+++ Modified\n"];

    const maxLen = Math.max(origLines.length, modLines.length);
    for (let i = 0; i < maxLen; i++) {
      const o = origLines[i];
      const m = modLines[i];
      if (o === m) {
        diffLines.push(` ${o}\n`);
      } else {
        if (o !== undefined) {
          diffLines.push(`-${o}\n`);
          removed++;
        }
        if (m !== undefined) {
          diffLines.push(`+${m}\n`);
          added++;
        }
      }
    }
    const identical = original === modified;
    return {
      success: true,
      diff: identical ? "" : diffLines.join(""),
      added,
      removed,
      identical,
    };
  }
}

// ── Image Tools ──────────────────────────────────────────────────────────────

export interface ImageCompressResponse {
  success: boolean;
  data: string;
  mime_type: string;
  filename: string;
  original_size: number;
  compressed_size: number;
  savings_percent: number;
}

export async function compressImage(
  file: File,
  quality: number,
  format: string
): Promise<ImageCompressResponse> {
  try {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("quality", String(quality));
    fd.append("format", format);
    return await apiFetch<ImageCompressResponse>("/api/image/compress", {
      method: "POST",
      body: fd,
    });
  } catch {
    return compressImageClient(file, quality, format);
  }
}

async function compressImageClient(file: File, quality: number, format: string): Promise<ImageCompressResponse> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0);

      const fmtLower = format.toLowerCase();
      const mimeType = fmtLower === "jpeg" || fmtLower === "jpg" ? "image/jpeg" : fmtLower === "webp" ? "image/webp" : "image/png";
      const q = Math.max(0.1, Math.min(quality / 100, 0.95));
      const dataUrl = canvas.toDataURL(mimeType, q);
      const base64Data = dataUrl.split(",")[1];
      const binaryLen = atob(base64Data).length;
      const originalSize = file.size;
      const savings = Math.max(0, Math.round((1 - binaryLen / originalSize) * 1000) / 10);
      const stem = file.name.includes(".") ? file.name.substring(0, file.name.lastIndexOf(".")) : file.name;
      const ext = fmtLower === "jpeg" ? "jpg" : fmtLower;

      resolve({
        success: true,
        data: base64Data,
        mime_type: mimeType,
        filename: `${stem}_compressed.${ext}`,
        original_size: originalSize,
        compressed_size: binaryLen,
        savings_percent: savings,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for client compression"));
    };
    img.src = url;
  });
}

export interface ImageResizeResponse {
  success: boolean;
  data: string;
  mime_type: string;
  filename: string;
  original_dimensions: { width: number; height: number };
  new_dimensions: { width: number; height: number };
}

export async function resizeImage(
  file: File,
  width: number,
  height: number,
  maintainAspect: boolean,
  format: string
): Promise<ImageResizeResponse> {
  try {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("width", String(width));
    fd.append("height", String(height));
    fd.append("maintain_aspect", String(maintainAspect));
    fd.append("format", format);
    return await apiFetch<ImageResizeResponse>("/api/image/resize", {
      method: "POST",
      body: fd,
    });
  } catch {
    return resizeImageClient(file, width, height, maintainAspect, format);
  }
}

async function resizeImageClient(
  file: File,
  width: number,
  height: number,
  maintainAspect: boolean,
  format: string
): Promise<ImageResizeResponse> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;

      let newW = width;
      let newH = height;
      if (maintainAspect || height <= 0) {
        const ratio = width / origW;
        newH = Math.round(origH * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = newW;
      canvas.height = newH;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, newW, newH);

      const fmtLower = format.toLowerCase();
      const mimeType = fmtLower === "jpeg" || fmtLower === "jpg" ? "image/jpeg" : fmtLower === "webp" ? "image/webp" : "image/png";
      const dataUrl = canvas.toDataURL(mimeType, 0.9);
      const base64Data = dataUrl.split(",")[1];
      const stem = file.name.includes(".") ? file.name.substring(0, file.name.lastIndexOf(".")) : file.name;
      const ext = fmtLower === "jpeg" ? "jpg" : fmtLower;

      resolve({
        success: true,
        data: base64Data,
        mime_type: mimeType,
        filename: `${stem}_${newW}x${newH}.${ext}`,
        original_dimensions: { width: origW, height: origH },
        new_dimensions: { width: newW, height: newH },
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for client resize"));
    };
    img.src = url;
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Download a base64 file from an API response */
export function downloadBase64(data: string, filename: string, mimeType: string) {
  const link = document.createElement("a");
  link.href = `data:${mimeType};base64,${data}`;
  link.download = filename;
  link.click();
}

/** Copy text to clipboard with fallback */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  }
}

/** Format file size in human-readable form */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
