import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, Role } from "@/lib/db";

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

  const roles = await db.list<Role>("Roles");
  return NextResponse.json({ success: true, data: roles });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  const { id, name, description, permissions } = await req.json();

  if (!name) {
    return NextResponse.json(
      { success: false, error: "Nama role wajib diisi" },
      { status: 400 }
    );
  }

  const cleanName = name.toLowerCase().trim().replace(/\s+/g, "_");

  // Jika update role yang sudah ada
  if (id) {
    const role = await db.findById<Role>("Roles", id);
    if (!role) {
      return NextResponse.json({ success: false, error: "Role tidak ditemukan" }, { status: 404 });
    }

    // Role sistem tidak boleh diganti namanya
    const updateData: Partial<Role> = {
      description: description || role.description,
      permissions: permissions || role.permissions,
    };

    if (!role.is_system) {
      updateData.name = cleanName;
    }

    const updated = await db.update<Role>("Roles", id, updateData);
    return NextResponse.json({ success: true, data: updated });
  }

  // Jika membuat role baru
  const roles = await db.list<Role>("Roles");
  if (roles.some((r) => r.name === cleanName)) {
    return NextResponse.json(
      { success: false, error: "Role dengan nama tersebut sudah ada" },
      { status: 409 }
    );
  }

  const newRole = await db.create<Role>("Roles", {
    name: cleanName,
    description: description || "Role kustom",
    permissions: permissions || "read",
    is_system: false,
  });

  return NextResponse.json({ success: true, data: newRole });
}

export async function DELETE(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ success: false, error: "ID role wajib disertakan" }, { status: 400 });
  }

  const role = await db.findById<Role>("Roles", id);
  if (!role) {
    return NextResponse.json({ success: false, error: "Role tidak ditemukan" }, { status: 404 });
  }

  // Proteksi: Role sistem tidak boleh dihapus
  if (role.is_system) {
    return NextResponse.json(
      { success: false, error: "Role bawaan sistem tidak boleh dihapus" },
      { status: 400 }
    );
  }

  const success = await db.delete("Roles", id);
  return NextResponse.json({ success });
}

