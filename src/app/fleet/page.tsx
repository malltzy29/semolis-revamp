import React from "react";
import { getProductsWithAvailability } from "@/lib/db";
import FleetCatalogClient from "@/components/FleetCatalogClient";

export const dynamic = "force-dynamic";

export default function FleetPage() {
  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + 2);

  const startDate = start.toISOString().slice(0, 10);
  const endDate = end.toISOString().slice(0, 10);

  const initialProducts = getProductsWithAvailability(startDate, endDate);

  return (
    <FleetCatalogClient
      initialProducts={initialProducts}
      defaultStartDate={startDate}
      defaultEndDate={endDate}
    />
  );
}

