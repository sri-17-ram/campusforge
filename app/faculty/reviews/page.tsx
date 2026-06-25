'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, MessageSquare, CheckCircle, Clock, AlertCircle, Users } from 'lucide-react'
import { useState } from 'react'

export default function FacultyReviewsPage() {
  const [selectedTab, setSelectedTab] = useState('pending')

  const projects = [
    {
      id: 1,
      title: 'AI Study Assistant',
      students: ['Arjun Singh', 'Priya Sharma'],
      status: 'pending',
      submittedDate: 'Jan 15',
      description: 'An intelligent study assistant using NLP and ML to help students prepare for exams',
      hasComments: true,
      commentCount: 3,
    },
    {
      id: 2,
      title: 'Campus Event Planner',
      students: ['Rahul Patel', 'Neha Gupta', 'Zara Khan'],
      status: 'in-review',
      submittedDate: 'Jan 20',
      description: 'A web application to help students discover and manage campus events',
      hasComments: true,
      commentCount: 5,
    },
    {
      id: 3,
      title: 'Placement Analytics Dashboard',
      students: ['Vikram Singh', 'Anjali Verma', 'Ravi Kumar', 'Sanjana Mishra', 'Aditya Sharma'],
      status: 'completed',
      submittedDate: 'Jan 10',
      description: 'A comprehensive analytics platform tracking campus placement trends',
      rating: 4.8,
      hasComments: true,
      commentCount: 7,
    },
    {
      id: 4,
      title: 'Peer Tutoring Platform',
      students: ['Maya Singh', 'Dev Patel'],
      status: 'pending',
      submittedDate: 'Jan 22',
      description: 'A mobile-first platform connecting students for peer tutoring sessions',
      hasComments: false,
      commentCount: 0,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-accent" />
      case 'in-review':
        return <AlertCircle className="w-5 h-5 text-primary" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-accent/20 text-accent'
      case 'in-review':
        return 'bg-primary/20 text-primary'
      case 'completed':
        return 'bg-green-500/20 text-green-600 dark:text-green-400'
      default:
        return ''
    }
  }

  const filteredProjects = projects.filter(p => p.status === selectedTab)

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Project Reviews</h1>
          <p className="text-muted-foreground">Review and provide feedback on student projects</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/30 border border-muted rounded-lg p-1">
            <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              <Clock className="w-4 h-4 mr-2" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="in-review" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              <AlertCircle className="w-4 h-4 mr-2" />
              In Review
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed
            </TabsTrigger>
          </TabsList>

          {['pending', 'in-review', 'completed'].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4 mt-6">
              {projects.filter(p => p.status === status).length === 0 ? (
                <Card className="border-dashed border-muted">
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No projects in this category</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {projects.filter(p => p.status === status).map((project) => (
                    <div
                      key={project.id}
                      className="group relative overflow-hidden rounded-xl bg-card border border-secondary/20 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <div className="relative z-10 p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(project.status)}
                              <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors">
                                {project.title}
                              </h3>
                            </div>
                            <p className="text-muted-foreground text-sm">{project.description}</p>
                          </div>
                          {project.rating && (
                            <div className="text-right flex-shrink-0">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-accent fill-current" />
                                <span className="font-bold text-foreground">{project.rating}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-muted/30 space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <p className="text-sm font-semibold text-foreground">Team Members</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {project.students.map((student, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium"
                                >
                                  {student}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Submitted: {project.submittedDate}</span>
                              {project.hasComments && (
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>{project.commentCount} comments</span>
                                </div>
                              )}
                            </div>
                            <Button
                              className={`bg-gradient-to-r from-secondary to-primary ${
                                project.status === 'completed' ? 'pointer-events-none opacity-50' : ''
                              }`}
                              size="sm"
                            >
                              {project.status === 'completed' ? 'Reviewed' : 'Review'}
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
