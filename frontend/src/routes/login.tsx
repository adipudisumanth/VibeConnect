import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { userService, AuthResponse } from '@/api/userService'

// shadcn/ui components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Icons
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react"

export const Route = createFileRoute('/login')({
  // 1. Redirect if already logged in
  beforeLoad: ({ navigate }) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      throw navigate({ to: '/' })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  const navigate = useNavigate()
  
  // States
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  // 2. TanStack Query Mutation
  const loginMutation = useMutation({
    mutationFn: (data: typeof formData) => userService.login(data),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('auth_token', data.token)
      navigate({ to: '/' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate(formData)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Background Decorative Accents */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-blue-600/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-md"
      >
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <motion.div 
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20"
            >
              <Lock className="h-6 w-6 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-primary">
              VibeConnect
            </CardTitle>
            <CardDescription className="text-muted-foreground/80 font-medium">
              Enter your vibes to continue
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {/* Animated Error Message */}
              <AnimatePresence mode="wait">
                {loginMutation.isError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 py-2">
                      <AlertDescription className="text-xs">
                        {(loginMutation.error as any)?.response?.data?.message || 
                         "Invalid email or password. Please try again."}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 h-12 transition-all focus:ring-2 focus:ring-primary/20"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password Input Block */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10 h-12 transition-all focus:ring-2 focus:ring-primary/20"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                <div className="flex justify-end px-1">
                  <button
                    type="button"
                    className="text-xs font-semibold text-primary cursor-pointer hover:text-primary/80 transition-colors"
                    onClick={() => navigate({ to: '/forgotPassword' })}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full h-12 text-md font-bold cursor-pointer shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]" 
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
              
              <p className="text-sm text-center text-muted-foreground">
                New here?{" "}
                <button 
                  type="button"
                  className="text-primary font-bold hover:underline cursor-pointer"
                  onClick={() => navigate({ to: '/signup' })}
                >
                  Create an account
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}