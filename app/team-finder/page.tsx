import { AppLayout } from '@/components/app-layout'
import { TeamFinderClient } from './client-list'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function TeamFinderPage() {
  // Fetch initial batch server-side with optimized select queries
  const students = await prisma.student.findMany({
    take: 30, // Load initial 30
    select: {
      id: true,
      branch: true,
      year: true,
      bio: true,
      skills: { select: { name: true } },
      user: {
        select: {
          name: true,
          avatar: true
        }
      }
    },
    orderBy: { id: 'desc' }
  });

  const formattedStudents = students.map(s => ({
    id: s.id,
    name: s.user.name,
    avatar: s.user.avatar,
    department: s.branch || 'Unknown',
    year: s.year,
    bio: s.bio,
    skills: s.skills.map(skill => skill.name)
  }));

  return (
    <AppLayout>
      <TeamFinderClient initialStudents={formattedStudents} />
    </AppLayout>
  )
}
