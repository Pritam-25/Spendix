// app/dashboard/layout.tsx
import { Suspense } from "react";
import { PulseLoader } from "react-spinners";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="container mx-auto px-4">
      <h1 id="dashboard" className="text-6xl font-bold text-primary mb-5">
        Dashboard
      </h1>
      <Suspense
        fallback={
          <div className="flex justify-center">
            <PulseLoader color="green" />
          </div>
        }
      >
        {children}
      </Suspense>
    </section>
  );
}
