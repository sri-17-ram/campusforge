'use client'

import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, Users, Eye, FileText, Target, Calendar, CheckCircle2, XCircle, TrendingUp, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Line, Cell } from 'recharts'
import Link from 'next/link'

export default function RecruiterDashboard() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await fetch('/api/recruiter/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success) {
          setAnalytics(data.analytics)
          setActivities(data.activities)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full min-h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    )
  }

  if (!analytics) return <AppLayout><div className="p-8 text-center">Failed to load analytics</div></AppLayout>

  const STATS = [
    { label: 'Total Jobs', value: analytics.totalJobs, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Jobs', value: analytics.activeJobs, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Applications', value: analytics.totalApplications, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Interviews Scheduled', value: analytics.interviewsScheduled, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Hired Candidates', value: analytics.hired, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Profile Views', value: analytics.companyViews, icon: Eye, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  ]

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">Recruiter Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time insights and analytics for your hiring pipelines.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-card px-4 py-2 rounded-lg border border-primary/20 shadow-sm flex items-center gap-3">
              <span className="text-sm text-muted-foreground font-medium">Profile Completion</span>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${analytics.profileCompletion}%` }}></div>
              </div>
              <span className="text-sm font-bold text-primary">{analytics.profileCompletion}%</span>
            </div>
            <Link href="/recruiter/jobs"><button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Manage Jobs</button></Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i} className="border border-muted hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm shadow-sm">
                <CardContent className="p-5 flex flex-col justify-center items-center text-center space-y-2">
                  <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart: Monthly Hiring */}
          <Card className="lg:col-span-2 border border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary"/> Hiring Velocity (6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={analytics.monthlyHiring}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10}/>
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dx={-10}/>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="applications" fill="url(#colorApps)" stroke="hsl(var(--primary))" strokeWidth={2} name="Applications" />
                    <Bar dataKey="hired" barSize={20} fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Hires" />
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Hiring Funnel */}
          <Card className="border border-primary/10 shadow-md flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Target className="w-5 h-5 text-secondary"/> Recruitment Funnel</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.funnel} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted))" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--foreground))', fontWeight: 600 }} width={80} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}/>
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={24} name="Candidates">
                      {
                        analytics.funnel.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={index === analytics.funnel.length - 1 ? 'hsl(var(--secondary))' : 'hsl(var(--primary))'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-between items-center px-4 py-3 bg-muted/30 rounded-lg text-sm border border-muted">
                <span className="text-muted-foreground font-medium">Offer Acceptance Ratio</span>
                <span className="font-bold text-foreground">
                  {analytics.offers > 0 ? Math.round((analytics.hired / analytics.offers) * 100) : 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Clock className="w-5 h-5 text-primary"/> Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4">No recent activities.</p>
                ) : (
                  activities.map((activity, idx) => (
                    <div key={activity.id} className="flex gap-4 items-start">
                      <div className="relative mt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                        {idx !== activities.length - 1 && <div className="absolute top-3 left-[4px] w-[2px] h-full -ml-[1px] bg-border"></div>}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.details}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">{new Date(activity.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
