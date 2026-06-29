import sys

file_path = r"d:\work\campousforge\components\sidebar.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_imports = """
  Menu,
  X,
  TrendingUp,
  Target,
  Calendar,
  Building,
  GraduationCap
"""

content = content.replace("  Menu,\n  X,", new_imports)

links_code = """
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
"""

content = content.replace("""  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/projects', label: 'Projects', icon: Briefcase },
    { href: '/team-finder', label: 'Team Finder', icon: Users },
    { href: '/career-hub', label: 'Career Hub', icon: Rocket },
    { href: '/portfolio', label: 'Portfolio', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]""", links_code)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Sidebar updated")
