'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, CheckCircle, XCircle, Mail, Eye, Phone, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function RecruiterApplicationsPage() {
  const [selectedTab, setSelectedTab] = useState('pending')

  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApps = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await fetch('/api/applications', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success) {
          setApplications(data.applications || [])
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchApps()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-accent" />
      case 'shortlisted':
        return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
      case 'interviewed':
        return <Phone className="w-5 h-5 text-primary" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-accent/20 text-accent'
      case 'shortlisted':
        return 'bg-green-500/20 text-green-600 dark:text-green-400'
      case 'interviewed':
        return 'bg-primary/20 text-primary'
      case 'rejected':
        return 'bg-red-500/20 text-red-600 dark:text-red-400'
      default:
        return ''
    }
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Applications</h1>
          <p className="text-muted-foreground">Track and manage all job applications</p>
        </div>

        {/* Status Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Pending', count: 1, icon: Clock, color: 'from-accent to-primary' },
            { label: 'Shortlisted', count: 2, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
            { label: 'Interviewed', count: 2, icon: Phone, color: 'from-primary to-secondary' },
            { label: 'Rejected', count: 1, icon: XCircle, color: 'from-red-500 to-rose-500' },
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl bg-card border border-primary/20 backdrop-blur-sm hover:border-primary/60 transition-all p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.count}</p>
                  </div>
                  <Icon className="w-8 h-8 text-primary/40" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Applications List */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4 bg-muted/30 border border-muted rounded-lg p-1">
            <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded text-xs">
              Pending
            </TabsTrigger>
            <TabsTrigger value="shortlisted" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded text-xs">
              Shortlist
            </TabsTrigger>
            <TabsTrigger value="interviewed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded text-xs">
              Interview
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded text-xs">
              Rejected
            </TabsTrigger>
          </TabsList>

          {['pending', 'shortlisted', 'interviewed', 'rejected'].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4 mt-6">
              {applications.filter(a => a.status === status).length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No applications in this category</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {applications.filter(a => a.status.toLowerCase() === status).map((app) => (
                    <div
                      key={app.id}
                      className="group relative overflow-hidden rounded-lg bg-card border border-secondary/20 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20 p-5"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <div className="relative z-10 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(app.status.toLowerCase())}
                              <h3 className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors">
                                {app.student?.user?.name || 'Unknown Candidate'}
                              </h3>
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">{app.job?.title || 'Unknown Position'}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold text-accent">{app.student?.score || 0}</p>
                            <p className="text-xs text-muted-foreground">Score</p>
                          </div>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-muted/30">
                          <div className="flex flex-wrap gap-2">
                            {(app.student?.skills || []).map((skill: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary"
                              >
                                {skill.name || skill}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              Applied {new Date(app.createdAt).toLocaleDateString()}
                            </div>
                            <div className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(app.status.toLowerCase())}`}>
                              {app.status}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Link href={`/recruiter/candidate/${app.id}`} className="flex-1">
                              <Button variant="outline" size="sm" className="w-full">
                                <Eye className="w-4 h-4 mr-2" />
                                View Profile
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Mail className="w-4 h-4 mr-2" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  )
}
