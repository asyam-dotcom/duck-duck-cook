import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, OrderItem } from "@/lib/db";

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

  const orders = await db.list<OrderItem>("Orders");
  // Urutkan dari pesanan terbaru
  const sorted = orders.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return NextResponse.json({ success: true, data: sorted });
}

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
  }

  const { id, status, admin_notes } = await req.json();

  if (!id) {
    return NextResponse.json(
      { success: false, error: "ID pesanan wajib disertakan" },
      { status: 400 }
    );
  }

  const validStatuses = ["menunggu_konfirmasi", "dikonfirmasi", "dibatalkan"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { success: false, error: "Status pesanan tidak valid" },
      { status: 400 }
    );
  }

  const existing = await db.findById<OrderItem>("Orders", id);
  if (!existing) {
    return NextResponse.json(
      { success: false, error: "Pesanan tidak ditemukan" },
      { status: 404 }
    );
  }

  const updated = await db.update<OrderItem>("Orders", id, {
    status,
    admin_notes: admin_notes !== undefined ? admin_notes : existing.admin_notes,
  });

  return NextResponse.json({ success: true, order: updated });
}

