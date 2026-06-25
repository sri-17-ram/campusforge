'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Briefcase, MapPin, DollarSign, Users, Eye, FileText, Plus, Edit2, Trash2, Clock } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function RecruiterJobsPage() {
  const [showForm, setShowForm] = useState(false)

  const jobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp India',
      location: 'Bangalore',
      salary: '₹15-20L',
      applicants: 12,
      views: 248,
      postedDate: '5 days ago',
      skills: ['React', 'Node.js', 'AWS'],
      active: true,
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'InnovateLabs',
      location: 'Mumbai',
      salary: '₹12-18L',
      applicants: 8,
      views: 156,
      postedDate: '2 days ago',
      skills: ['Product Strategy', 'Analytics', 'Leadership'],
      active: true,
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'DataFlow',
      location: 'Pune',
      salary: '₹10-15L',
      applicants: 15,
      views: 342,
      postedDate: '1 day ago',
      skills: ['Python', 'Machine Learning', 'SQL'],
      active: true,
    },
    {
      id: 4,
      title: 'UX/UI Designer',
      company: 'DesignHub',
      location: 'Hyderabad',
      salary: '₹8-12L',
      applicants: 5,
      views: 89,
      postedDate: '10 days ago',
      skills: ['Figma', 'UI Design', 'Prototyping'],
      active: false,
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Job Postings</h1>
            <p className="text-muted-foreground">Manage your open positions and attract top talent</p>
          </div>
          <Link href="/recruiter/jobs/new">
            <Button className="bg-gradient-to-r from-primary to-secondary">
              <Plus className="w-4 h-4 mr-2" />
              Post Job
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Active Positions', value: '3', icon: Briefcase, color: 'from-primary to-accent' },
            { label: 'Total Applications', value: '35', icon: FileText, color: 'from-secondary to-primary' },
            { label: 'Total Views', value: '745', icon: Eye, color: 'from-accent to-secondary' },
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
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <Icon className="w-8 h-8 text-primary/40" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Jobs Grid */}
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="group relative overflow-hidden rounded-xl bg-card border border-secondary/20 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10 p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Briefcase className="w-6 h-6 text-secondary" />
                      <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors">
                        {job.title}
                      </h3>
                      {job.active && (
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-600 dark:text-green-400">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/recruiter/jobs/${job.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    {job.applicants} applicants
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="w-4 h-4" />
                    {job.views} views
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-muted/30">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Posted {job.postedDate}
                    </div>
                    <Link href={`/recruiter/jobs/${job.id}/applicants`}>
                      <Button variant="ghost" size="sm" className="text-secondary hover:bg-secondary/10">
                        View Applicants
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
