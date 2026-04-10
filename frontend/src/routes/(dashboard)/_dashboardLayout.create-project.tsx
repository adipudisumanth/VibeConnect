import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { projectService } from '@/api/projectService'
import { useAuth } from '@/hooks/useAuth'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Rocket, Code2, Users, ArrowLeft } from "lucide-react"

export const Route = createFileRoute('/(dashboard)/_dashboardLayout/create-project')({
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuth.getState();
    if (!isAuthenticated) {
      throw redirect({ to: '/login', replace: true });
    }
    // Only FOUNDERs can create projects
    if (user?.role !== 'FOUNDER') {
      throw redirect({ to: '/dashboard', replace: true });
    }
  },
  component: CreateProjectComponent,
})

function CreateProjectComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuth((state) => state.user)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologyStack: '',
    totalOpenings: 1,
  })

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => {
      if (!user?.id) throw new Error("User not authenticated")
      return projectService.createProject({
        ...data,
        postType: 'PROJECT',
      })
    },
    onSuccess: () => {
      toast.success("Project Launched!", {
        description: "VibeCoders can now discover and apply to your project.",
      })
      queryClient.invalidateQueries({ queryKey: ["projects-feed"] })
      queryClient.invalidateQueries({ queryKey: ["all-project-openings"] })
      navigate({ to: '/dashboard' })
    },
    onError: (error: any) => {
      toast.error("Launch Failed", {
        description: error.response?.data?.message || "Check your details and try again.",
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button
        variant="ghost"
        className="mb-6 gap-2 hover:bg-transparent hover:text-primary p-0 transition-colors"
        onClick={() => navigate({ to: '/dashboard' })}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-4xl font-black tracking-tight text-foreground font-heading uppercase flex items-center gap-3 italic">
          <Rocket className="h-8 w-8 text-primary" />
          Launch Project
        </h1>
        <p className="text-muted-foreground text-lg">
          Define your digital vision and build your squad.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-primary/10 bg-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-400 to-primary" />

          <form onSubmit={handleSubmit}>
            <CardHeader className="pt-8">
              <CardTitle className="flex items-center gap-2 font-black uppercase tracking-tight">
                <Rocket className="h-5 w-5 text-primary" />
                Project Details
              </CardTitle>
              <CardDescription>
                Fill in the details to recruit VibeCoders for your project.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider">Title</Label>
                <Input
                  id="title"
                  placeholder="Project Name"
                  className="h-12 bg-transparent focus-visible:ring-primary/20"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project vision, goals, and what you're looking for..."
                  className="min-h-[140px] bg-transparent resize-none focus-visible:ring-primary/20"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {/* Tech Stack & Openings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="tech" className="text-xs font-bold uppercase tracking-wider">Tech Stack</Label>
                  <div className="relative">
                    <Code2 className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="tech"
                      placeholder="React, Node.js, etc."
                      className="pl-10 h-12"
                      required
                      value={formData.technologyStack}
                      onChange={(e) => setFormData({...formData, technologyStack: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openings" className="text-xs font-bold uppercase tracking-wider">Openings</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="openings"
                      type="number"
                      className="pl-10 h-12"
                      required
                      min={1}
                      value={formData.totalOpenings}
                      onChange={(e) => setFormData({...formData, totalOpenings: parseInt(e.target.value) || 1})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-6 border-t border-border/20 flex gap-4">
              <Button
                type="button"
                variant="ghost"
                className="flex-1 h-12 font-bold uppercase"
                onClick={() => navigate({ to: '/dashboard' })}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-[2] h-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Launch Project
                    <Rocket className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}