import React from "react";
import { getProductsWithAvailability } from "@/lib/db";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

function getDefaultDates() {
  const start = new Date();
  const end = new Date();
  // Default 3-day inclusive rental: today, tomorrow, day after tomorrow (end - start + 1 = 3)
  end.setDate(start.getDate() + 2);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

export default function HomePage() {
  const { startDate, endDate } = getDefaultDates();
  const initialProducts = getProductsWithAvailability(startDate, endDate);

  return (
    <HomeClient
      initialProducts={initialProducts}
      defaultStartDate={startDate}
      defaultEndDate={endDate}
    />
  );
}

