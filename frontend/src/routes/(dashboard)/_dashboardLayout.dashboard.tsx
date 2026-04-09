import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/_dashboardLayout/dashboard")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return <div></div>;
}
