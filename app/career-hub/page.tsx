'use client'

import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, FileText, Award, Briefcase, Plus, CheckCircle, Clock, ArrowRight, TrendingUp } from 'lucide-react'
import { useState } from 'react'

const APPLICATION_STAGES = ['Applied', 'Shortlisted', 'Interview', 'Selected']

export default function CareerHubPage() {
  const [activeTab, setActiveTab] = useState('resume')

  const appliedCompanies = [
    {
      name: 'Google',
      position: 'Software Engineer',
      stage: 2,
      appliedDate: 'Jan 5',
      lastUpdate: 'Jan 15',
      interviewDate: 'Jan 28',
    },
    {
      name: 'Microsoft',
      position: 'Cloud Developer',
      stage: 1,
      appliedDate: 'Jan 10',
      lastUpdate: 'Jan 20',
      interviewDate: null,
    },
    {
      name: 'Amazon',
      position: 'Full Stack Engineer',
      stage: 0,
      appliedDate: 'Jan 5',
      lastUpdate: 'Jan 22',
      interviewDate: null,
    },
    {
      name: 'Meta',
      position: 'Backend Engineer',
      stage: 3,
      appliedDate: 'Dec 20',
      lastUpdate: 'Jan 18',
      interviewDate: 'Jan 25',
    },
  ]

  const certificates = [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: 'Dec 2024' },
    { name: 'Google Cloud Associate Cloud Engineer', issuer: 'Google Cloud', date: 'Nov 2024' },
    { name: 'React Advanced Patterns', issuer: 'Frontend Masters', date: 'Oct 2024' },
    { name: 'Machine Learning Specialization', issuer: 'Andrew Ng', date: 'Sep 2024' },
    { name: 'Responsive Web Design', issuer: 'freeCodeCamp', date: 'Aug 2024' },
  ]

  const getStageColor = (stageIndex: number, currentStage: number) => {
    if (stageIndex < currentStage) {
      return 'bg-primary text-primary-foreground'
    } else if (stageIndex === currentStage) {
      return 'bg-accent text-accent-foreground border-2 border-accent'
    }
    return 'bg-muted text-muted-foreground'
  }

  const getStageTextColor = (stageIndex: number, currentStage: number) => {
    if (stageIndex <= currentStage) return 'text-foreground'
    return 'text-muted-foreground'
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Premium Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Career Hub</h1>
          <p className="text-lg text-muted-foreground">
            Manage your resume, certificates, and track your interview progress
          </p>
        </div>

        {/* Employability Score Card */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 border border-primary/30 backdrop-blur-sm p-8">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 -left-1/2 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 -right-1/2 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <span className="text-sm font-semibold text-accent">Your Score</span>
                </div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  78/100
                </h2>
                <p className="text-muted-foreground">
                  Based on your skills, projects, and certifications
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-accent">+5</div>
                <p className="text-sm text-muted-foreground">from last month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/30 border border-muted rounded-lg p-1">
            <TabsTrigger value="resume" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              <FileText className="w-4 h-4 mr-2" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              <Award className="w-4 h-4 mr-2" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              <Briefcase className="w-4 h-4 mr-2" />
              Applications
            </TabsTrigger>
          </TabsList>

          {/* Resume Builder Tab */}
          <TabsContent value="resume" className="space-y-6 mt-8">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold text-foreground">Resume Builder</h2>
              <p className="text-muted-foreground">Build and manage your professional resume</p>
            </div>

            <div className="group relative overflow-hidden rounded-xl bg-card border border-primary/30 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 p-8 hover:shadow-2xl hover:shadow-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6">
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                  <FileText className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Your Resume</h3>
                  <p className="text-muted-foreground mb-2">
                    You have 1 professional resume ready
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Download, share, or create a new version
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap justify-center">
                  <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/40">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6 mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Your Certificates</h2>
                <p className="text-muted-foreground">{certificates.length} professional certifications</p>
              </div>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/40">
                <Plus className="w-4 h-4 mr-2" />
                Add Certificate
              </Button>
            </div>

            <div className="grid gap-4">
              {certificates.map((cert, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-lg bg-card border border-secondary/20 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20 p-5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 flex-shrink-0 mt-1">
                      <Award className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                        {cert.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{cert.issuer}</p>
                      <p className="text-xs text-muted-foreground mt-2">{cert.date}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-secondary hover:bg-secondary/10 flex-shrink-0">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Applications Tab with Timeline */}
          <TabsContent value="applications" className="space-y-6 mt-8">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold text-foreground">Application Tracker</h2>
              <p className="text-muted-foreground">Monitor your interview progress across {appliedCompanies.length} applications</p>
            </div>

            <div className="space-y-4">
              {appliedCompanies.map((app, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-xl bg-card border border-accent/20 backdrop-blur-sm hover:border-accent/60 transition-all duration-300 hover:shadow-xl hover:shadow-accent/20 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="relative z-10 p-6 space-y-4">
                    {/* Application Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                          {app.name}
                        </h3>
                        <p className="text-muted-foreground mt-1">{app.position}</p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground flex-shrink-0">
                        <p>Applied: {app.appliedDate}</p>
                        <p className="mt-1">Updated: {app.lastUpdate}</p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="pt-4 border-t border-muted/30">
                      <div className="flex items-center justify-between gap-2">
                        {APPLICATION_STAGES.map((stage, stageIdx) => (
                          <div key={stage} className="flex-1 flex items-center gap-2">
                            {/* Stage Bubble */}
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${getStageColor(
                                stageIdx,
                                app.stage
                              )}`}
                            >
                              {stageIdx < app.stage ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                stageIdx + 1
                              )}
                            </div>

                            {/* Stage Label */}
                            <span
                              className={`text-xs font-medium ${getStageTextColor(
                                stageIdx,
                                app.stage
                              )}`}
                            >
                              {stage}
                            </span>

                            {/* Connector */}
                            {stageIdx < APPLICATION_STAGES.length - 1 && (
                              <div
                                className={`flex-1 h-0.5 transition-all ${
                                  stageIdx < app.stage ? 'bg-primary' : 'bg-muted/30'
                                }`}
                              ></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interview Date (if applicable) */}
                    {app.interviewDate && (
                      <div className="pt-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-foreground font-medium">
                          Interview scheduled: {app.interviewDate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
