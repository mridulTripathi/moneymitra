import type { Metadata } from "next";
import AdminRatesPage from "./AdminRatesPage";

export const metadata: Metadata = {
  title: "Admin · Update Rates",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Rates Admin</h1>
      <p className="text-sm text-[#64748B] mb-6">Update RBI policy rates and bank rates. Requires the admin password.</p>
      <AdminRatesPage />
    </div>
  );
}
