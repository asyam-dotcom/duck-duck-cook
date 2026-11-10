import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export interface SaveFileResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

/**
 * Menyimpan file media secara lokal ke folder public/uploads/
 * Catatan: Penyimpanan ini cocok untuk development lokal. Untuk deployment Vercel
 * di production, fungsi ini dapat diganti dengan penyedia cloud (Vercel Blob / Cloudinary).
 */
export async function saveFile(file: File): Promise<SaveFileResult> {
  try {
    if (!file) {
      return { success: false, error: "File tidak ditemukan" };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Format file tidak didukung. Harap unggah format JPG, PNG, atau WebP.",
      };
    }

    if (file.size > MAX_SIZE) {
      return {
        success: false,
        error: "Ukuran file terlalu besar. Maksimal ukuran gambar adalah 5 MB.",
      };
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    // Generate nama file unik & aman
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
    const destinationPath = path.join(UPLOAD_DIR, uniqueName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(destinationPath, buffer);

    return {
      success: true,
      filePath: `/uploads/${uniqueName}`,
    };
  } catch (error) {
    console.error("Gagal menyimpan file media:", error);
    return { success: false, error: "Gagal menyimpan file ke disk lokal" };
  }
}

/**
 * Menghapus file media dari disk lokal
 */
export async function deleteFile(relativeFilePath: string): Promise<boolean> {
  try {
    if (!relativeFilePath.startsWith("/uploads/")) {
      return false; // Jangan hapus file di luar folder uploads (misal /images/)
    }
    const fileName = path.basename(relativeFilePath);
    const fullPath = path.join(UPLOAD_DIR, fileName);
    await fs.unlink(fullPath);
    return true;
  } catch {
    return false;
  }
}

