import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, OrderItem } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Silakan masuk (login) terlebih dahulu" },
        { status: 401 }
      );
    }

    const orderId = params.id;
    const order = await db.findById<OrderItem>("Orders", orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Tiket pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Proteksi keamanan: hanya pemilik pesanan atau admin yang boleh melihat detail
    if (order.user_id !== session.userId && session.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak ke pesanan ini" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Get order detail error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat detail pesanan" },
      { status: 500 }
    );
  }
}

