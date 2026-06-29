'use client'

import { useState, useMemo, memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, UserPlus, Briefcase, Clock } from 'lucide-react'
import Image from 'next/image'

const skillColors: Record<string, { bg: string; text: string; border: string }> = {
  'Python': { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  'Machine Learning': { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
  'React': { bg: 'bg-blue-400/20', text: 'text-blue-200', border: 'border-blue-400/30' },
  'JavaScript': { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30' },
}
const defaultColor = { bg: 'bg-primary/20', text: 'text-primary', border: 'border-primary/30' }

const departments = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Information Technology',
]

const TeamCard = memo(({ student }: { student: any }) => (
  <Card className="border-border hover:border-primary/50 transition-all hover:shadow-lg group flex flex-col h-full bg-card/50 backdrop-blur-sm">
    <CardContent className="p-6 flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0 border border-border group-hover:border-primary/50 transition-colors relative">
           <Image src={student.avatar || '/placeholder-avatar.png'} alt={student.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-lg truncate group-hover:text-primary transition-colors">
            {student.name}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <Briefcase className="w-3.5 h-3.5" />
            <span className="truncate">{student.department}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Year {student.year}</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
        {student.bio || 'Passionate student looking for exciting projects and collaborations.'}
      </p>

      {/* Skills */}
      <div className="mt-4 flex-1">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Top Skills</p>
        <div className="flex flex-wrap gap-2">
          {student.skills?.slice(0, 4).map((skill: string, sidx: number) => {
            const colors = skillColors[skill] || defaultColor;
            return (
              <span
                key={sidx}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
              >
                {skill}
              </span>
            )
          })}
          {student.skills?.length > 4 && (
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border">
              +{student.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t border-border flex gap-3">
        <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite
        </Button>
        <Button variant="outline" className="flex-1 border-primary/50 text-primary hover:bg-primary/10">
          View Profile
        </Button>
      </div>
    </CardContent>
  </Card>
))
TeamCard.displayName = 'TeamCard'

export function TeamFinderClient({ initialStudents }: { initialStudents: any[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

  const filteredStudents = useMemo(() => {
    return initialStudents.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            student.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesDept = selectedDepartment ? student.department === selectedDepartment : true
      return matchesSearch && matchesDept
    })
  }, [searchQuery, selectedDepartment, initialStudents])

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
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
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/40'
                    : 'bg-muted/30 text-foreground hover:bg-muted/50 border border-muted'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filteredStudents.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-dashed border-muted">
          <p className="text-muted-foreground">No students found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, idx) => (
            <TeamCard key={student.id || idx} student={student} />
          ))}
        </div>
      )}
    </div>
  )
}
