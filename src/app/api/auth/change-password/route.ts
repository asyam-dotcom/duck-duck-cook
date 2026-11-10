import { NextResponse } from "next/server";
import { getSession, verifyPassword, hashPassword } from "@/lib/auth";
import { db, User } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Password lama dan password baru wajib diisi" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password baru minimal 6 karakter" },
        { status: 400 }
      );
    }

    const user = await db.findById<User>("Users", session.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User tidak ditemukan" }, { status: 404 });
    }

    const isOldMatch = await verifyPassword(oldPassword, user.password_hash);
    if (!isOldMatch) {
      return NextResponse.json(
        { success: false, error: "Password lama salah" },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);
    await db.update<User>("Users", user.id, {
      password_hash: newHash,
    });

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui dengan aman!",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengganti password" },
      { status: 500 }
    );
  }
}

