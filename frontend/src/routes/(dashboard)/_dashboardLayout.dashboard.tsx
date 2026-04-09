// import { createFileRoute, redirect } from "@tanstack/react-router";
// import { useAuth } from "@/hooks/useAuth";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/Badge";
// import { Briefcase, Clock, ChevronRight } from "lucide-react";
// import { projectService } from "@/api/projectService";
// import { useQuery } from "node_modules/@tanstack/react-query/build/modern/_tsup-dts-rollup";

// export const Route = createFileRoute("/(dashboard)/_dashboardLayout/dashboard")({
//   beforeLoad: () => {
//     const { isAuthenticated } = useAuth.getState()

//     if (!isAuthenticated) {
//       throw redirect({
//         to: '/login',
//         replace: true,
//       })
//     }
//   },
//   component: DashboardComponent,
// });

// function DashboardComponent() {
//   const user = useAuth((state) => state.user);
//   const isVibeCoder = user?.role === "VIBECODER";

//   const { data: projects, isLoading, isError } = useQuery({
//     queryKey: ["projects-feed"],
//     queryFn: () => projectService.getStoryFeed(),
//   });

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//       <div className="flex flex-col gap-2">
//         <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">Project Feed</h1>
//         <p className="text-muted-foreground text-lg">
//           Explore current opportunities in the VibeConnect ecosystem.
//         </p>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {projects?.map((project) => (
//           <Card key={project.id} className="flex flex-col border-border/60 bg-card/50 backdrop-blur-sm transition-all hover:border-border hover:shadow-md">
//             <CardHeader className="pb-3">
//               <div className="flex items-center justify-between mb-3">
//                 <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-semibold">
//                   {project.domain}
//                 </Badge>
//                 <div className="flex items-center text-xs text-muted-foreground font-medium">
//                   <Clock className="mr-1 h-3.5 w-3.5" />
//                   {project.postedAt}
//                 </div>
//               </div>
//               <CardTitle className="text-xl font-bold leading-tight">{project.title}</CardTitle>
//               <CardDescription className="text-sm">
//                 Posted by <span className="font-semibold text-foreground">{project.founder}</span>
//               </CardDescription>
//             </CardHeader>

//             <CardContent className="flex-1">
//               <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
//                 {project.description}
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {project.techStack.map((tech) => (
//                   <Badge
//                     key={tech}
//                     variant="outline"
//                     className="bg-muted/50 text-[10px] uppercase tracking-wider"
//                   >
//                     {tech}
//                   </Badge>
//                 ))}
//               </div>
//             </CardContent>

//             <CardFooter className="pt-2">
//               {isVibeCoder ? (
//                 <Button className="w-full h-11 font-semibold shadow-sm group" variant="default">
//                   Apply to Project
//                   <Briefcase className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
//                 </Button>
//               ) : (
//                 <Button className="w-full h-11 font-semibold group" variant="outline">
//                   View Management
//                   <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
//                 </Button>
//               )}
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth"; // Standardizing to your store path
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge"; // Fixed casing
import {
  Briefcase,
  Clock,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { projectService } from "@/api/projectService";
import { useQuery } from "@tanstack/react-query"; // Fixed import path

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

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects-feed"],
    queryFn: () => projectService.getStoryFeed(),
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
          Project Feed
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Connect with founders and fellow VibeCoders to bring digital visions
          to life.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
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
                  {/* Mapping 'postType' to UI label */}
                  {project.postType?.toLowerCase() || "Project"}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground font-medium">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  {/* Using standard JS Date formatting for your createdAt string */}
                  {new Date(project.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>
              <CardDescription className="text-sm">
                Openings:{" "}
                <span className="font-bold text-foreground">
                  {project.filledOpenings}/{project.totalOpenings}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-5">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {/* Converting techStack string into Badge list */}
                {project.technologyStack.split(",").map((tech) => (
                  <Badge
                    key={tech.trim()}
                    variant="secondary"
                    className="bg-muted/30 text-[10px] uppercase font-bold tracking-tighter"
                  >
                    {tech.trim()}
                  </Badge>
                ))}
              </div>
            </CardContent>

            <CardFooter className="pt-4 border-t border-border/30">
              {isVibeCoder ? (
                <Button
                  className="w-full h-11 font-bold shadow-md shadow-primary/10 group cursor-pointer"
                  variant="default"
                >
                  Apply Now
                  <Briefcase className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                </Button>
              ) : (
                <Button
                  className="w-full h-11 font-bold group cursor-pointer"
                  variant="outline"
                >
                  Manage Vibe
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
