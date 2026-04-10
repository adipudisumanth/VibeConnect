import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  projectService,
  type ProjectResponseDTO,
} from "@/api/projectService";
import { applicationService } from "@/api/applicationService";
import { useAuth } from "@/hooks/useAuth";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Briefcase,
  Clock,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Pencil,
  Trash2,
  Send,
  Code2,
  Users,
  Search,
  FolderOpen,
} from "lucide-react";

export const Route = createFileRoute(
  "/(dashboard)/_dashboardLayout/projects"
)({
  beforeLoad: () => {
    const { isAuthenticated } = useAuth.getState();
    if (!isAuthenticated) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  component: ProjectsPage,
});

function ProjectsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isFounder = user?.role === "FOUNDER";

  const [searchQuery, setSearchQuery] = useState("");
  const [editingProject, setEditingProject] =
    useState<ProjectResponseDTO | null>(null);
  const [deletingProject, setDeletingProject] =
    useState<ProjectResponseDTO | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    technologyStack: "",
    totalOpenings: 1,
  });

  // ── Queries ───────────────────────────────────────────────────────────
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-project-openings"],
    queryFn: () => projectService.getProjectOpenings(),
  });

  const { data: myApplications } = useQuery({
    queryKey: ["applications", user?.id],
    queryFn: () => applicationService.getApplicationsByUser(user!.id),
    enabled: !!user?.id && !isFounder,
  });

  // ── Mutations ─────────────────────────────────────────────────────────
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
    },
    onError: (error: any) => {
      toast.error("Apply Failed", {
        description:
          error.response?.data?.message ||
          "You may have already applied to this project.",
      });
    },
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

  const editMutation = useMutation({
    mutationFn: (data: { id: number; payload: typeof editForm }) =>
      projectService.updateProject(data.id, data.payload),
    onSuccess: () => {
      toast.success("Project Updated", {
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["all-project-openings"] });
      queryClient.invalidateQueries({ queryKey: ["projects-feed"] });
      setEditingProject(null);
    },
    onError: (error: any) => {
      toast.error("Update Failed", {
        description:
          error.response?.data?.message || "Could not update this project.",
      });
    },
  });

  // ── Handlers ──────────────────────────────────────────────────────────
  const openEditDialog = (project: ProjectResponseDTO) => {
    setEditForm({
      title: project.title,
      description: project.description,
      technologyStack: project.technologyStack,
      totalOpenings: project.totalOpenings,
    });
    setEditingProject(project);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    editMutation.mutate({ id: editingProject.id, payload: editForm });
  };

  // ── Filtering ─────────────────────────────────────────────────────────
  const filteredProjects = projects?.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologyStack.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Loading State ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Discovering projects...
        </p>
      </div>
    );
  }

  // ── Error State ───────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 border-2 border-dashed rounded-xl">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-bold">Failed to load projects</h3>
        <p className="text-muted-foreground mb-4">
          Something went wrong. Try refreshing the page.
        </p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            className="mb-4 gap-2 hover:bg-transparent hover:text-primary p-0 transition-colors"
            onClick={() => navigate({ to: "/dashboard" })}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
          <h1 className="text-4xl font-black tracking-tight text-foreground font-heading">
            All Projects
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse open project opportunities and connect with founders.
          </p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="projects-search"
            placeholder="Search projects..."
            className="pl-10 h-11 bg-muted/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Projects Grid ──────────────────────────────────────────────── */}
      {filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const isOwner = isFounder && project.founderId === user?.id;
            return (
              <Card
                key={project.id}
                className="group flex flex-col border-border/40 bg-card/40 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden relative"
              >
                <CardHeader className="pb-3 pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant="outline"
                      className="bg-primary/5 border-primary/20 text-primary capitalize"
                    >
                      {project.postType?.toLowerCase() || "project"}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground font-medium">
                      <Clock className="mr-1 h-3.5 w-3.5" />
                      {new Date(project.createdAt).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric" }
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 min-h-10">
                    {project.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologyStack
                      ?.split(",")
                      .filter(Boolean)
                      .map((tech: string) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="text-[10px] font-semibold uppercase tracking-wider bg-muted/50"
                        >
                          {tech.trim()}
                        </Badge>
                      ))}
                  </div>
                  {/* Openings info */}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    <span>
                      {project.filledOpenings} / {project.totalOpenings} slots
                      filled
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-border/30 flex gap-2">
                  {isOwner ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5 cursor-pointer"
                        onClick={() => openEditDialog(project)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
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
                    </>
                  ) : (() => {
                    const appliedApp = myApplications?.find((app) => app.projectId === project.id);
                    const isSlotsFull = (project.filledOpenings || 0) >= (project.totalOpenings || 0);

                    return (
                      <Button
                        className={`w-full h-11 font-bold shadow-md shadow-primary/10 group/btn cursor-pointer ${appliedApp?.status === "ACCEPTED" ? "bg-green-600 hover:bg-green-700 text-white disabled:opacity-80 disabled:bg-green-600/50" : ""}`}
                        variant={
                          appliedApp?.status === "REJECTED" ? "destructive"
                          : appliedApp ? "secondary"
                          : isSlotsFull ? "secondary"
                          : "default"
                        }
                        disabled={
                          applyMutation.isPending || 
                          isFounder || 
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
                            <Briefcase className="ml-2 h-4 w-4 transition-transform group-hover/btn:rotate-12" />
                          </>
                        )}
                      </Button>
                    );
                  })()}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8 border-2 border-dashed rounded-xl">
          <FolderOpen className="h-14 w-14 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-bold">No projects found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "Try adjusting your search query."
              : "There are no open projects at the moment."}
          </p>
        </div>
      )}

      {/* ── Delete Confirmation Dialog ─────────────────────────────────── */}
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

      {/* ── Edit Project Dialog ────────────────────────────────────────── */}
      <Dialog
        open={!!editingProject}
        onOpenChange={() => setEditingProject(null)}
      >
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Edit Project
            </DialogTitle>
            <DialogDescription>
              Update the details of your project. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-5 py-2">
            <div className="space-y-2">
              <Label
                htmlFor="edit-title"
                className="text-xs font-bold uppercase tracking-wider"
              >
                Title
              </Label>
              <Input
                id="edit-title"
                className="h-11"
                required
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="edit-description"
                className="text-xs font-bold uppercase tracking-wider"
              >
                Description
              </Label>
              <Textarea
                id="edit-description"
                className="min-h-[100px] resize-none"
                required
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="edit-tech"
                  className="text-xs font-bold uppercase tracking-wider"
                >
                  Tech Stack
                </Label>
                <div className="relative">
                  <Code2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-tech"
                    className="pl-10 h-11"
                    required
                    value={editForm.technologyStack}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        technologyStack: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-openings"
                  className="text-xs font-bold uppercase tracking-wider"
                >
                  Total Openings
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="edit-openings"
                    type="number"
                    className="pl-10 h-11"
                    required
                    min={1}
                    value={editForm.totalOpenings}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        totalOpenings: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingProject(null)}
                disabled={editMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editMutation.isPending}
                className="gap-2 font-bold"
              >
                {editMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
