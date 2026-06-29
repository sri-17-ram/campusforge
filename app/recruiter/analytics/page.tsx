'use client'

import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart as BarIcon, Target, Users, TrendingUp, PieChart as PieIcon, LineChart as LineIcon, Briefcase } from 'lucide-react'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Lazy load Recharts to reduce initial bundle size (Code Splitting)
const ComposedChart = dynamic(() => import('recharts').then(mod => mod.ComposedChart), { ssr: false })
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false })
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false })
const RadarChart = dynamic(() => import('recharts').then(mod => mod.RadarChart), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false })
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false })
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false })
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false })
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false })
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false })
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false })
const PolarGrid = dynamic(() => import('recharts').then(mod => mod.PolarGrid), { ssr: false })
const PolarAngleAxis = dynamic(() => import('recharts').then(mod => mod.PolarAngleAxis), { ssr: false })
const PolarRadiusAxis = dynamic(() => import('recharts').then(mod => mod.PolarRadiusAxis), { ssr: false })
const Radar = dynamic(() => import('recharts').then(mod => mod.Radar), { ssr: false })

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function AnalyticsDashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await fetch('/api/recruiter/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success) {
          setAnalytics(data.analytics)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full min-h-[600px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    )
  }

  if (!analytics) return <AppLayout><div className="p-8 text-center text-muted-foreground">Failed to load analytics data.</div></AppLayout>

  return (
    <AppLayout>
      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep insights into your hiring funnel and applicant demographics.</p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-muted hover:border-primary/50 transition-colors shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Applications</p>
                <h3 className="text-3xl font-bold text-foreground mt-2">{analytics.totalApplications}</h3>
              </div>
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Users className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="border border-muted hover:border-emerald-500/50 transition-colors shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Offer Acceptance Rate</p>
                <h3 className="text-3xl font-bold text-foreground mt-2">{analytics.offerAcceptanceRate}%</h3>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-500">
                <Target className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
          <Card className="border border-muted hover:border-blue-500/50 transition-colors shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Interview Success</p>
                <h3 className="text-3xl font-bold text-foreground mt-2">{analytics.interviewSuccessRate}%</h3>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-full text-blue-500">
                <TrendingUp className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Trends & Monthly Hiring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-muted shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LineIcon className="w-5 h-5 text-primary"/> Application Trends (30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={analytics.applicationTrends}>
                    <defs>
                      <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} dy={10} minTickGap={30} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-10} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}/>
                    <Area type="monotone" dataKey="applications" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorTrend)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-muted shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarIcon className="w-5 h-5 text-secondary"/> Monthly Hiring Velocity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={analytics.monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-10} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}/>
                    <Bar yAxisId="left" dataKey="applications" barSize={30} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Applications" />
                    <Line yAxisId="right" type="monotone" dataKey="hired" stroke="hsl(var(--secondary))" strokeWidth={3} name="Hired" dot={{r: 4}} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funnel & Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-muted shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><PieIcon className="w-5 h-5 text-accent"/> Hiring Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.funnel} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted))" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--foreground))', fontSize: 10, fontWeight: 600 }} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}/>
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} name="Candidates">
                      {
                        analytics.funnel.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-muted shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-primary"/> Top Applicant Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {analytics.topSkills.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={analytics.topSkills}>
                      <PolarGrid stroke="hsl(var(--muted))" />
                      <PolarAngleAxis dataKey="name" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                      <Radar name="Skills" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}/>
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">No skill data available</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-muted shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-secondary"/> Top Colleges (by Email Domain)</CardTitle>
              <CardDescription>Where your applicants are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.topColleges} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted))" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}/>
                    <Bar dataKey="value" fill="hsl(var(--secondary))" radius={[0, 4, 4, 0]} barSize={24} name="Applicants" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-muted shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-accent"/> Top Departments</CardTitle>
              <CardDescription>Most popular branches amongst applicants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.topDepartments} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                      {analytics.topDepartments.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </AppLayout>
  )
}
