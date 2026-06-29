'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
  User,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [selectedRole, setSelectedRole] = useState('STUDENT')

  const handleSignup = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert('Please fill all fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        alert(data.message)
        return
      }

      // alert('Registration Successful')
      router.push('/login')
    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto h-16 flex items-center px-6 gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">
            CampusForge
          </h1>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center px-6">

        <div className="w-full max-w-md space-y-6">

          <div className="text-center">
            <h1 className="text-4xl font-bold">
              Create Account
            </h1>

            <p className="text-muted-foreground mt-2">
              Join CampusForge
            </p>
          </div>

          <div className="space-y-4 bg-card border rounded-xl p-8">

            <div>
              <label>Name</label>

              <div className="relative mt-2">

                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>

                <Input
                  className="pl-10"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e)=>
                    setFormData({
                      ...formData,
                      name:e.target.value,
                    })
                  }
                />

              </div>
            </div>

            <div>
              <label>Email</label>

              <div className="relative mt-2">

                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>

                <Input
                  className="pl-10"
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e)=>
                    setFormData({
                      ...formData,
                      email:e.target.value,
                    })
                  }
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
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e)=>
                    setFormData({
                      ...formData,
                      password:e.target.value,
                    })
                  }
                />

              </div>
            </div>

            <div>
              <label>Confirm Password</label>

              <div className="relative mt-2">

                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>

                <Input
                  className="pl-10"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e)=>
                    setFormData({
                      ...formData,
                      confirmPassword:e.target.value,
                    })
                  }
                />

              </div>
            </div>

            <div>

              <label className="font-medium">
                Select Role
              </label>

              <div className="grid grid-cols-3 gap-3 mt-3">

                {[
                  'STUDENT',
                  'FACULTY',
                  'RECRUITER',
                ].map((role)=>(
                  <button
                    key={role}
                    onClick={()=>setSelectedRole(role)}
                    className={`rounded-lg border p-3 font-semibold transition

                    ${
                      selectedRole===role
                      ?'bg-primary text-primary-foreground'
                      :'bg-background'
                    }
                    `}
                  >
                    {role}
                  </button>
                ))}

              </div>

            </div>

            <Button
              onClick={handleSignup}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating Account...' : 'Create Account'}

              <ArrowRight className="ml-2 h-4 w-4"/>

            </Button>

          </div>

          <p className="text-center text-sm">

            Already have an account?

            <Link
              href="/login"
              className="ml-2 text-primary font-semibold"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}