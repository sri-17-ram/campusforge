'use client'

import { Button } from '@/components/ui/button'
import {
  Zap,
  Users,
  Briefcase,
  Award,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Code,
  Mail,
  Share2,
} from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const features = [
    {
      icon: Zap,
      title: 'Skill-Based Collaboration',
      description: 'Find and connect with talented peers based on skills and interests'
    },
    {
      icon: Award,
      title: 'Career Development',
      description: 'Build your portfolio, earn certificates, and track employability'
    },
    {
      icon: Users,
      title: 'Mentor & Learn',
      description: 'Faculty guidance and peer mentoring for holistic growth'
    },
    {
      icon: Briefcase,
      title: 'Recruitment Pipeline',
      description: 'Direct opportunities with companies and recruiters'
    },
  ]

  const roles = [
    {
      title: 'For Students',
      benefits: [
        'Collaborate on innovation projects',
        'Build professional portfolio',
        'Track career progress',
        'Connect with mentors',
        'Access job opportunities',
        'Earn certifications',
      ],
      color: 'from-blue-500 to-cyan-500',
      accent: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'For Faculty',
      benefits: [
        'Review student projects',
        'Provide mentorship',
        'Track progress metrics',
        'Endorse students',
        'Manage endorsements',
        'Support innovation',
      ],
      color: 'from-purple-500 to-indigo-500',
      accent: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'For Recruiters',
      benefits: [
        'Browse talent pool',
        'Post job opportunities',
        'Review portfolios',
        'Manage applications',
        'Track hiring pipeline',
        'Find top candidates',
      ],
      color: 'from-indigo-500 to-blue-500',
      accent: 'text-indigo-600 dark:text-indigo-400',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-muted sticky top-0 z-50 backdrop-blur-sm bg-background/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">CampusForge</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-primary to-secondary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="space-y-6 md:space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
              Where Innovation Meets Opportunity
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              A comprehensive platform connecting students, faculty, and recruiters. Collaborate on projects, build careers, and discover talent.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/40 w-full sm:w-auto">
                Start as Student
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Platform
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 -left-1/2 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-1/2 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
      </section>

      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
          <p className="text-muted-foreground text-lg">Everything you need to succeed</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="relative overflow-hidden rounded-xl bg-card border border-primary/20 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 space-y-3">
                  <div className="p-3 w-fit rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">How CampusForge Works</h2>
          <p className="text-muted-foreground text-lg">Three simple steps to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Sign Up', desc: 'Choose your role and create an account' },
            { step: '2', title: 'Connect', desc: 'Build your profile and explore the community' },
            { step: '3', title: 'Collaborate', desc: 'Start projects, apply for roles, or hire talent' },
          ].map((item, idx) => (
            <div key={idx} className="relative">
              <div className="absolute top-0 left-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                {item.step}
              </div>
              <div className="pt-16 space-y-2">
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
              {idx < 2 && (
                <div className="hidden md:block absolute top-6 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-accent"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Role Benefits */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Path</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-xl bg-card border border-secondary/20 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10 p-8 space-y-6">
                <div>
                  <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${role.color} bg-clip-text text-transparent`}>
                    {role.title}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {role.benefits.map((benefit, bidx) => (
                    <li key={bidx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="block">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-muted mt-16 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="font-bold text-foreground">CampusForge</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting students, faculty, and opportunities
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <div className="flex gap-3">
                <a href="#" className="p-2 rounded-lg hover:bg-muted transition">
                  <Code className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 rounded-lg hover:bg-muted transition">
                  <Share2 className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 rounded-lg hover:bg-muted transition">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-muted pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 CampusForge. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition">Privacy</a>
              <a href="#" className="hover:text-foreground transition">Terms</a>
              <a href="#" className="hover:text-foreground transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
