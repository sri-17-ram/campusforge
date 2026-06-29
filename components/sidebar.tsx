'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  Briefcase,
  Users,
  Rocket,
  User,
  Settings,

  Menu,
  X,
  TrendingUp,
  Target,
  Calendar,
  Building,
  GraduationCap

} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])


  const studentLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/projects', label: 'Projects', icon: Briefcase },
    { href: '/team-finder', label: 'Team Finder', icon: Users },
    { href: '/career-hub', label: 'Career Hub', icon: Rocket },
    { href: '/portfolio', label: 'Portfolio', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  const recruiterLinks = [
    { href: '/recruiter/dashboard', label: 'Dashboard', icon: Home },
    { href: '/recruiter/analytics', label: 'Analytics', icon: TrendingUp },
    { href: '/recruiter/jobs', label: 'Manage Jobs', icon: Briefcase },
    { href: '/recruiter/applications', label: 'Applications', icon: Users },
    { href: '/recruiter/calendar', label: 'Interviews', icon: Calendar },
    { href: '/recruiter/settings', label: 'Company Profile', icon: Building },
  ]

  const facultyLinks = [
    { href: '/faculty/dashboard', label: 'Dashboard', icon: Home },
    { href: '/faculty/students', label: 'Students', icon: Users },
    { href: '/faculty/reviews', label: 'Verifications', icon: Target },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  const getLinks = () => {
    if (user?.role === 'RECRUITER') return recruiterLinks
    if (user?.role === 'FACULTY') return facultyLinks
    return studentLinks
  }

  const links = getLinks()


  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 md:hidden z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-card hover:bg-muted"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-sidebar-border">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-sidebar-foreground group-hover:text-sidebar-primary transition-colors">
                CampusForge
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive(href)
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-9 h-9 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user?.name || 'User Name'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.email || 'user@campus.dev'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
