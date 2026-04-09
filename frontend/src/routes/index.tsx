import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { signout } = useAuth();
  return <div>
    <Button
    onClick={()=>{signout();navigate({ to: '/login' })}}>Signout</Button>
  </div>;
}
