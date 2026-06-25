'use client'

import { AppLayout } from '@/components/app-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Briefcase, Users, FileText, TrendingUp, Eye, Plus, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function RecruiterDashboard() {
  const openPositions = [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      applications: 12,
      views: 248,
      postedDate: '5 days ago',
    },
    {
      title: 'Product Manager',
      company: 'InnovateLabs',
      applications: 8,
      views: 156,
      postedDate: '2 days ago',
    },
    {
      title: 'Data Scientist',
      company: 'DataFlow',
      applications: 15,
      views: 342,
      postedDate: '1 day ago',
    },
  ]

  const recentApplications = [
    {
      id: 1,
      candidateName: 'Arjun Singh',
      position: 'Senior Software Engineer',
      appliedDate: 'Jan 22',
      status: 'shortlisted',
      employabilityScore: 82,
    },
    {
      id: 2,
      candidateName: 'Priya Sharma',
      position: 'Product Manager',
      appliedDate: 'Jan 21',
      status: 'pending',
      employabilityScore: 76,
    },
    {
      id: 3,
      candidateName: 'Vikram Patel',
      position: 'Data Scientist',
      appliedDate: 'Jan 20',
      status: 'shortlisted',
      employabilityScore: 88,
    },
  ]

  const hiringPipeline = [
    { stage: 'Applied', count: 35, color: 'from-blue-500 to-cyan-500' },
    { stage: 'Reviewed', count: 28, color: 'from-purple-500 to-indigo-500' },
    { stage: 'Shortlisted', count: 12, color: 'from-indigo-500 to-blue-500' },
    { stage: 'Interviewed', count: 6, color: 'from-cyan-500 to-blue-500' },
    { stage: 'Offered', count: 2, color: 'from-green-500 to-emerald-500' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-accent/20 text-accent'
      case 'shortlisted':
        return 'bg-green-500/20 text-green-600 dark:text-green-400'
      case 'rejected':
        return 'bg-red-500/20 text-red-600 dark:text-red-400'
      default:
        return 'bg-primary/20 text-primary'
    }
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Recruiter Dashboard</h1>
          <p className="text-muted-foreground">Find and manage top talent from campus</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Briefcase, label: 'Open Positions', value: '3', color: 'from-primary to-accent' },
            { icon: FileText, label: 'Applications', value: '35', color: 'from-secondary to-primary' },
            { icon: Users, label: 'Shortlisted', value: '12', color: 'from-accent to-secondary' },
            { icon: TrendingUp, label: 'Offer Rate', value: '16%', color: 'from-primary to-secondary' },
          ].map((metric, idx) => {
            const Icon = metric.icon
            return (
              <div
                key={idx}
                className={`group relative overflow-hidden rounded-xl bg-card border border-primary/20 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 p-6`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-muted-foreground uppercase">{metric.label}</p>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.color} bg-opacity-20`}>
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {metric.value}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Open Positions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Open Positions</h2>
              <Link href="/recruiter/jobs">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {openPositions.map((position, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-lg bg-card border border-secondary/20 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20 p-5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground text-lg group-hover:text-secondary transition-colors">
                          {position.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{position.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex gap-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {position.applications} applications
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {position.views} views
                        </div>
                      </div>
                      <span className="text-muted-foreground text-xs">{position.postedDate}</span>
                    </div>

                    <Button variant="ghost" size="sm" className="text-secondary hover:bg-secondary/10 w-full justify-center">
                      Manage Position
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hiring Pipeline */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Hiring Pipeline</h3>
              <div className="space-y-2">
                {hiringPipeline.map((stage, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{stage.stage}</span>
                      <span className="font-bold text-accent">{stage.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${stage.color}`}
                        style={{ width: `${(stage.count / 35) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Link href="/recruiter/jobs/new" className="block">
                <Button className="w-full bg-gradient-to-r from-secondary to-primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Job
                </Button>
              </Link>
              <Link href="/recruiter/search" className="block">
                <Button variant="outline" className="w-full" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Search Talent
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Recent Applications</h2>
            <Link href="/recruiter/applications">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid gap-3">
            {recentApplications.map((app) => (
              <div
                key={app.id}
                className="group relative overflow-hidden rounded-lg bg-card border border-accent/20 backdrop-blur-sm hover:border-accent/60 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 p-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground group-hover:text-accent transition-colors">
                      {app.candidateName}
                    </p>
                    <p className="text-sm text-muted-foreground">{app.position}</p>
                    <p className="text-xs text-muted-foreground mt-1">Applied {app.appliedDate}</p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold text-accent">{app.employabilityScore}</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                    <div className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${getStatusColor(app.status)}`}>
                      {app.status === 'pending' ? 'Pending' : app.status === 'shortlisted' ? 'Shortlisted' : 'Rejected'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
