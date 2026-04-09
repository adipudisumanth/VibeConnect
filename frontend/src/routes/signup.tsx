import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { userService, AuthResponse } from '@/api/userService'

// shadcn/ui components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // npx shadcn@latest add textarea
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // npx shadcn@latest add select

// Icons
import { Loader2, User, Mail, Lock, Sparkles, ShieldCheck } from "lucide-react"

export const Route = createFileRoute('/signup')({
  beforeLoad: ({ navigate }) => {
    if (localStorage.getItem('auth_token')) {
      throw navigate({ to: '/' })
    }
  },
  component: SignupComponent,
})

function SignupComponent() {
  const navigate = useNavigate()
  
  // State matching your UserRequestDTO
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '', 
    skillsAndVibes: '',
  })

  // TanStack Query Mutation
  const signupMutation = useMutation({
    mutationFn: (data: typeof formData) => userService.register(data),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('auth_token', data.token)
      // data.userId is the UserResponseDTO in your interface
      console.log(`Welcome, ${data.userId.fullName}!`)
      navigate({ to: '/' })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signupMutation.mutate(formData)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background py-12 px-4">
      {/* Decorative Background */}
      <div className="absolute top-[-5%] right-[-5%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-5%] left-[-5%] h-[50%] w-[50%] rounded-full bg-emerald-500/5 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="z-10 w-full max-w-lg"
      >
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-1">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg mb-2">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-primary">
              Join VibeConnect
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              Create your profile and start connecting
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <AnimatePresence mode="wait">
                {signupMutation.isError && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                      <AlertDescription>
                        {(signupMutation.error as any)?.response?.data?.message || "Registration failed. Try again."}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      className="pl-10 h-11"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Role Selector */}
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="h-11">
                      <div className="flex items-center gap-2 cursor-pointer">
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Select Role" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FOUNDER">FOUNDER</SelectItem>
                      <SelectItem value="VIBECODER">VIBECODER</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 h-11"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10 h-11"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              {/* Skills & Vibes */}
              <div className="space-y-2">
                <Label htmlFor="vibes">Skills & Vibes</Label>
                <Textarea
                  id="vibes"
                  placeholder="Tell us what you bring to the table..."
                  className="min-h-[100px] bg-transparent focus-visible:ring-primary/20"
                  value={formData.skillsAndVibes}
                  onChange={(e) => setFormData({ ...formData, skillsAndVibes: e.target.value })}
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full h-11 font-bold cursor-pointer shadow-lg shadow-primary/20" 
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <button 
                  type="button"
                  className="text-primary cursor-pointer font-bold hover:underline"
                  onClick={() => navigate({ to: '/login' })}
                >
                  Sign In
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}