import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
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
import { Briefcase, Clock, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/(dashboard)/_dashboardLayout/dashboard")({
  component: DashboardComponent,
});

const PROJECTS_FEED = [
  {
    id: "1",
    title: "AI Personal Trainer",
    domain: "Machine Learning",
    description: "Building a computer vision app to track workout form in real-time.",
    founder: "Alex Rivera",
    postedAt: "2 days ago",
    techStack: ["Python", "React Native", "TensorFlow"],
  },
  {
    id: "2",
    title: "EcoTrack SaaS",
    domain: "Sustainability",
    description: "Carbon footprint tracking dashboard for small-to-medium businesses.",
    founder: "Jordan Smith",
    postedAt: "5 hours ago",
    techStack: ["Next.js", "PostgreSQL", "Tailwind"],
  },
  {
    id: "3",
    title: "VibeConnect",
    domain: "Social Media",
    description: "Connecting developers and founders based on project chemistry.",
    founder: "Sarah Chen",
    postedAt: "1 week ago",
    techStack: ["React", "Zustand", "TanStack"],
  },
];

function DashboardComponent() {
  const user = useAuth((state) => state.user);
  const isVibeCoder = user?.role === "VIBECODER";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">Project Feed</h1>
        <p className="text-muted-foreground text-lg">
          Explore current opportunities in the VibeConnect ecosystem.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS_FEED.map((project) => (
          <Card key={project.id} className="flex flex-col border-border/60 bg-card/50 backdrop-blur-sm transition-all hover:border-border hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold">
                  {project.domain}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground font-medium">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  {project.postedAt}
                </div>
              </div>
              <CardTitle className="text-xl font-bold leading-tight">{project.title}</CardTitle>
              <CardDescription className="text-sm">
                Posted by <span className="font-semibold text-foreground">{project.founder}</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge 
                    key={tech} 
                    variant="outline" 
                    className="bg-muted/50 text-[10px] uppercase tracking-wider"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              {isVibeCoder ? (
                <Button className="w-full h-11 font-semibold shadow-sm group" variant="default">
                  Apply to Project
                  <Briefcase className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                </Button>
              ) : (
                <Button className="w-full h-11 font-semibold group" variant="outline">
                  View Management
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}