import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
// Using relative path to ensure Vite finds it regardless of alias config
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/(dashboard)/_dashboardLayout")({
  beforeLoad: ({ location }) => {
    const auth = useAuth.getState();
    if (!auth.isAuthenticated) {
      throw redirect({
        to: "/",
        search: {
          // @ts-ignore
          redirect: location.href,
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const user = useAuth((state) => state.user);
  const role = user?.role || "VIBECODER";

  return (
    <div className="min-h-screen bg-background">
      <Navbar role={role as "FOUNDER" | "VIBECODER"} />
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
