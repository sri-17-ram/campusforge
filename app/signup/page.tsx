'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const handleSignup = () => {
    if (!selectedRole) return

    // Mock signup - route based on role
    if (selectedRole === 'student') {
      router.push('/dashboard')
    } else if (selectedRole === 'faculty') {
      router.push('/faculty/dashboard')
    } else if (selectedRole === 'recruiter') {
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
            <h1 className="text-4xl font-bold text-foreground">Get Started</h1>
            <p className="text-muted-foreground">Create your CampusForge account</p>
          </div>

          {/* Signup Form */}
          <div className="relative z-10 space-y-4 bg-card border border-primary/30 backdrop-blur-sm rounded-xl p-8 hover:border-primary/60 transition-all">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10 bg-muted/30 border-primary/20 focus:border-primary/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 bg-muted/30 border-primary/20 focus:border-primary/60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 bg-muted/30 border-primary/20 focus:border-primary/60"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded mt-1" />
              <span className="text-sm text-foreground">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </label>
          </div>

          {/* Role Selection */}
          <div className="relative z-10">
            <p className="text-sm font-semibold text-foreground mb-3">Select your role</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'student', label: 'Student', color: 'from-blue-500 to-cyan-500' },
                { id: 'faculty', label: 'Faculty', color: 'from-purple-500 to-indigo-500' },
                { id: 'recruiter', label: 'Recruiter', color: 'from-indigo-500 to-blue-500' },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
                    selectedRole === role.id
                      ? `bg-gradient-to-r ${role.color} text-white border-transparent`
                      : 'bg-muted/30 text-foreground border-muted hover:border-primary/60'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSignup}
            disabled={!selectedRole}
            className="w-full bg-gradient-to-r from-primary to-secondary disabled:opacity-50"
          >
            Create Account
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          {/* Login Link */}
          <div className="relative z-10 text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
