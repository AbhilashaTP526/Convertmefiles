import { AdminNav } from "@/components/admin/admin-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdminNav />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
