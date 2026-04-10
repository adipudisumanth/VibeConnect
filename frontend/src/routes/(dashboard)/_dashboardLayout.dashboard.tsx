import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import {
  Briefcase,
  Clock,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { projectService } from "@/api/projectService";
import { applicationService } from "@/api/applicationService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/(dashboard)/_dashboardLayout/dashboard")(
  {
    beforeLoad: () => {
      const { isAuthenticated } = useAuth.getState();
      if (!isAuthenticated) {
        throw redirect({
          to: "/login",
          replace: true,
        });
      }
    },
    component: DashboardComponent,
  },
);

function DashboardComponent() {
  const user = useAuth((state) => state.user);
  const isVibeCoder = user?.role === "VIBECODER";
  const queryClient = useQueryClient();

  const {
    data: stories,
    isLoading: storiesLoading,
    isError: storiesError,
  } = useQuery({
    queryKey: ["projects-feed"],
    queryFn: () => projectService.getStoryFeed(),
  });

  const {
    data: openings,
    isLoading: openingsLoading,
    isError: openingsError,
  } = useQuery({
    queryKey: ["all-project-openings"],
    queryFn: () => projectService.getProjectOpenings(),
  });

  const { data: myApplications } = useQuery({
    queryKey: ["applications", user?.id],
    queryFn: () => applicationService.getApplicationsByUser(user!.id),
    enabled: !!user?.id && isVibeCoder,
  });

  const isLoading = storiesLoading || openingsLoading;
  const isError = storiesError || openingsError;

  // Merge stories and project openings, sorted by newest first
  const myProjects = [...(stories || []), ...(openings || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const projects=myProjects.filter(p=>p.postType==="STORY")
  const applyMutation = useMutation({
    mutationFn: (projectId: number) =>
      applicationService.createApplication({
        projectId,
        userId: user!.id,
      }),
    onSuccess: () => {
      toast.success("Application Sent!", {
        description: "The founder will review your application.",
      });
      queryClient.invalidateQueries({ queryKey: ["applications", user?.id] });
    },
    onError: (error: any) => {
      toast.error("Apply Failed", {
        description:
          error.response?.data?.message ||
          "You may have already applied to this project.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Gathering the latest vibes...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 border-2 border-dashed rounded-xl">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-bold">Failed to load feed</h3>
        <p className="text-muted-foreground mb-4">
          The signal is weak. Try refreshing the page.
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground font-heading">
          Stories Feed
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Connect with founders and fellow VibeCoders to bring digital visions
          to life.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => {
          const isProject = project.postType === "PROJECT";
          return (
            <Card
              key={project.id}
              className="flex flex-col border-border/40 bg-card/40 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant="outline"
                    className="bg-primary/5 border-primary/20 text-primary capitalize"
                  >
                    {project.postType?.toLowerCase() || "project"}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground font-medium">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    {new Date(project.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-5">
                  {project.description}
                </p>
              </CardContent>

              {/* Only show footer with actions for PROJECT type */}
              {/* {isProject && (
                <CardFooter className="pt-4 border-t border-border/30">
                  {isVibeCoder ? (() => {
                    const appliedApp = myApplications?.find((app) => app.projectId === project.id);
                    const isSlotsFull = (project.filledOpenings || 0) >= (project.totalOpenings || 0);

                    return (
                      <Button
                        className={`w-full h-11 font-bold shadow-md shadow-primary/10 group cursor-pointer ${appliedApp?.status === "ACCEPTED" ? "bg-green-600 hover:bg-green-700 text-white disabled:opacity-80" : ""}`}
                        variant={
                          appliedApp?.status === "REJECTED" ? "destructive"
                          : appliedApp ? "secondary"
                          : isSlotsFull ? "secondary"
                          : "default"
                        }
                        disabled={
                          applyMutation.isPending ||
                          !!appliedApp ||
                          isSlotsFull
                        }
                        onClick={() => applyMutation.mutate(project.id)}
                      >
                        {applyMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : appliedApp ? (
                          appliedApp.status === "ACCEPTED" ? "Accepted"
                          : appliedApp.status === "REJECTED" ? "Rejected"
                          : "Applied"
                        ) : isSlotsFull ? (
                          "Slots Full"
                        ) : (
                          <>
                            Apply Now
                            <Briefcase className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                          </>
                        )}
                      </Button>
                    );
                  })() : (
                    <Button
                      className="w-full h-11 font-bold group cursor-pointer"
                      variant="outline"
                    >
                      Manage Vibe
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  )}
                </CardFooter> */}
              {/* )} */}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

