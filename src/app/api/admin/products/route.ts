import { NextResponse } from "next/server";
import {
  getProductsWithAvailability,
  updateProductStock,
  verifyAdminPin,
} from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pin =
      request.headers.get("x-admin-pin") || searchParams.get("pin") || "";

    if (!verifyAdminPin(pin)) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak: PIN Admin tidak valid." },
        { status: 401 }
      );
    }

    const products = getProductsWithAvailability();
    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan server.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const pin = request.headers.get("x-admin-pin") || body.pin || "";
    const { id, total_stock, price_per_day } = body;

    if (!verifyAdminPin(pin)) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak: PIN Admin tidak valid." },
        { status: 401 }
      );
    }

    if (!id || typeof total_stock !== "number" || total_stock < 0) {
      return NextResponse.json(
        { success: false, message: "ID unit dan total stok valid wajib diisi." },
        { status: 400 }
      );
    }

    const updated = updateProductStock(
      Number(id),
      Math.floor(total_stock),
      typeof price_per_day === "number" && price_per_day > 0
        ? Math.floor(price_per_day)
        : undefined
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Data unit tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Total stok unit ${updated.name} berhasil diperbarui menjadi ${updated.total_stock}.`,
      data: updated,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan server.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

