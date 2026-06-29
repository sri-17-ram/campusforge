'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }

    try {
      setLoading(true)

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        alert(data.message)
        return
      }

      // Save user information
      localStorage.setItem('user', JSON.stringify(data.user))

      // Optional (JWT also stored in HTTP-only cookie)
      if (data.token) {
        localStorage.setItem('token', data.token)
      }

      // alert('Login Successful')
      switch (data.user.role) {
        case 'STUDENT':
          router.push('/dashboard')
          break

        case 'FACULTY':
          router.push('/faculty/dashboard')
          break

        case 'RECRUITER':
          router.push('/recruiter/dashboard')
          break

        default:
          router.push('/')
      }
    } catch (err) {
      console.error(err)
      alert('Unable to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}

      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto h-16 flex items-center px-6 gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">
            CampusForge
          </h1>
        </div>
      </div>

      {/* Main */}

      <div className="flex-1 flex justify-center items-center px-6">

        <div className="w-full max-w-md space-y-6">

          <div className="text-center">

            <h1 className="text-4xl font-bold">
              Welcome Back
            </h1>

            <p className="text-muted-foreground mt-2">
              Login to your CampusForge account
            </p>

          </div>

          <div className="space-y-5 rounded-xl border bg-card p-8">

            <div>

              <label>Email</label>

              <div className="relative mt-2">

                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>

                <Input
                  className="pl-10"
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                />

              </div>

            </div>

            <div>

              <label>Password</label>

              <div className="relative mt-2">

                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>

                <Input
                  className="pl-10"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />

              </div>

            </div>

            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Signing In...' : 'Sign In'}

              <ArrowRight className="ml-2 h-4 w-4"/>

            </Button>

          </div>

          <p className="text-center text-sm">

            Don't have an account?

            <Link
              href="/signup"
              className="ml-2 text-primary font-semibold"
            >
              Sign Up
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}