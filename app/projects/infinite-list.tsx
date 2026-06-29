'use client'

import { useState, useEffect, useRef, memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Lock } from 'lucide-react'

const ProjectCard = memo(({ project }: { project: any }) => (
  <Card className="border-border hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group h-full flex flex-col">
    <CardContent className="p-5 space-y-4 flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
        </div>
        {project.visibility === 'private' ? (
          <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <Eye className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </div>

      <div className="space-y-2 mt-auto">
        <p className="text-xs font-medium text-muted-foreground">Tech Stack / Skills</p>
        <div className="flex flex-wrap gap-2">
          {project.techStack?.split(',').slice(0,3).map((tag: string, sidx: number) => (
            <div key={sidx} className="px-2 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-[10px] font-medium border border-secondary/20">
              {tag.trim()}
            </div>
          ))}
          {project.techStack && project.techStack.split(',').length > 3 && (
            <div className="px-2 py-1 rounded-full bg-muted/50 text-muted-foreground text-[10px] font-medium">
              +{project.techStack.split(',').length - 3}
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-border mt-4">
        <div className="flex items-center justify-between text-sm">
           <span className="text-muted-foreground text-xs">By {project.student?.user?.name || 'Anonymous'}</span>
        </div>
      </div>

      {/* CTA */}
      <Button variant="outline" className="w-full mt-4 border-primary/50 hover:bg-primary/10 text-primary">
        View Details
      </Button>
    </CardContent>
  </Card>
))
ProjectCard.displayName = 'ProjectCard'

export function InfiniteProjectList({ initialProjects, initialCursor }: { initialProjects: any[], initialCursor: string | null }) {
  const [projects, setProjects] = useState<any[]>(initialProjects)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [loading, setLoading] = useState(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && cursor && !loading) {
          loadMore()
        }
      },
      { threshold: 1.0 }
    )
    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }
    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [cursor, loading])

  const loadMore = async () => {
    if (!cursor) return
    setLoading(true)
    try {
      const res = await fetch(`/api/projects?cursor=${cursor}&limit=10`)
      const data = await res.json()
      if (data.success) {
        setProjects(prev => [...prev, ...data.projects])
        setCursor(data.nextCursor)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project, idx) => (
          <ProjectCard key={project.id || idx} project={project} />
        ))}
      </div>
      
      {/* Invisible target for Intersection Observer */}
      <div ref={observerTarget} className="h-10 w-full flex items-center justify-center">
        {loading && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>}
        {!cursor && projects.length > 0 && <span className="text-sm text-muted-foreground">No more projects to load</span>}
      </div>
    </div>
  )
}
