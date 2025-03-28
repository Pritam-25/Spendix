// app/dashboard/layout.tsx
// import { Suspense } from "react";

import { Suspense } from "react";

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
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        }
      >
        {children}
      </Suspense>
    </section>
  );
}
