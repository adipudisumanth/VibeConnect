import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { userService } from '@/api/userService'

// shadcn/ui components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Icons
import { Loader2, Mail, KeyRound, ArrowLeft, ShieldCheck, Eye, EyeOff } from "lucide-react"

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

  // Mutation 1: Request OTP
  const forgotMutation = useMutation({
    mutationFn: () => userService.forgotPassword(formData.email),
    onSuccess: () => setStep('otp'),
  })

  // Mutation 2: Reset with OTP
  const resetMutation = useMutation({
    mutationFn: () => userService.resetPassword(formData),
    onSuccess: () => {
      // Logic for successful reset could go here (e.g., toast notification)
      navigate({ to: '/login' })
    },
    onError: () => {
      // Per your requirement: navigate to login on wrong OTP/error after showing message
      setTimeout(() => navigate({ to: '/login' }), 2000)
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
      {/* Background Effect */}
      <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md"
      >
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              {step === 'email' ? <Mail className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              {step === 'email' ? 'Forgot Password?' : 'Verify Identity'}
            </CardTitle>
            <CardDescription>
              {step === 'email' 
                ? "Enter your email and we'll send you a reset code." 
                : `We've sent a 6-digit code to ${formData.email}`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {/* Step 1: Email Input */}
              {step === 'email' && (
                <motion.form 
                  key="email-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleEmailSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@vibe.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full cursor-pointer" disabled={forgotMutation.isPending}>
                    {forgotMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "Send Reset Link"}
                  </Button>
                </motion.form>
              )}

              {/* Step 2: OTP & New Password */}
              {step === 'otp' && (
                <motion.form 
                  key="otp-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleResetSubmit}
                  className="space-y-4"
                >
                  {resetMutation.isError && (
                    <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 mb-4">
                      <AlertDescription>
                        Invalid OTP. Try again later. Redirecting to login...
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="otp">One-Time Password (OTP)</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="otp"
                        placeholder="123456"
                        className="pl-10 tracking-[0.5em] font-bold"
                        maxLength={6}
                        required
                        value={formData.otp}
                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                        required
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full cursor-pointer" disabled={resetMutation.isPending}>
                    {resetMutation.isPending ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Reset Password"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full text-xs gap-2 cursor-pointer hover:bg-transparent hover:text-primary transition-colors" 
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