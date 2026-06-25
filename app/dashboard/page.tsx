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
                  Great to see you, User!
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
                  <AnimatedCounter target={78} />
                </div>
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-accent font-semibold">
                <ArrowUpRight className="w-3 h-3" />
                +5 from last month
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
                  <AnimatedCounter target={3} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">2 looking for members</p>
            </div>
          </div>

          {/* Team Invitations */}
          <div className="group relative overflow-hidden rounded-xl bg-card border border-accent/30 backdrop-blur-sm hover:border-accent/60 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Team Invitations
                </h3>
                <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-secondary/20">
                  <Users className="w-4 h-4 text-accent" />
                </div>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                  <AnimatedCounter target={2} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">New this week</p>
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
                  <AnimatedCounter target={5} />
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
              {[
                {
                  title: 'AI Study Assistant',
                  domain: 'EdTech',
                  members: 4,
                  status: 'In Development',
                  progress: 65,
                },
                {
                  title: 'Campus Event Planner',
                  domain: 'Social',
                  members: 3,
                  status: 'Looking for members',
                  progress: 40,
                },
                {
                  title: 'Placement Analytics',
                  domain: 'Career Tech',
                  members: 5,
                  status: 'Phase 2',
                  progress: 85,
                },
              ].map((project, idx) => (
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
                        <p className="text-xs text-muted-foreground mt-1">{project.domain}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-accent">{project.members} members</div>
                        <div className="text-xs text-muted-foreground mt-1">{project.status}</div>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Upcoming & Activity */}
          <div className="space-y-4">
            {/* Upcoming Deadlines */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20">
                  <Clock className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Upcoming</h3>
                  <p className="text-xs text-muted-foreground">Next deadlines</p>
                </div>
              </div>

              <div className="space-y-2 bg-card border border-accent/20 backdrop-blur-sm rounded-lg p-4 hover:border-accent/50 transition-all">
                {[
                  { event: 'Project Submission', date: 'Jan 30' },
                  { event: 'Internship Interview', date: 'Feb 5' },
                  { event: 'Hackathon Reg', date: 'Feb 15' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 px-2 rounded hover:bg-accent/5 transition-colors"
                  >
                    <span className="text-sm text-foreground">{item.event}</span>
                    <span className="text-xs font-semibold text-accent">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                  <Flame className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Activity</h3>
                  <p className="text-xs text-muted-foreground">Recent events</p>
                </div>
              </div>

              <div className="space-y-2 bg-card border border-primary/20 backdrop-blur-sm rounded-lg p-4 hover:border-primary/50 transition-all">
                {[
                  { action: 'Joined AI Study team', time: '2h ago' },
                  { action: 'Certificate earned', time: '1d ago' },
                  { action: 'Project updated', time: '3d ago' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 px-2 rounded hover:bg-primary/5 transition-colors"
                  >
                    <span className="text-sm text-foreground">{item.action}</span>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Opportunities Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Recommended for You</h2>
            <p className="text-sm text-muted-foreground mt-1">Opportunities tailored to your profile</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Full-Stack Hackathon',
                type: 'Competition',
                match: 92,
                date: 'Feb 20 - 22',
              },
              {
                title: 'Backend Developer Internship',
                type: 'Opportunity',
                match: 88,
                date: 'Mar 15',
              },
              {
                title: 'ML Research Team',
                type: 'Project',
                match: 85,
                date: 'Flexible',
              },
            ].map((opp, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-card to-card border border-secondary/20 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20 p-5 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="inline-block px-2 py-1 rounded text-xs font-semibold text-secondary bg-secondary/20 mb-2">
                        {opp.type}
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                        {opp.title}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                        {opp.match}%
                      </div>
                      <span className="text-xs text-muted-foreground">match</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{opp.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
