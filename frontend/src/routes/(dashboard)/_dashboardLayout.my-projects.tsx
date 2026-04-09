import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  LayoutGrid,
  Users,
  Clock,
  ExternalLink,
  LoaderCircle,
} from "lucide-react";

// Shadcn Components (assuming they are installed in @/components/ui)
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
import { useAuth } from "@/hooks/useAuth";
import { projectService } from "@/api/projectService";

export const Route = createFileRoute(
  "/(dashboard)/_dashboardLayout/my-projects",
)({
  component: MyProjectsPage,
});

function MyProjectsPage() {
  // Replace with your actual founderId logic (e.g., from auth context)
  const { user } = useAuth();

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects", "founder", user?.id],
    queryFn: async () => projectService.getProjctsByFounderId(user?.id),
  });

  console.log(projects);

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
        <div className="flex items-center space-x-2">
          <Button className="bg-primary text-primary-foreground hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
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
        {/* Add more stats cards as needed */}
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <LoaderCircle />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project: any) => (
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

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologyStack.split(",").map((tech: string) => (
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

              <CardFooter className="border-t bg-muted/30 px-6 py-4 flex justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  <span>
                    {project.filledOpenings} / {project.totalOpenings} slots
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
