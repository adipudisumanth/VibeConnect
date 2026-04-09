import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { userService, AuthResponse } from '@/api/userService'
import { useAuth } from '@/hooks/useAuth'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, User, Mail, Lock, Sparkles, ShieldCheck } from "lucide-react"

export const Route = createFileRoute('/signup')({
  beforeLoad: ({ navigate }) => {
    if (useAuth.getState().isAuthenticated) throw navigate({ to: '/' })
  },
  component: SignupComponent,
})

function SignupComponent() {
  const navigate = useNavigate()
  const setAuth = useAuth((state:any) => state.setAuth)
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: '', skillsAndVibes: '' })

  const signupMutation = useMutation({
    mutationFn: (data: typeof formData) => userService.register(data),
    onSuccess: (data: AuthResponse) => {
      setAuth(data.token, data.user)
      toast.success("Account created successfully!", {
        description: `Welcome to the community, ${data.user.fullName}!`,
      })
      navigate({ to: '/dashboard', replace: true })
    },
    onError: (error: any) => {
      toast.error("Registration Failed", {
        description: error.response?.data?.message || "Something went wrong. Please try again.",
      })
    }
  })

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background py-12 px-4">
      <div className="absolute bottom-[-5%] left-[-5%] h-[50%] w-[50%] rounded-full bg-emerald-500/5 blur-[120px]" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="z-10 w-full max-w-lg">
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-1">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg mb-2"><Sparkles className="h-6 w-6 text-primary-foreground" /></div>
            <CardTitle className="text-3xl font-extrabold text-primary">Join VibeConnect</CardTitle>
            <CardDescription>Create your profile and start connecting</CardDescription>
          </CardHeader>
          <form onSubmit={(e) => { e.preventDefault(); signupMutation.mutate(formData); }}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative group"><User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" /><Input id="fullName" placeholder="John Doe" className="pl-10" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                    <SelectTrigger><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Role" /></div></SelectTrigger>
                    <SelectContent><SelectItem value="FOUNDER">FOUNDER</SelectItem><SelectItem value="VIBECODER">VIBECODER</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative group"><Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" /><Input id="email" type="email" className="pl-10" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative group"><Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" /><Input id="password" type="password" className="pl-10" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label htmlFor="vibes">Skills & Vibes</Label><Textarea id="vibes" placeholder="Tell us what you bring..." className="min-h-20" value={formData.skillsAndVibes} onChange={(e) => setFormData({ ...formData, skillsAndVibes: e.target.value })} /></div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-11 font-bold shadow-lg" disabled={signupMutation.isPending}>
                {signupMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
              </Button>
              <p className="text-sm text-muted-foreground">Already have an account? <button type="button" className="text-primary font-bold hover:underline" onClick={() => navigate({ to: '/login' })}>Sign In</button></p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}