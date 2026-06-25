'use client'

import { AppLayout } from '@/components/app-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Globe,
  Mail,
  Edit2,
  Download,
  ExternalLink,
  Code,
  Award,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react'
import { useState } from 'react'

// Skill color mapping for colorful badges
const skillColors: Record<string, { bg: string; text: string; border: string }> = {
  'React': { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  'TypeScript': { bg: 'bg-blue-600/20', text: 'text-blue-200', border: 'border-blue-600/30' },
  'Node.js': { bg: 'bg-green-600/20', text: 'text-green-300', border: 'border-green-600/30' },
  'Python': { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  'Machine Learning': { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
  'AWS': { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30' },
  'MongoDB': { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
  'PostgreSQL': { bg: 'bg-blue-400/20', text: 'text-blue-200', border: 'border-blue-400/30' },
  'Docker': { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  'Git': { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' },
  'UI/UX Design': { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30' },
  'Agile': { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  'Next.js': { bg: 'bg-gray-500/20', text: 'text-gray-200', border: 'border-gray-500/30' },
  'Express': { bg: 'bg-gray-600/20', text: 'text-gray-300', border: 'border-gray-600/30' },
  'TensorFlow': { bg: 'bg-orange-600/20', text: 'text-orange-200', border: 'border-orange-600/30' },
  'Stripe': { bg: 'bg-purple-600/20', text: 'text-purple-200', border: 'border-purple-600/30' },
  'D3.js': { bg: 'bg-orange-400/20', text: 'text-orange-200', border: 'border-orange-400/30' },
}

export default function PortfolioPage() {
  const [previewMode, setPreviewMode] = useState(false)

  const skills = [
    'React',
    'TypeScript',
    'Node.js',
    'Python',
    'Machine Learning',
    'AWS',
    'MongoDB',
    'PostgreSQL',
    'Docker',
    'Git',
    'UI/UX Design',
    'Agile',
  ]

  const projects = [
    {
      title: 'AI Study Assistant',
      description: 'Smart learning platform using NLP and machine learning',
      tech: ['Python', 'React', 'TensorFlow'],
      link: 'github.com/user/ai-study',
    },
    {
      title: 'Campus Event Manager',
      description: 'Full-stack event management system for campus activities',
      tech: ['Next.js', 'MongoDB', 'Stripe'],
      link: 'github.com/user/event-manager',
    },
    {
      title: 'Data Visualization Dashboard',
      description: 'Interactive analytics dashboard with real-time data',
      tech: ['React', 'D3.js', 'Express'],
      link: 'github.com/user/analytics-dash',
    },
  ]

  const certificates = [
    'AWS Certified Solutions Architect',
    'Google Cloud Associate Cloud Engineer',
    'React Advanced Patterns',
    'Machine Learning Specialization',
  ]

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header with Preview Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Portfolio</h1>
            <p className="text-muted-foreground mt-2">Professional personal website & project showcase</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="border-primary/50 text-primary hover:bg-primary/10"
          >
            {previewMode ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Exit Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </>
            )}
          </Button>
        </div>

        {/* Premium Hero Profile Section */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card backdrop-blur-sm">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20"></div>
          <div className="absolute top-0 -left-1/2 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 -right-1/2 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>

          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 md:items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-primary/40">
                  JD
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="space-y-3">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">John Doe</h1>
                    <p className="text-xl text-accent font-semibold">Full Stack Developer & ML Enthusiast</p>
                  </div>

                  {/* About Section */}
                  <div className="py-4 border-t border-muted/30">
                    <p className="text-foreground leading-relaxed max-w-2xl">
                      Passionate full-stack developer with expertise in modern web technologies, cloud infrastructure, and machine learning. 
                      Building innovative solutions that solve real-world problems. Always learning, always building.
                    </p>
                  </div>

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary/50 text-primary hover:bg-primary/10"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-secondary/50 text-secondary hover:bg-secondary/10"
                    >
                      <Briefcase className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-accent/50 text-accent hover:bg-accent/10"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/40"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              {!previewMode && (
                <Button className="bg-primary hover:bg-primary/90 gap-2 flex-shrink-0">
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
              <Code className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Skills & Expertise</h2>
              <p className="text-sm text-muted-foreground mt-1">Technologies and tools I work with</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-card border border-primary/20 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 p-8 hover:shadow-xl hover:shadow-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex flex-wrap gap-3">
              {skills.map((skill, idx) => {
                const colors = skillColors[skill] || {
                  bg: 'bg-primary/20',
                  text: 'text-primary',
                  border: 'border-primary/30',
                }
                return (
                  <div
                    key={idx}
                    className={`px-4 py-2 rounded-full border ${colors.bg} ${colors.text} ${colors.border} font-semibold text-sm transition-all hover:shadow-lg hover:shadow-primary/30`}
                  >
                    {skill}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20">
              <Briefcase className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Featured Projects</h2>
              <p className="text-sm text-muted-foreground mt-1">Showcase of my best work</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl bg-card border border-secondary/20 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10 p-6 h-full flex flex-col gap-4">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors">
                        {project.title}
                      </h3>
                      <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors flex-shrink-0" />
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-muted/30 mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, tidx) => {
                        const colors = skillColors[tech] || {
                          bg: 'bg-secondary/20',
                          text: 'text-secondary',
                          border: 'border-secondary/30',
                        }
                        return (
                          <div
                            key={tidx}
                            className={`px-2.5 py-1 rounded-md border text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}
                          >
                            {tech}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {!previewMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-secondary hover:bg-secondary/10 justify-between group/btn"
                    >
                      View Project
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates & Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Certificates */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20">
                <Award className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Certificates</h2>
                <p className="text-sm text-muted-foreground mt-1">{certificates.length} professional credentials</p>
              </div>
            </div>

            <div className="space-y-3">
              {certificates.map((cert, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-lg bg-card border border-accent/20 backdrop-blur-sm hover:border-accent/60 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 p-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex items-start gap-3">
                    <Award className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm group-hover:text-accent transition-colors">
                        {cert}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Verified credential</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Connect</h2>
                <p className="text-sm text-muted-foreground mt-1">Get in touch with me</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="group relative overflow-hidden rounded-lg bg-card border border-primary/20 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 p-4">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Personal Website</p>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-foreground font-semibold group-hover:text-primary transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    johndoe.dev
                  </a>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg bg-card border border-secondary/20 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20 p-4">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email</p>
                  <a
                    href="mailto:john@example.com"
                    className="flex items-center gap-2 text-foreground font-semibold group-hover:text-secondary transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    john@example.com
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-muted/30">
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="#"
                    className="group/link px-4 py-3 rounded-lg bg-card border border-primary/20 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20 transition-all text-center flex items-center justify-center gap-2"
                  >
                    <Code className="w-4 h-4" />
                    <span className="text-sm font-semibold">GitHub</span>
                  </a>
                  <a
                    href="#"
                    className="group/link px-4 py-3 rounded-lg bg-card border border-secondary/20 hover:border-secondary/60 hover:shadow-lg hover:shadow-secondary/20 transition-all text-center flex items-center justify-center gap-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm font-semibold">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
