import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/(dashboard)/_dashboardLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  const userRole: "FOUNDER" | "VIBECODER" = "FOUNDER";

  return (
    <div className="min-h-screen bg-background">
      <Navbar role={userRole} />
      <main className="container mx-auto p-6">
        {/* Outlet renders the child routes of this dashboard layout */}
        <Outlet />
      </main>
    </div>
  );
}
