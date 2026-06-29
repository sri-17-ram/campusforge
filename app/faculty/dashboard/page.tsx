'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, FileText, Award, Briefcase, TrendingUp, Bell, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function FacultyDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [charts, setCharts] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }
      try {
        const res = await fetch('/api/faculty/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success) {
          setStats(data.stats)
          setCharts(data.charts)
          setActivities(data.activities)
        } else if (res.status === 401) {
          window.location.href = '/login'
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    )
  }

  const COLORS = ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444']

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Faculty Dashboard</h1>
            <p className="text-muted-foreground mt-2">Overview of student performance and reviews</p>
          </div>
          <div className="flex gap-3">
            <Link href="/faculty/reviews">
              <Button className="bg-gradient-to-r from-primary to-accent">Review Center</Button>
            </Link>
            <Link href="/faculty/students">
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">Manage Students</Button>
            </Link>
          </div>
        </div>

        {/* High Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Total Students', value: stats?.totalStudents || 0, color: 'from-blue-500 to-cyan-400' },
            { icon: TrendingUp, label: 'Placement Ready', value: stats?.placementReadyStudents || 0, color: 'from-emerald-500 to-green-400' },
            { icon: FileText, label: 'Pending Projects', value: stats?.projectsPendingReview || 0, color: 'from-amber-500 to-orange-400' },
            { icon: Award, label: 'Pending Certificates', value: stats?.pendingCertificates || 0, color: 'from-purple-500 to-pink-400' },
          ].map((metric, idx) => {
            const Icon = metric.icon
            return (
              <div key={idx} className="relative overflow-hidden rounded-xl bg-card border border-muted p-6 hover:shadow-lg transition-all duration-300">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color} opacity-10 rounded-full blur-3xl -mr-10 -mt-10`}></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{metric.label}</p>
                    <h3 className="text-3xl font-bold text-foreground">{metric.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} bg-opacity-10 shadow-sm`}>
                    <Icon className="w-6 h-6 text-white mix-blend-overlay" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-muted bg-card shadow-sm">
              <CardHeader>
                <CardTitle>Students by Department</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-end justify-around gap-2 pt-10">
                  {charts?.studentsByDepartment?.length > 0 ? charts.studentsByDepartment.map((dept: any, idx: number) => {
                    const maxVal = Math.max(...charts.studentsByDepartment.map((d: any) => d.value));
                    const heightPct = (dept.value / maxVal) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center justify-end h-full w-full group relative">
                        <div className="absolute -top-8 bg-card border border-muted px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          {dept.value} Students
                        </div>
                        <div className="w-full max-w-[40px] bg-primary rounded-t-md transition-all duration-500" style={{ height: `${heightPct}%` }}></div>
                        <span className="text-[10px] text-muted-foreground mt-2 text-center break-words w-full h-8 overflow-hidden">{dept.name.substring(0, 10)}</span>
                      </div>
                    )
                  }) : (
                    <div className="text-muted-foreground w-full text-center pb-20">No department data available.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-muted bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Top Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full flex flex-col justify-center gap-3">
                    {charts?.topSkills?.length > 0 ? charts.topSkills.map((skill: any, idx: number) => {
                      const maxVal = Math.max(...charts.topSkills.map((s: any) => s.value));
                      const widthPct = (skill.value / maxVal) * 100;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{skill.name}</span>
                            <span className="text-muted-foreground">{skill.value}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${widthPct}%`, backgroundColor: COLORS[idx % COLORS.length] }}></div>
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="text-muted-foreground text-center">No skill data available.</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-muted bg-card shadow-sm">
                <CardHeader>
                  <CardTitle>Resume & Applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Students with Resume</span>
                      <span className="font-medium text-foreground">{stats?.studentsWithResume}/{stats?.totalStudents}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${(stats?.studentsWithResume / stats?.totalStudents) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Projects Verified</span>
                      <span className="font-medium text-foreground">{stats?.projectsSubmitted - stats?.projectsPendingReview}/{stats?.projectsSubmitted}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-secondary h-full rounded-full" style={{ width: `${((stats?.projectsSubmitted - stats?.projectsPendingReview) / stats?.projectsSubmitted) * 100}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Total Job Applications</span>
                      <span className="font-medium text-foreground">{stats?.totalApplications}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Activity Feed Sidebar */}
          <div className="space-y-6">
            <Card className="border-muted bg-card shadow-sm h-full max-h-[800px] flex flex-col">
              <CardHeader className="pb-3 border-b border-muted">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <CardTitle>Live Activity Feed</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0">
                {activities.length > 0 ? (
                  <div className="divide-y divide-muted">
                    {activities.map((activity: any, idx: number) => (
                      <div key={idx} className="p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {activity.user?.avatar ? (
                              <Image width={500} height={500} src={activity.user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                            ) : (
                              activity.user?.name?.[0]?.toUpperCase() || 'U'
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-foreground">
                              <span className="font-semibold">{activity.user?.name}</span> {activity.action}
                            </p>
                            {activity.details && (
                              <p className="text-xs text-muted-foreground mt-0.5">{activity.details}</p>
                            )}
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {new Date(activity.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No recent activity.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
