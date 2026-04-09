import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { userService, AuthResponse } from '@/api/userService'
import { useAuth } from '@/hooks/useAuth'
import { toast } from "sonner" // Import sonner

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react"

export const Route = createFileRoute('/login')({
  beforeLoad: ({ navigate }) => {
    if (useAuth.getState().isAuthenticated) throw navigate({ to: '/' })
  },
  component: LoginComponent,
})

function LoginComponent() {
  const navigate = useNavigate()
  const setAuth = useAuth((state:any) => state.setAuth)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const loginMutation = useMutation({
    mutationFn: (data: typeof formData) => userService.login(data),
    onSuccess: (data: AuthResponse) => {
      setAuth(data.token, data.user)
      toast.success("Welcome back!", {
        description: `Logged in as ${data.user.fullName}`,
      })
      navigate({ to: '/' })
    },
    onError: (error: any) => {
      toast.error("Login Failed", {
        description: error.response?.data?.message || "Please check your credentials.",
      })
    }
  })

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 w-full max-w-md">
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-extrabold text-primary">VibeConnect</CardTitle>
            <CardDescription>Enter your vibes to continue</CardDescription>
          </CardHeader>
          <form onSubmit={(e) => { e.preventDefault(); loginMutation.mutate(formData); }}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input id="email" type="email" className="pl-10 h-12" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input id="password" type={showPassword ? "text" : "password"} className="pl-10 pr-10 h-12" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground outline-none">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <div className="flex justify-end"><button type="button" className="text-xs font-semibold text-primary hover:underline" onClick={() => navigate({ to: '/forgotPassword' })}>Forgot password?</button></div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full h-12 font-bold shadow-lg" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
              <p className="text-sm text-muted-foreground">New here? <button type="button" className="text-primary font-bold hover:underline" onClick={() => navigate({ to: '/signup' })}>Create an account</button></p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}