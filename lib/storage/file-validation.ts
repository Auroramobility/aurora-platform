/**
 * Server-side upload validation.
 *
 * Deliberately does NOT trust `file.name`'s extension or the browser's
 * reported `file.type` — both are attacker-controlled (a renamed .exe
 * can claim to be image/png). Instead this sniffs the actual leading
 * bytes of the file against known format signatures, and separately
 * enforces a size ceiling. This is the "server-side file-content
 * validation for identity documents" item from docs/SECURITY.md.
 */

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileValidationError";
  }
}

type SignatureCheck = {
  mimeType: string;
  extension: string;
  matches: (bytes: Uint8Array) => boolean;
};

const SIGNATURES: SignatureCheck[] = [
  {
    mimeType: "image/jpeg",
    extension: "jpg",
    matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    mimeType: "image/png",
    extension: "png",
    matches: (b) =>
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47 &&
      b[4] === 0x0d &&
      b[5] === 0x0a &&
      b[6] === 0x1a &&
      b[7] === 0x0a,
  },
  {
    mimeType: "image/webp",
    extension: "webp",
    matches: (b) =>
      b[0] === 0x52 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x46 &&
      b[8] === 0x57 &&
      b[9] === 0x45 &&
      b[10] === 0x42 &&
      b[11] === 0x50,
  },
  {
    mimeType: "application/pdf",
    extension: "pdf",
    matches: (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46,
  },
];

type ValidationOptions = {
  allowedMimeTypes: readonly string[];
  maxSizeBytes: number;
};

/**
 * Validates an uploaded file and returns the safe file extension to
 * store it under, derived from the file's actual content — never from
 * the client-supplied filename.
 *
 * @throws {FileValidationError} with a message safe to show the user.
 */
export async function validateUploadedFile(
  file: File,
  { allowedMimeTypes, maxSizeBytes }: ValidationOptions,
): Promise<string> {
  if (!file || file.size === 0) {
    throw new FileValidationError("No file was provided.");
  }

  if (file.size > maxSizeBytes) {
    const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(1);
    throw new FileValidationError(`File is too large. Maximum size is ${maxMb}MB.`);
  }

  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  const match = SIGNATURES.find(
    (signature) =>
      allowedMimeTypes.includes(signature.mimeType) && signature.matches(head),
  );

  if (!match) {
    throw new FileValidationError(
      `That file doesn't look like a supported format. Allowed: ${allowedMimeTypes
        .map((type) => type.replace("image/", "").replace("application/", "").toUpperCase())
        .join(", ")}.`,
    );
  }

  return match.extension;
}

export const DOCUMENT_UPLOAD_LIMITS: ValidationOptions = {
  allowedMimeTypes: ["image/jpeg", "image/png", "application/pdf"],
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
};

export const AVATAR_UPLOAD_LIMITS: ValidationOptions = {
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
};
