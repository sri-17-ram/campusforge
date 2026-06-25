'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (role: string) => {
    // Mock login - route based on role
    if (role === 'student') {
      router.push('/dashboard')
    } else if (role === 'faculty') {
      router.push('/faculty/dashboard')
    } else if (role === 'recruiter') {
      router.push('/recruiter/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-foreground">CampusForge</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-0">
        <div className="w-full max-w-md space-y-6">
          {/* Decorative Elements */}
          <div className="absolute top-20 -left-1/4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 -right-1/4 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>

          <div className="relative z-10 space-y-2 text-center">
            <h1 className="text-4xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your CampusForge account</p>
          </div>

          {/* Login Form */}
          <div className="relative z-10 space-y-4 bg-card border border-primary/30 backdrop-blur-sm rounded-xl p-8 hover:border-primary/60 transition-all">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-muted/30 border-primary/20 focus:border-primary/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-muted/30 border-primary/20 focus:border-primary/60"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-foreground">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:underline">Forgot password?</a>
            </div>

            <Button className="w-full bg-gradient-to-r from-primary to-secondary">
              Sign In
            </Button>
          </div>

          {/* Role Selection */}
          <div className="relative z-10">
            <p className="text-sm text-muted-foreground text-center mb-4">Select your role to continue</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'student', label: 'Student', color: 'from-blue-500 to-cyan-500' },
                { id: 'faculty', label: 'Faculty', color: 'from-purple-500 to-indigo-500' },
                { id: 'recruiter', label: 'Recruiter', color: 'from-indigo-500 to-blue-500' },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleLogin(role.id)}
                  className={`px-4 py-3 rounded-lg bg-gradient-to-r ${role.color} text-white font-semibold hover:shadow-lg transition-all`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="relative z-10 text-center">
            <p className="text-muted-foreground text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
