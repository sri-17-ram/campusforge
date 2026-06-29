'use client'

import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Award,
  CheckCircle,
  Clock,
  Flame,
  TrendingUp,
  Users,
  Briefcase,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Animated counter component
function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.floor(progress * target))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [target, duration])

  return <span>{count}</span>
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const res = await fetch('/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (data.success) {
          setUser(data.user)
          setProfileCompletion(data.profileCompletion || 0)
        } else {
          router.push('/login')
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [router])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    )
  }

  const student = user?.student || {}
  const projectsCount = student.projects?.length || 0
  const certificatesCount = student.certificates?.length || 0
  const applicationsCount = student.applications?.length || 0
  const score = student.score || 0

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Premium Gradient Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 border border-primary/30 backdrop-blur-md p-8 md:p-12">
          {/* Animated gradient background effect */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 -left-1/2 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 -right-1/2 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-sm font-semibold text-accent">Welcome back</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  Great to see you, {user?.name || 'User'}!
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Your innovation journey is progressing beautifully. Let&apos;s keep building amazing things together.
                </p>
              </div>
              <div className="hidden md:flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent/50 opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Key Metrics - Premium Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Employability Score */}
          <div className="group relative overflow-hidden rounded-xl bg-card border border-primary/30 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Employability Score
                </h3>
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  <AnimatedCounter target={score} />
                </div>
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-accent font-semibold">
                <ArrowUpRight className="w-3 h-3" />
                Based on your profile
              </div>
            </div>
          </div>

          {/* Active Projects */}
          <div className="group relative overflow-hidden rounded-xl bg-card border border-secondary/30 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/20 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Active Projects
                </h3>
                <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20">
                  <Briefcase className="w-4 h-4 text-secondary" />
                </div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  <AnimatedCounter target={projectsCount} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Your listed projects</p>
            </div>
          </div>

          {/* Applications */}
          <div className="group relative overflow-hidden rounded-xl bg-card border border-accent/30 backdrop-blur-sm hover:border-accent/60 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Applications
                </h3>
                <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-secondary/20">
                  <Users className="w-4 h-4 text-accent" />
                </div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                  <AnimatedCounter target={applicationsCount} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Job applications</p>
            </div>
          </div>

          {/* Certificates */}
          <div className="group relative overflow-hidden rounded-xl bg-card border border-primary/30 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Certificates
                </h3>
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                  <Award className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  <AnimatedCounter target={certificatesCount} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Keep building!</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Projects Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Active Projects</h2>
                <p className="text-sm text-muted-foreground mt-1">Your ongoing innovation initiatives</p>
              </div>
              <Link href="/projects">
                <Button variant="outline" size="sm" className="hover:border-primary/60 hover:bg-primary/5">
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {student.projects?.length > 0 ? (
                student.projects.map((project: any, idx: number) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-lg bg-card border border-primary/20 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 p-4 cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-card border rounded-lg text-muted-foreground">
                  No projects yet. Start building!
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Notifications & Activity */}
          <div className="space-y-4">
            {/* Notifications Feed */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                  <AlertCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  <p className="text-xs text-muted-foreground">Recent updates</p>
                </div>
              </div>

              <div className="space-y-2">
                {user.notifications?.length > 0 ? (
                  user.notifications.slice(0, 5).map((notif: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border backdrop-blur-sm transition-all ${
                        !notif.read ? 'bg-primary/5 border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]' : 'bg-card border-muted/30 opacity-75'
                      }`}
                    >
                      <h4 className={`text-sm ${!notif.read ? 'font-bold text-foreground' : 'font-medium text-foreground'}`}>
                        {notif.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                      <div className="text-[10px] text-muted-foreground mt-2 text-right">
                        {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-center text-muted-foreground p-4 bg-card border rounded-lg">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
