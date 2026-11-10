import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db, OrderItem } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Silakan masuk (login) terlebih dahulu untuk membuat pesanan" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      customer_name,
      customer_phone,
      order_type,
      items_summary,
      total_amount,
      reservation_date,
      reservation_time,
      pax_or_quantity,
      delivery_address,
      notes,
    } = body;

    // Validasi input di server
    if (!customer_name || customer_name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Nama pemesan wajib diisi dengan benar" },
        { status: 400 }
      );
    }

    if (!customer_phone || customer_phone.trim().length < 8) {
      return NextResponse.json(
        { success: false, error: "Nomor WhatsApp aktif wajib diisi untuk konfirmasi" },
        { status: 400 }
      );
    }

    if (!items_summary) {
      return NextResponse.json(
        { success: false, error: "Rincian pesanan tidak boleh kosong" },
        { status: 400 }
      );
    }

    if (!total_amount || Number(total_amount) <= 0) {
      return NextResponse.json(
        { success: false, error: "Nominal pembayaran tidak valid" },
        { status: 400 }
      );
    }

    // Generate kode tiket unik e.g. DDC-48291
    const order_code = `DDC-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = await db.create<OrderItem>("Orders", {
      order_code,
      user_id: session.userId,
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      order_type: order_type || "dine_in",
      items_summary,
      total_amount: Number(total_amount),
      reservation_date: reservation_date || "",
      reservation_time: reservation_time || "",
      pax_or_quantity: Number(pax_or_quantity) || 1,
      delivery_address: delivery_address || "",
      notes: notes || "",
      status: "menunggu_konfirmasi",
      admin_notes: "",
    });

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat memproses pesanan" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Silakan masuk (login) terlebih dahulu" },
        { status: 401 }
      );
    }

    const allOrders = await db.list<OrderItem>("Orders");
    // Pengguna hanya boleh melihat pesanan miliknya sendiri
    const userOrders = allOrders
      .filter((o) => o.user_id === session.userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ success: true, data: userOrders });
  } catch (error) {
    console.error("Get user orders error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat daftar pesanan" },
      { status: 500 }
    );
  }
}

