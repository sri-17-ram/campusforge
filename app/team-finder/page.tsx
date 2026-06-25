'use client'

import { AppLayout } from '@/components/app-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, UserPlus, Briefcase, Clock } from 'lucide-react'
import { useState, useMemo } from 'react'

// Skill color mapping for badges
const skillColors: Record<string, { bg: string; text: string; border: string }> = {
  'Python': { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  'Machine Learning': { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
  'Data Analysis': { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  'React': { bg: 'bg-blue-400/20', text: 'text-blue-200', border: 'border-blue-400/30' },
  'JavaScript': { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30' },
  'UI/UX Design': { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30' },
  'CAD': { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30' },
  'IoT': { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
  'Arduino': { bg: 'bg-green-400/20', text: 'text-green-200', border: 'border-green-400/30' },
  'Backend Development': { bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/30' },
  'Node.js': { bg: 'bg-green-600/20', text: 'text-green-300', border: 'border-green-600/30' },
  'Databases': { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' },
  'Mobile Development': { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  'React Native': { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  'Firebase': { bg: 'bg-orange-400/20', text: 'text-orange-200', border: 'border-orange-400/30' },
  'DevOps': { bg: 'bg-red-600/20', text: 'text-red-300', border: 'border-red-600/30' },
  'Docker': { bg: 'bg-blue-600/20', text: 'text-blue-300', border: 'border-blue-600/30' },
  'AWS': { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30' },
  'CI/CD': { bg: 'bg-purple-600/20', text: 'text-purple-300', border: 'border-purple-600/30' },
  'Embedded Systems': { bg: 'bg-red-400/20', text: 'text-red-200', border: 'border-red-400/30' },
  'C++': { bg: 'bg-blue-700/20', text: 'text-blue-200', border: 'border-blue-700/30' },
  'FPGA': { bg: 'bg-indigo-600/20', text: 'text-indigo-300', border: 'border-indigo-600/30' },
  'Web Design': { bg: 'bg-pink-400/20', text: 'text-pink-200', border: 'border-pink-400/30' },
  'Figma': { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30' },
  'Frontend': { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' },
}

const departments = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Information Technology',
]

export default function TeamFinderPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

  const students = [
    {
      name: 'Arjun Singh',
      department: 'Computer Science',
      skills: ['Python', 'Machine Learning', 'Data Analysis'],
      matchPercentage: 95,
      availability: 'Full-time',
    },
    {
      name: 'Priya Sharma',
      department: 'Electronics',
      skills: ['React', 'JavaScript', 'UI/UX Design'],
      matchPercentage: 88,
      availability: 'Part-time',
    },
    {
      name: 'Karan Patel',
      department: 'Mechanical',
      skills: ['CAD', 'IoT', 'Arduino'],
      matchPercentage: 82,
      availability: 'Full-time',
    },
    {
      name: 'Neha Gupta',
      department: 'Computer Science',
      skills: ['Backend Development', 'Node.js', 'Databases'],
      matchPercentage: 90,
      availability: 'Full-time',
    },
    {
      name: 'Rohan Kumar',
      department: 'Information Technology',
      skills: ['Mobile Development', 'React Native', 'Firebase'],
      matchPercentage: 85,
      availability: 'Part-time',
    },
    {
      name: 'Aisha Khan',
      department: 'Computer Science',
      skills: ['DevOps', 'Docker', 'AWS', 'CI/CD'],
      matchPercentage: 87,
      availability: 'Full-time',
    },
    {
      name: 'Vikram Nair',
      department: 'Electronics',
      skills: ['Embedded Systems', 'C++', 'FPGA'],
      matchPercentage: 78,
      availability: 'Part-time',
    },
    {
      name: 'Sneha Reddy',
      department: 'Computer Science',
      skills: ['Web Design', 'UX/UI', 'Figma', 'Frontend'],
      matchPercentage: 89,
      availability: 'Full-time',
    },
  ]

  // Filter students based on search and department
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        searchQuery === '' ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.skills.some(skill =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )

      const matchesDepartment =
        selectedDepartment === null || student.department === selectedDepartment

      return matchesSearch && matchesDepartment
    })
  }, [searchQuery, selectedDepartment])

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header with Premium Design */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Skill-Based Collaboration</h1>
          <p className="text-lg text-muted-foreground">
            Find talented team members based on skills and expertise. Connect with the right collaborators for your next project.
          </p>
        </div>

        {/* Filters Section */}
        <div className="space-y-4 bg-card border border-primary/20 backdrop-blur-sm rounded-xl p-6 hover:border-primary/40 transition-all">
          {/* Search */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by skill (e.g., React, Python) or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/30 border-primary/20 focus:border-primary/60 transition-colors"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block">Filter by Department</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDepartment(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedDepartment === null
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/40'
                    : 'bg-muted/30 text-foreground hover:bg-muted/50 border border-muted'
                }`}
              >
                All Departments
              </button>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedDepartment === dept
                      ? 'bg-secondary text-secondary-foreground shadow-lg shadow-secondary/40'
                      : 'bg-muted/30 text-foreground hover:bg-muted/50 border border-muted'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="pt-2 text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredStudents.length}</span> of {students.length} students
          </div>
        </div>

        {/* Students Grid */}
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStudents.map((student, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl bg-card border border-primary/20 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <CardContent className="relative z-10 p-6 space-y-4">
                  {/* Student Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {student.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Briefcase className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          <p className="text-sm text-muted-foreground truncate">{student.department}</p>
                        </div>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {student.matchPercentage}%
                      </div>
                      <p className="text-xs text-muted-foreground">Match</p>
                    </div>
                  </div>

                  {/* Availability Status */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-muted w-fit">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <span className="text-xs font-medium text-foreground">{student.availability}</span>
                  </div>

                  {/* Skills with Colorful Badges */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skills & Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {student.skills.map((skill, sidx) => {
                        const colors = skillColors[skill] || {
                          bg: 'bg-primary/20',
                          text: 'text-primary',
                          border: 'border-primary/30',
                        }
                        return (
                          <div
                            key={sidx}
                            className={`px-3 py-1.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border} text-xs font-semibold transition-all hover:shadow-md`}
                          >
                            {skill}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
                    >
                      Portfolio
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/40"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite
                    </Button>
                  </div>
                </CardContent>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-muted rounded-xl">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No students found</h3>
            <p className="text-muted-foreground">Try adjusting your search or department filter to find collaborators</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
