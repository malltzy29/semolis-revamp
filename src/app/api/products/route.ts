import { NextRequest, NextResponse } from "next/server";
import { getProductsWithAvailability } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start_date") || undefined;
    const endDate = searchParams.get("end_date") || undefined;

    const products = getProductsWithAvailability(startDate, endDate);
    return NextResponse.json({
      ok: true,
      products,
      checkedRange: {
        startDate: startDate || new Date().toISOString().slice(0, 10),
        endDate:
          endDate || startDate || new Date().toISOString().slice(0, 10),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Gagal mengambil data stok motor.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

