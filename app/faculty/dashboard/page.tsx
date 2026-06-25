'use client'

import { AppLayout } from '@/components/app-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, Users, Award, FileText, MessageSquare, TrendingUp, Eye } from 'lucide-react'
import Link from 'next/link'

export default function FacultyDashboard() {
  const projectsUnderReview = [
    {
      title: 'AI Study Assistant',
      students: 4,
      status: 'Pending Review',
      submittedDate: 'Jan 15',
      daysAgo: '5 days',
      rating: null,
    },
    {
      title: 'Campus Event Planner',
      students: 3,
      status: 'In Progress',
      submittedDate: 'Jan 20',
      daysAgo: '1 day',
      rating: 4.5,
    },
    {
      title: 'Placement Analytics',
      students: 5,
      status: 'Completed',
      submittedDate: 'Jan 10',
      daysAgo: '10 days',
      rating: 4.8,
    },
  ]

  const mentorships = [
    { name: 'Arjun Singh', year: '3rd Year', expertise: 'Machine Learning', status: 'Active' },
    { name: 'Priya Sharma', year: '2nd Year', expertise: 'Frontend Dev', status: 'Active' },
    { name: 'Neha Gupta', year: '4th Year', expertise: 'Backend Dev', status: 'Completed' },
  ]

  const endorsements = [
    { skill: 'Python', count: 12, isPending: true },
    { skill: 'React', count: 8, isPending: true },
    { skill: 'Leadership', count: 5, isPending: false },
  ]

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Faculty Dashboard</h1>
          <p className="text-muted-foreground">Mentor, review, and guide student innovation</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: 'Projects to Review', value: '3', color: 'from-primary to-accent' },
            { icon: Users, label: 'Active Mentorships', value: '2', color: 'from-secondary to-primary' },
            { icon: Award, label: 'Endorsements Given', value: '5', color: 'from-accent to-secondary' },
            { icon: TrendingUp, label: 'Student Progress', value: '85%', color: 'from-primary to-secondary' },
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
          {/* Projects Under Review */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Projects Under Review</h2>
              <Link href="/faculty/reviews">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {projectsUnderReview.map((project, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-lg bg-card border border-secondary/20 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20 p-5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground text-lg group-hover:text-secondary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.students} students • Submitted {project.daysAgo}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {project.rating && (
                          <div className="text-right">
                            <div className="text-lg font-bold text-accent">{project.rating}</div>
                            <p className="text-xs text-muted-foreground">Rating</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${
                          project.status === 'Pending Review' ? 'bg-accent/20 text-accent' :
                          project.status === 'In Progress' ? 'bg-primary/20 text-primary' :
                          'bg-green-500/20 text-green-600 dark:text-green-400'
                        }`}>
                          {project.status}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-secondary hover:bg-secondary/10 gap-1">
                        <Eye className="w-4 h-4" />
                        Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Mentorships */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Active Mentorships</h3>
              <div className="space-y-3">
                {mentorships.filter(m => m.status === 'Active').map((mentor, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-lg bg-card border border-accent/20 backdrop-blur-sm hover:border-accent/60 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 p-4"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 space-y-2">
                      <p className="font-semibold text-foreground group-hover:text-accent transition-colors">
                        {mentor.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{mentor.year}</p>
                      <p className="text-sm text-accent font-medium">{mentor.expertise}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Endorsements */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Endorsements</h3>
              <div className="space-y-2">
                {endorsements.map((endorsement, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-card border border-muted hover:border-primary/40 transition-all"
                  >
                    <span className="text-sm font-medium text-foreground">{endorsement.skill}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      endorsement.isPending
                        ? 'bg-accent/20 text-accent'
                        : 'bg-green-500/20 text-green-600 dark:text-green-400'
                    }`}>
                      {endorsement.isPending ? 'Pending' : 'Given'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Link href="/faculty/reviews" className="block">
                <Button className="w-full bg-gradient-to-r from-secondary to-primary" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Review Projects
                </Button>
              </Link>
              <Link href="/faculty/students" className="block">
                <Button variant="outline" className="w-full" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  View Students
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
