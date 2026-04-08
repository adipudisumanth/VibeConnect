import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import  axiosClient  from '@/api/axiosClient' // Adjust this path to your axios instance
import { AuthResponse } from '@/api/userService'

export const Route = createFileRoute('/login')({
  component: LoginComponent,
})

function LoginComponent() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // 2. The Login Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Calling your API function
      const response = await axiosClient.post("/api/users/login", formData);
      const data: AuthResponse = response.data;

      // 3. Handle Success (Save token and redirect)
      localStorage.setItem('auth_token', data.token)
      console.log('User logged in:', data.userId)
      
      // Navigate to home/dashboard
      navigate({ to: '/' })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <form 
        onSubmit={handleLogin}
        className="p-8 border rounded-lg shadow-md bg-card w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary">Login to VibeConnect</h2>
        
        {error && (
          <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-2 border rounded bg-input text-foreground"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-2 border rounded bg-input text-foreground"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  )
}

// Types (Keep these at the bottom or in a types file)
export interface UserResponseDTO {
  id: number;
  email: string;
  fullName: string;
  role: string;
  skillsAndVibes: string;
}
