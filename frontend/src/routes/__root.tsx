import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
      <Toaster 
        position="top-center" 
        hotkey={["alt", "t"]}
        toastOptions={{
          unstyled: true, 
          classNames: {
            toast: "group flex w-full items-center gap-3 rounded-xl border border-border/50 bg-card/60 backdrop-blur-md p-4 text-foreground shadow-lg",
            description: "text-black text-xs font-bold",
            title: "text-sm font-bold",
            success: "border-green-600/20 bg-green-600/83 text-white",
            error: "border-destructive/20 bg-destructive/83 text-white",
          },
        }}
      />
    </React.Fragment>
  );
}
