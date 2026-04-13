import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { userService } from '@/api/userService'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Loader2, Mail, KeyRound, ArrowLeft, ShieldCheck, Eye, EyeOff } from "lucide-react"

export const Route = createFileRoute('/forgotPassword')({
  component: ForgotPasswordComponent,
})

function ForgotPasswordComponent() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
  })

  const forgotMutation = useMutation({
    mutationFn: () => userService.forgotPassword(formData.email),
    onSuccess: () => {
      toast.success("OTP Sent!", {
        description: `Please check ${formData.email} for your reset code.`
      })
      setStep('otp')
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.response?.data?.message || "Could not find an account with that email."
      })
    }
  })

  const resetMutation = useMutation({
    mutationFn: () => userService.resetPassword(formData),
    onSuccess: () => {
      toast.success("Password Reset Successfully!", {
        description: "You can now log in with your new password."
      })
      navigate({ to: '/login', replace: true })
    },
    onError: () => {
      toast.error("Invalid OTP", {
        description: "Invalid OTP. Try again...",
      })
      
      setTimeout(() => {
        navigate({ to: '/forgotPassword', replace: true })
      }, 2500)
    }
  })

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    forgotMutation.mutate()
  }

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    resetMutation.mutate()
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md"
      >
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
              {step === 'email' ? <Mail className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
            </div>
            <CardTitle className="text-2xl font-bold text-primary tracking-tight">
              {step === 'email' ? 'Reset Password' : 'Verify OTP'}
            </CardTitle>
            <CardDescription className="font-medium">
              {step === 'email' 
                ? "Enter your email to receive a verification code." 
                : `Enter the 6-digit code sent to your email.`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {step === 'email' ? (
                <motion.form 
                  key="email-step"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleEmailSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@vibe.com"
                        className="pl-10 h-11"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 cursor-pointer font-bold" disabled={forgotMutation.isPending}>
                    {forgotMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Send Code"}
                  </Button>
                </motion.form>
              ) : (
                <motion.form 
                  key="otp-step"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleResetSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="otp">One-Time Password</Label>
                    <div className="relative group">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="otp"
                        placeholder="000000"
                        className="pl-10 h-11 tracking-[0.5em] font-bold"
                        maxLength={6}
                        required
                        value={formData.otp}
                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10 h-11"
                        required
                        placeholder="••••••••"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground cursor-pointer hover:text-foreground outline-none"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11 cursor-pointer font-bold shadow-lg shadow-primary/20" disabled={resetMutation.isPending}>
                    {resetMutation.isPending ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Verify & Reset"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full text-xs gap-2 cursor-pointer font-semibold hover:bg-transparent hover:text-primary transition-colors" 
              onClick={() => navigate({ to: '/login' })}
            >
              <ArrowLeft className="h-3 w-3" /> Back to Login
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}