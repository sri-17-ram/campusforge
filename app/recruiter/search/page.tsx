'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search, Filter, Star, MapPin, Briefcase, Award, Mail, Eye, Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function RecruiterSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSkills, setFilterSkills] = useState<string[]>([])

  const candidates = [
    {
      id: 1,
      name: 'Arjun Singh',
      title: 'Full Stack Developer',
      location: 'Bangalore',
      year: '4th Year',
      employabilityScore: 82,
      skills: ['React', 'Node.js', 'AWS', 'MongoDB'],
      rating: 4.8,
      portfolio: 'arjun.dev',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      title: 'Product Manager',
      location: 'Mumbai',
      year: '4th Year',
      employabilityScore: 76,
      skills: ['Product Strategy', 'Analytics', 'Leadership', 'UI/UX'],
      rating: 4.5,
      portfolio: 'priyadotpm.com',
    },
    {
      id: 3,
      name: 'Vikram Patel',
      title: 'Data Scientist',
      location: 'Pune',
      year: '3rd Year',
      employabilityScore: 88,
      skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
      rating: 4.9,
      portfolio: 'vikramdata.ai',
    },
    {
      id: 4,
      name: 'Neha Gupta',
      title: 'Frontend Engineer',
      location: 'Delhi',
      year: '3rd Year',
      employabilityScore: 79,
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
      rating: 4.6,
      portfolio: 'nehaui.design',
    },
    {
      id: 5,
      name: 'Rahul Kumar',
      title: 'DevOps Engineer',
      location: 'Hyderabad',
      year: '2nd Year',
      employabilityScore: 71,
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
      rating: 4.3,
      portfolio: 'rahuldevops.io',
    },
    {
      id: 6,
      name: 'Zara Khan',
      title: 'UX/UI Designer',
      location: 'Bangalore',
      year: '3rd Year',
      employabilityScore: 84,
      skills: ['Figma', 'UI Design', 'Prototyping', 'User Research'],
      rating: 4.7,
      portfolio: 'zaradesigns.com',
    },
  ]

  const allSkills = ['React', 'Node.js', 'Python', 'Machine Learning', 'AWS', 'Product Strategy', 'UI/UX', 'TypeScript']

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Talent Search</h1>
          <p className="text-muted-foreground">Browse and connect with top students from campus</p>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, skills, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/30 border-primary/20 focus:border-primary/60"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {allSkills.map((skill) => (
              <button
                key={skill}
                onClick={() =>
                  setFilterSkills(
                    filterSkills.includes(skill)
                      ? filterSkills.filter((s) => s !== skill)
                      : [...filterSkills, skill]
                  )
                }
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  filterSkills.includes(skill)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-foreground border-muted hover:border-primary/60'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="group relative overflow-hidden rounded-xl bg-card border border-accent/20 backdrop-blur-sm hover:border-accent/60 transition-all duration-300 hover:shadow-xl hover:shadow-accent/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10 p-6 space-y-4 h-full flex flex-col">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-accent font-medium">{candidate.title}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold">{candidate.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {candidate.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {candidate.year}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="pt-2 border-t border-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">Employability</span>
                    <span className="text-sm font-bold text-accent">{candidate.employabilityScore}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${candidate.employabilityScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground">
                        +{candidate.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 mt-auto space-y-2 border-t border-muted/30">
                  <Link href={`/recruiter/candidate/${candidate.id}`} className="block">
                    <Button className="w-full bg-gradient-to-r from-accent to-primary" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
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
