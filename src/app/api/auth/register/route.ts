import { NextResponse } from "next/server";
import { db, User } from "@/lib/db";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Nama, email, dan password wajib diisi" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password minimal terdiri dari 6 karakter" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    const users = await db.list<User>("Users");
    const existing = users.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Alamat email ini sudah terdaftar. Silakan masuk." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const newUser = await db.create<User>("Users", {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      role_id: "role-user", // Role default selalu 'user'
      status: "active",
    });

    if (!newUser) {
      return NextResponse.json(
        { success: false, error: "Gagal membuat akun" },
        { status: 500 }
      );
    }

    // Buat session
    const token = await createSessionToken({
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: "user",
    });

    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: "user",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

