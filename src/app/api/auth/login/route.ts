import { NextResponse } from "next/server";
import { db, User, Role } from "@/lib/db";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const users = await db.list<User>("Users");
    const user = users.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah" },
        { status: 401 }
      );
    }

    if (user.status === "inactive") {
      return NextResponse.json(
        {
          success: false,
          error: "Akun Anda dinonaktifkan oleh administrator. Silakan hubungi admin.",
        },
        { status: 403 }
      );
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Ambil detail role
    const roles = await db.list<Role>("Roles");
    const role = roles.find((r) => r.id === user.role_id);
    const roleName = role ? role.name : "user";

    // Buat session JWT
    const token = await createSessionToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: roleName,
    });

    setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}

