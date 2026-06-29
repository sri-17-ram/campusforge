import { AppLayout } from '@/components/app-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'

export default function ProjectsLoading() {
  return (
    <AppLayout>
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-10 w-48 bg-muted rounded"></div>
            <div className="h-4 w-64 bg-muted rounded mt-2"></div>
          </div>
          <div className="h-10 w-32 bg-muted rounded"></div>
        </div>

        {/* Search Skeleton */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="h-10 w-full bg-muted rounded"></div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-border shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 w-full">
                    <div className="h-6 w-3/4 bg-muted rounded"></div>
                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-muted rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-muted rounded-full"></div>
                    <div className="h-5 w-20 bg-muted rounded-full"></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-border mt-4">
                  <div className="h-4 w-32 bg-muted rounded"></div>
                </div>
                <div className="h-10 w-full bg-muted rounded mt-4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
