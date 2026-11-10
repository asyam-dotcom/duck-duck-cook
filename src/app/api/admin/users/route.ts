import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, User, Role } from "@/lib/db";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  const [users, roles] = await Promise.all([
    db.list<User>("Users"),
    db.list<Role>("Roles"),
  ]);

  const roleMap = new Map(roles.map((r) => [r.id, r.name]));

  const safeUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role_id: u.role_id,
    role_name: roleMap.get(u.role_id) || "user",
    status: u.status,
    created_at: u.created_at,
  }));

  return NextResponse.json({ success: true, data: safeUsers });
}

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  const { id, role_id, status } = await req.json();

  if (!id) {
    return NextResponse.json({ success: false, error: "ID user wajib disertakan" }, { status: 400 });
  }

  const users = await db.list<User>("Users");
  const targetUser = users.find((u) => u.id === id);
  if (!targetUser) {
    return NextResponse.json({ success: false, error: "User tidak ditemukan" }, { status: 404 });
  }

  // Proteksi: Admin tidak boleh menonaktifkan dirinya sendiri
  if (targetUser.id === session.userId && status === "inactive") {
    return NextResponse.json(
      { success: false, error: "Anda tidak dapat menonaktifkan akun Anda sendiri" },
      { status: 400 }
    );
  }

  const updateData: Partial<User> = {};
  if (role_id) updateData.role_id = role_id;
  if (status) updateData.status = status;

  const updated = await db.update<User>("Users", id, updateData);

  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "ID user wajib disertakan" }, { status: 400 });
  }

  // Proteksi: Admin tidak dapat menghapus dirinya sendiri
  if (id === session.userId) {
    return NextResponse.json(
      { success: false, error: "Anda tidak dapat menghapus akun Anda sendiri" },
      { status: 400 }
    );
  }

  // Proteksi: Jangan hapus jika ini adalah admin terakhir
  const users = await db.list<User>("Users");
  const adminUsers = users.filter((u) => u.role_id === "role-admin");
  const targetIsAdmin = users.find((u) => u.id === id)?.role_id === "role-admin";

  if (targetIsAdmin && adminUsers.length <= 1) {
    return NextResponse.json(
      { success: false, error: "Tidak dapat menghapus admin terakhir di sistem" },
      { status: 400 }
    );
  }

  const success = await db.delete("Users", id);
  return NextResponse.json({ success });
}

