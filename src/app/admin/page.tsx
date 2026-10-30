import type { Metadata } from "next";
import AdminClient from "@/components/AdminClient";

export const metadata: Metadata = {
  title: "Admin Panel | Semolis Bali - PT Aviana Sinar Anugerah",
  description:
    "Panel Administrasi & Manajemen Stok Unit Motor Listrik Semolis Bali",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminClient />;
}

