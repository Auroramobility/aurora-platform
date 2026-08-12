import { describe, expect, it } from "vitest";
import {
  validateUploadedFile,
  FileValidationError,
  DOCUMENT_UPLOAD_LIMITS,
  AVATAR_UPLOAD_LIMITS,
} from "./file-validation";

function fileFromBytes(bytes: number[], name = "upload", type = "application/octet-stream") {
  const buffer = new Uint8Array(bytes);
  return new File([buffer], name, { type });
}

const JPEG_HEADER = [0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const PNG_HEADER = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0, 0, 0, 0, 0];
const PDF_HEADER = [0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0, 0, 0, 0, 0, 0, 0, 0];
const WEBP_HEADER = [
  0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50, 0, 0, 0, 0,
];
const EXE_HEADER = [0x4d, 0x5a, 0x90, 0x00, 0x03, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // "MZ" PE header

describe("validateUploadedFile", () => {
  it("accepts a real JPEG regardless of what the filename/type claims", async () => {
    // Filename says .png, Content-Type says image/png — but the actual
    // bytes are a JPEG. Content sniffing should trust the bytes.
    const file = fileFromBytes(JPEG_HEADER, "totally-a.png", "image/png");
    const extension = await validateUploadedFile(file, DOCUMENT_UPLOAD_LIMITS);
    expect(extension).toBe("jpg");
  });

  it("accepts a real PNG", async () => {
    const file = fileFromBytes(PNG_HEADER, "id.png", "image/png");
    const extension = await validateUploadedFile(file, DOCUMENT_UPLOAD_LIMITS);
    expect(extension).toBe("png");
  });

  it("accepts a real PDF for document uploads", async () => {
    const file = fileFromBytes(PDF_HEADER, "license.pdf", "application/pdf");
    const extension = await validateUploadedFile(file, DOCUMENT_UPLOAD_LIMITS);
    expect(extension).toBe("pdf");
  });

  it("accepts a real WebP for avatar uploads", async () => {
    const file = fileFromBytes(WEBP_HEADER, "avatar.webp", "image/webp");
    const extension = await validateUploadedFile(file, AVATAR_UPLOAD_LIMITS);
    expect(extension).toBe("webp");
  });

  it("rejects a PDF disguised as a JPEG for avatar uploads (PDF not in the allowlist)", async () => {
    const file = fileFromBytes(PDF_HEADER, "avatar.jpg", "image/jpeg");
    await expect(
      validateUploadedFile(file, AVATAR_UPLOAD_LIMITS),
    ).rejects.toThrow(FileValidationError);
  });

  it("rejects an executable renamed to look like an image — the core attack this guards against", async () => {
    const file = fileFromBytes(EXE_HEADER, "profile-photo.jpg", "image/jpeg");
    await expect(
      validateUploadedFile(file, DOCUMENT_UPLOAD_LIMITS),
    ).rejects.toThrow(FileValidationError);
  });

  it("rejects an empty file", async () => {
    const file = new File([], "empty.png", { type: "image/png" });
    await expect(
      validateUploadedFile(file, DOCUMENT_UPLOAD_LIMITS),
    ).rejects.toThrow("No file was provided.");
  });

  it("rejects a file over the size limit even if the content is valid", async () => {
    const oversized = new Uint8Array(DOCUMENT_UPLOAD_LIMITS.maxSizeBytes + 1);
    oversized.set(PNG_HEADER);
    const file = new File([oversized], "big.png", { type: "image/png" });

    await expect(
      validateUploadedFile(file, DOCUMENT_UPLOAD_LIMITS),
    ).rejects.toThrow(/too large/i);
  });

  it("accepts a file right at the size limit", async () => {
    const atLimit = new Uint8Array(DOCUMENT_UPLOAD_LIMITS.maxSizeBytes);
    atLimit.set(PNG_HEADER);
    const file = new File([atLimit], "at-limit.png", { type: "image/png" });

    await expect(
      validateUploadedFile(file, DOCUMENT_UPLOAD_LIMITS),
    ).resolves.toBe("png");
  });
});
