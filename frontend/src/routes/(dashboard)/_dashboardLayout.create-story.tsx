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
import { Loader2, Sparkles, FileText, ArrowLeft } from "lucide-react"

export const Route = createFileRoute('/(dashboard)/_dashboardLayout/create-story')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuth.getState();
    if (!isAuthenticated) {
      throw redirect({ to: '/login', replace: true });
    }
  },
  component: CreateStoryComponent,
})

function CreateStoryComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuth((state) => state.user)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => {
      if (!user?.id) throw new Error("User not authenticated")
      return projectService.createStory(data)
    },
    onSuccess: () => {
      toast.success("Story Shared!", {
        description: "Your update is now live on the feed.",
      })
      queryClient.invalidateQueries({ queryKey: ["projects-feed"] })
      navigate({ to: '/dashboard' })
    },
    onError: (error: any) => {
      toast.error("Post Failed", {
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
          <Sparkles className="h-8 w-8 text-primary" />
          Share a Vibe
        </h1>
        <p className="text-muted-foreground text-lg">
          Update the community on your journey, insights, or progress.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-primary/10 bg-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-primary to-violet-500" />

          <form onSubmit={handleSubmit}>
            <CardHeader className="pt-8">
              <CardTitle className="flex items-center gap-2 font-black uppercase tracking-tight">
                <FileText className="h-5 w-5 text-primary" />
                Story Details
              </CardTitle>
              <CardDescription>
                Share an update, insight, or milestone with the VibeConnect community.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider">Title</Label>
                <Input
                  id="title"
                  placeholder="A catchy update title..."
                  className="h-12 bg-transparent focus-visible:ring-primary/20"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider">Content</Label>
                <Textarea
                  id="description"
                  placeholder="Share your thoughts, progress, or learnings..."
                  className="min-h-[180px] bg-transparent resize-none focus-visible:ring-primary/20"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
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
                    Post Story
                    <Sparkles className="h-4 w-4" />
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
