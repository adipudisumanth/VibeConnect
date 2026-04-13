import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LayoutGrid,
  Users,
  Clock,
  LoaderCircle,
  Trash2,
  Loader2,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { projectService, type ProjectResponseDTO } from "@/api/projectService";
import { applicationService, ApplicationStatus } from "@/api/applicationService";
import { userService } from "@/api/userService";
import { useState } from "react";

export const Route = createFileRoute(
  "/(dashboard)/_dashboardLayout/my-projects",
)({
  component: MyProjectsPage,
});

function MyProjectsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [deletingProject, setDeletingProject] =
    useState<ProjectResponseDTO | null>(null);
  const [viewingApplicationsFor, setViewingApplicationsFor] =
    useState<ProjectResponseDTO | null>(null);

  const { data: myprojects, isLoading } = useQuery({
    queryKey: ["projects", "founder", user?.id],
    queryFn: async () => projectService.getProjctsByFounderId(user?.id),
  });

  const projects = myprojects?.filter(
    (project: any) => project.postType === "PROJECT"
  );

  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ["applications", "project", viewingApplicationsFor?.id],
    queryFn: async () => {
      const apps = await applicationService.getApplicationsByProject(viewingApplicationsFor!.id);
      const enrichedApps = await Promise.all(
        apps.map(async (app) => {
          try {
            const user = await userService.getProfile(app.userId);
            return { ...app, userName: user.fullName };
          } catch (e) {
            return { ...app, userName: "Unknown User" };
          }
        })
      );
      return enrichedApps;
    },
    enabled: !!viewingApplicationsFor,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
       await applicationService.deleteApplicationsByProject(id);
       await projectService.deleteProject(id);
    },
    onSuccess: () => {
      toast.success("Project Deleted", {
        description: "The project has been permanently removed.",
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", "founder", user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["all-project-openings"] });
      queryClient.invalidateQueries({ queryKey: ["projects-feed"] });
      setDeletingProject(null);
    },
    onError: (error: any) => {
      toast.error("Delete Failed", {
        description:
          error.response?.data?.message || "Could not delete this project.",
      });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({
      appId,
      status,
    }: {
      appId: number;
      status: ApplicationStatus;
      project: ProjectResponseDTO;
    }) => {
      await applicationService.updateStatus(appId, status);
    },
    onSuccess: (_, variables) => {
      toast.success("Application updated");
      queryClient.invalidateQueries({ queryKey: ["applications", "project"] });
      
      // Update local query cache optimistically to ensure UI immediately reflects the accepted status
      // This prevents the backend (if updateProject is unimplemented) from overriding it back to old values
      if (user?.id && variables.status === ApplicationStatus.ACCEPTED) {
        queryClient.setQueryData(
          ["projects", "founder", user.id],
          (oldData: any) => {
            if (!oldData) return oldData;
            return oldData.map((p: any) => {
              if (p.id === variables.project.id) {
                return {
                  ...p,
                  filledOpenings: (p.filledOpenings || 0) + 1,
                };
              }
              return p;
            });
          }
        );
      } else if (user?.id) {
         queryClient.invalidateQueries({ queryKey: ["projects", "founder", user.id] });
      }

      queryClient.invalidateQueries({ queryKey: ["all-project-openings"] });
      queryClient.invalidateQueries({ queryKey: ["projects-feed"] });
    },
    onError: (error: any) => {
      toast.error("Review Failed", {
        description: error.response?.data?.message || "Could not update application status.",
      });
    },
  });

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            My Projects
          </h2>
          <p className="text-muted-foreground">
            Manage and monitor the projects you have founded.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <Card
              key={project.id}
              className="group flex flex-col justify-between overflow-hidden transition-all hover:border-primary/50 hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge
                    variant={project.isActive ? "default" : "secondary"}
                    className={
                      project.isActive
                        ? "bg-primary/10 text-primary border-primary/20"
                        : ""
                    }
                  >
                    {project.active ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="mt-4 line-clamp-1 group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-10">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {project.technologyStack
                    ?.split(",")
                    .map((tech: string) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-[10px] font-semibold uppercase tracking-wider"
                      >
                        {tech.trim()}
                      </Badge>
                    ))}
                </div>
              </CardContent>

              <CardFooter className="border-t bg-muted/30 px-4 py-4 flex flex-col gap-3">
                <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>
                      {project.filledOpenings || 0} / {project.totalOpenings || 0} slots
                    </span>
                  </div>
                </div>
                <div className="flex w-full gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 gap-1.5 cursor-pointer"
                    onClick={() => setViewingApplicationsFor(project)}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Apps
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 gap-1.5 cursor-pointer"
                    onClick={() => setDeletingProject(project)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed rounded-xl p-8 text-center">
          <LayoutGrid className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-bold">No projects yet</h3>
          <p className="text-muted-foreground">
            Create your first project to start recruiting VibeCoders!
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingProject}
        onOpenChange={() => setDeletingProject(null)}
      >
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Delete Project
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{deletingProject?.title}"
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setDeletingProject(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() =>
                deletingProject && deleteMutation.mutate(deletingProject.id)
              }
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Permanently"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Applications Dialog */}
      <Dialog
        open={!!viewingApplicationsFor}
        onOpenChange={() => setViewingApplicationsFor(null)}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Applications</DialogTitle>
            <DialogDescription>
              Review VibeCoders who applied to "
              <span className="font-semibold text-foreground">
                {viewingApplicationsFor?.title}
              </span>
              "
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
            {appsLoading ? (
              <div className="flex justify-center p-8">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : applications && applications.length > 0 ? (
              applications.map((app) => (
                <div
                  key={app.applicationId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-muted/30 gap-4"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      {app.userName || `User ID: ${app.userId}`}
                      <Badge
                        variant={
                          app.status === ApplicationStatus.ACCEPTED
                            ? "default"
                            : "secondary"
                        }
                        className={
                          app.status === ApplicationStatus.REJECTED
                            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            : ""
                        }
                      >
                        {app.status}
                      </Badge>
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {app.status === ApplicationStatus.PENDING && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={reviewMutation.isPending}
                        onClick={() =>
                          app.applicationId &&
                          viewingApplicationsFor &&
                          reviewMutation.mutate({
                            appId: app.applicationId,
                            status: ApplicationStatus.REJECTED,
                            project: viewingApplicationsFor,
                          })
                        }
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-primary hover:bg-primary/90"
                        disabled={reviewMutation.isPending}
                        onClick={() =>
                          app.applicationId &&
                          viewingApplicationsFor &&
                          reviewMutation.mutate({
                            appId: app.applicationId,
                            status: ApplicationStatus.ACCEPTED,
                            project: viewingApplicationsFor,
                          })
                        }
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 border-dashed border-2 rounded-lg text-center text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No applications received for this project yet.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

