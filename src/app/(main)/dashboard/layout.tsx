// app/dashboard/layout.tsx
// import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="container mx-auto px-4">
      <h1
        id="dashboard"
        className="text-6xl font-bold bg-gradient-to-r from-primary to-green-500 bg-clip-text text-transparent mb-10"
      >
        Dashboard
      </h1>
      {children}
    </section>
  );
}
