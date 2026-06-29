import { AppLayout } from '@/components/app-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function TeamFinderLoading() {
  return (
    <AppLayout>
      <div className="space-y-8 animate-pulse max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-10 w-64 bg-muted rounded"></div>
          <div className="h-4 w-96 bg-muted rounded"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="space-y-4 bg-card border border-primary/20 backdrop-blur-sm rounded-xl p-6">
          <div>
            <div className="h-4 w-16 bg-muted rounded mb-2"></div>
            <div className="h-10 w-full bg-muted rounded"></div>
          </div>
          <div>
            <div className="h-4 w-32 bg-muted rounded mb-3"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 w-24 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-muted shrink-0"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-2/3 bg-muted rounded"></div>
                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="h-3 w-16 bg-muted rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-muted rounded-full"></div>
                    <div className="h-6 w-20 bg-muted rounded-full"></div>
                  </div>
                </div>
                <div className="h-10 w-full bg-muted rounded mt-6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
