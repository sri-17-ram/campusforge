import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { InfiniteProjectList } from './infinite-list'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ProjectsPage() {
  const limit = 10;
  
  // Fetch initial batch server-side
  const projects = await prisma.project.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
      techStack: true,
      github: true,
      demo: true,
      createdAt: true,
      student: {
        select: {
          user: { select: { name: true, avatar: true } }
        }
      }
    }
  });

  const initialCursor = projects.length === limit ? projects[projects.length - 1].id : null;

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

        {/* Client-side Infinite Scroll List */}
        <InfiniteProjectList initialProjects={projects} initialCursor={initialCursor} />
      </div>
    </AppLayout>
  )
}
