'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Award, TrendingUp, MessageSquare, Eye } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function FacultyStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const students = [
    {
      id: 1,
      name: 'Arjun Singh',
      year: '4th Year',
      gpa: 8.5,
      employabilityScore: 82,
      endorsements: 12,
      certificates: 4,
      projects: 5,
    },
    {
      id: 2,
      name: 'Priya Sharma',
      year: '4th Year',
      gpa: 8.8,
      employabilityScore: 76,
      endorsements: 8,
      certificates: 3,
      projects: 3,
    },
    {
      id: 3,
      name: 'Vikram Patel',
      year: '3rd Year',
      gpa: 9.1,
      employabilityScore: 88,
      endorsements: 15,
      certificates: 5,
      projects: 6,
    },
    {
      id: 4,
      name: 'Neha Gupta',
      year: '3rd Year',
      gpa: 8.3,
      employabilityScore: 79,
      endorsements: 10,
      certificates: 3,
      projects: 4,
    },
    {
      id: 5,
      name: 'Rahul Kumar',
      year: '2nd Year',
      gpa: 8.0,
      employabilityScore: 71,
      endorsements: 5,
      certificates: 2,
      projects: 2,
    },
    {
      id: 6,
      name: 'Zara Khan',
      year: '3rd Year',
      gpa: 8.7,
      employabilityScore: 84,
      endorsements: 14,
      certificates: 4,
      projects: 5,
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Student Directory</h1>
          <p className="text-muted-foreground">View and mentor your students</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search students by name or year..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/30 border-primary/20 focus:border-primary/60"
          />
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student.id}
              className="group relative overflow-hidden rounded-xl bg-card border border-secondary/20 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10 p-6 space-y-4">
                {/* Header */}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors">
                    {student.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{student.year}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-muted/30">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">GPA</p>
                    <p className="text-xl font-bold text-primary">{student.gpa}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Employability</p>
                    <p className="text-xl font-bold text-accent">{student.employabilityScore}%</p>
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-accent" />
                    <span className="font-medium text-foreground">{student.endorsements} Endorsements</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{student.certificates} Certificates</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Eye className="w-4 h-4 text-secondary" />
                    <span className="font-medium text-foreground">{student.projects} Projects</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-muted/30 space-y-2">
                  <Link href={`/faculty/students/${student.id}`} className="block">
                    <Button className="w-full bg-gradient-to-r from-secondary to-primary" size="sm">
                      View Profile
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
