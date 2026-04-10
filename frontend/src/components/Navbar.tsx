import * as React from "react";
import {
  Plus,
  LayoutGrid,
  FileText,
  User,
  LogOut,
  Briefcase,
  Trash2,
  Loader2,
  Badge,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationService } from "@/api/applicationService";
import { projectService, type ProjectResponseDTO } from "@/api/projectService";
import { toast } from "sonner";

interface NavbarProps {
  role: "FOUNDER" | "VIBECODER";
}

export function Navbar({ role }: NavbarProps) {
  const isFounder = role === "FOUNDER";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { signout, user } = useAuth();
  const [activeModal, setActiveModal] = React.useState<
    "profile" | "applications" | "stories" | null
  >(null);
  const [deletingStory, setDeletingStory] =
    React.useState<ProjectResponseDTO | null>(null);
  const [deletingAppId, setDeletingAppId] = React.useState<number | null>(null);

  // ── Queries ─────────────────────────────────────────────────────────
  const { data: applications } = useQuery({
    queryKey: ["applications", user?.id],
    queryFn: () => applicationService.getApplicationsByUser(user!.id),
    enabled: !!user?.id && !isFounder,
  });

  const { data: myPosts } = useQuery({
    queryKey: ["projects", "founder", user?.id],
    queryFn: () => projectService.getProjctsByFounderId(user?.id),
    enabled: !!user?.id,
  });

  const myStories = myPosts?.filter(
    (p: any) => p.postType === "STORY"
  );

  // ── Mutations ───────────────────────────────────────────────────────
  const deleteStoryMutation = useMutation({
    mutationFn: (id: number) => projectService.deleteProject(id),
    onSuccess: () => {
      toast.success("Story Deleted");
      queryClient.invalidateQueries({
        queryKey: ["projects", "founder", user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["projects-feed"] });
      setDeletingStory(null);
    },
    onError: () => {
      toast.error("Failed to delete story");
    },
  });

  const deleteAppMutation = useMutation({
    mutationFn: (id: number) => applicationService.deleteApplication(id),
    onSuccess: () => {
      toast.success("Application Withdrawn");
      queryClient.invalidateQueries({
        queryKey: ["applications", user?.id],
      });
      setDeletingAppId(null);
    },
    onError: () => {
      toast.error("Failed to withdraw application");
    },
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link
          to="/dashboard"
          className="text-2xl font-bold tracking-tight text-primary font-heading"
        >
          VibeConnect
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          {isFounder ? (
            <>
              <Button
                className="hidden sm:flex h-12 items-center gap-2 px-6 text-base shadow-md"
                onClick={() => navigate({ to: "/create-project" })}
              >
                <Plus className="h-5 w-5" />
                New Project
              </Button>
              <Button
                variant="secondary"
                className="hidden sm:flex h-12 items-center gap-2 px-6 text-base shadow-sm"
                onClick={() => navigate({ to: "/create-story" })}
              >
                <FileText className="h-5 w-5" />
                New Story
              </Button>
            </>
          ) : (
            <>
              <Button
                className="hidden sm:flex h-12 items-center gap-2 px-6 text-base shadow-md"
                onClick={() => navigate({ to: "/create-story" })}
              >
                <Plus className="h-5 w-5" />
                New Story
              </Button>
              <Button
                variant="secondary"
                className="hidden sm:flex h-12 items-center gap-2 px-6 text-base shadow-sm"
                onClick={() => navigate({ to: "/projects" })}
              >
                <Briefcase className="h-5 w-5" />
                Projects
              </Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full p-0 ring-2 ring-transparent hover:ring-border transition-all"
              >
                <Avatar className="h-full w-full border border-border">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="User"
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                    VC
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 mt-2" align="end">
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-semibold leading-none text-foreground">
                    {user?.fullName}
                  </p>
                  <p className="text-sm leading-none text-muted-foreground capitalize">
                    {user?.role.toLowerCase()}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="p-1">
                <DropdownMenuItem
                  className="cursor-pointer py-3"
                  onSelect={() => setActiveModal("profile")}
                >
                  <User className="mr-3 h-5 w-5" />
                  <span>Profile</span>
                </DropdownMenuItem>

                {isFounder ? (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer py-3"
                      onSelect={() => navigate({ to: "/my-projects" })}
                    >
                      <LayoutGrid className="mr-3 h-5 w-5" />
                      <span>My Projects</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer py-3"
                      onSelect={() => setActiveModal("stories")}
                    >
                      <FileText className="mr-3 h-5 w-5" />
                      <span>My Stories</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer py-3"
                      onSelect={() => setActiveModal("applications")}
                    >
                      <LayoutGrid className="mr-3 h-5 w-5" />
                      <span>My Applications</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer py-3"
                      onSelect={() => setActiveModal("stories")}
                    >
                      <FileText className="mr-3 h-5 w-5" />
                      <span>My Stories</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer py-3 text-destructive focus:bg-destructive/10 focus:text-destructive"
                onSelect={() => {
                  signout();
                  setActiveModal(null);
                  navigate({ to: "/login", replace: true });
                }}
              >
                <LogOut className="mr-3 h-5 w-5" />
                <span className="text-sm font-medium">Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Profile Modal ──────────────────────────────────────────────── */}
      <Dialog
        open={activeModal === "profile"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              View and manage your personal information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-bold">
                  {user?.fullName || "Alex Rivera"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {user?.email || "alex@vibeconnect.com"}
                </p>
              </div>
            </div>
            <div className="grid gap-2 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Type:</span>
                <span className="font-medium capitalize">
                  {role.toLowerCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since:</span>
                <span className="font-medium">April 2026</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── My Applications Modal (VIBECODER) ──────────────────────────── */}
      <Dialog
        open={activeModal === "applications"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>My Applications</DialogTitle>
            <DialogDescription>
              Track the status of your current project vibes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
            {applications && applications.length > 0 ? (
              applications.map((app) => (
                <div
                  key={app.applicationId}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      Project ID: {app.projectId}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        app.status === "ACCEPTED" ? "default" : "secondary"
                      }
                      className={
                        app.status === "REJECTED"
                          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          : ""
                      }
                    >
                      {app.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer"
                      onClick={() =>
                        app.applicationId &&
                        setDeletingAppId(app.applicationId)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 border-dashed border-2 rounded-lg text-center text-muted-foreground">
                No applications yet. Browse projects to apply!
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── My Stories Modal (Both Roles) ───────────────────────────────── */}
      <Dialog
        open={activeModal === "stories"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>My Stories</DialogTitle>
            <DialogDescription>
              Manage your posted updates and project narratives.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
            {myStories && myStories.length > 0 ? (
              myStories.map((story: any) => (
                <div
                  key={story.id}
                  className="flex items-start justify-between p-3 border rounded-lg bg-muted/30 gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold line-clamp-1">
                      {story.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {story.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      Posted{" "}
                      {new Date(story.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10 cursor-pointer"
                    onClick={() => setDeletingStory(story)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-4 border-dashed border-2 rounded-lg text-center text-muted-foreground">
                No stories posted yet. Share your progress!
              </div>
            )}
          </div>
          <div className="pt-2">
            <Button
              className="w-full"
              onClick={() => {
                setActiveModal(null);
                navigate({ to: "/create-story" });
              }}
            >
              Create New Story
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Story Confirmation ──────────────────────────────────── */}
      <Dialog
        open={!!deletingStory}
        onOpenChange={() => setDeletingStory(null)}
      >
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Delete Story
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                "{deletingStory?.title}"
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setDeletingStory(null)}
              disabled={deleteStoryMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteStoryMutation.isPending}
              onClick={() =>
                deletingStory &&
                deleteStoryMutation.mutate(deletingStory.id)
              }
            >
              {deleteStoryMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Application Confirmation ────────────────────────────── */}
      <Dialog
        open={!!deletingAppId}
        onOpenChange={() => setDeletingAppId(null)}
      >
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Withdraw Application
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to withdraw this application? You can
              always re-apply later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setDeletingAppId(null)}
              disabled={deleteAppMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteAppMutation.isPending}
              onClick={() =>
                deletingAppId && deleteAppMutation.mutate(deletingAppId)
              }
            >
              {deleteAppMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Withdraw"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
