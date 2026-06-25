'use client'

import { AppLayout } from '@/components/app-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Eye, Lock } from 'lucide-react'

export default function ProjectsPage() {
  const projects = [
    {
      title: 'AI Study Assistant',
      domain: 'EdTech',
      skills: ['Python', 'React', 'NLP'],
      membersNeeded: 2,
      members: 4,
      visibility: 'public',
    },
    {
      title: 'Campus Event Planner',
      domain: 'Social',
      skills: ['JavaScript', 'Node.js', 'MongoDB'],
      membersNeeded: 3,
      members: 3,
      visibility: 'public',
    },
    {
      title: 'Placement Analytics Dashboard',
      domain: 'Career Tech',
      skills: ['React', 'D3.js', 'PostgreSQL'],
      membersNeeded: 0,
      members: 5,
      visibility: 'private',
    },
    {
      title: 'Smart Campus IoT',
      domain: 'IoT',
      skills: ['Arduino', 'Python', 'AWS'],
      membersNeeded: 1,
      members: 2,
      visibility: 'public',
    },
    {
      title: 'Internship Portal',
      domain: 'Career Tech',
      skills: ['Next.js', 'TypeScript', 'PostgreSQL'],
      membersNeeded: 4,
      members: 2,
      visibility: 'public',
    },
    {
      title: 'Mental Health App',
      domain: 'Healthcare',
      skills: ['React Native', 'Firebase', 'Design'],
      membersNeeded: 2,
      members: 3,
      visibility: 'private',
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Explore and collaborate on student innovation projects
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects by title, domain, or skills..."
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, idx) => (
            <Card
              key={idx}
              className="border-border hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group"
            >
              <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{project.domain}</p>
                  </div>
                  {project.visibility === 'private' ? (
                    <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, sidx) => (
                      <div
                        key={sidx}
                        className="px-2 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-xs font-medium"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Info */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Team Size</span>
                    <span className="font-semibold text-foreground">{project.members} members</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Seeking</span>
                    <span className="font-semibold text-accent">{project.membersNeeded} more</span>
                  </div>
                </div>

                {/* CTA */}
                <Button variant="outline" className="w-full mt-2 border-primary/50 hover:bg-primary/10 text-primary">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
