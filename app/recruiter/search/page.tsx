'use client'
import Image from 'next/image'

import { AppLayout } from '@/components/app-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MapPin, Briefcase, Star, Mail, CheckCircle, Clock, ShieldCheck, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function RecruiterSearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await fetch(`/api/recruiter/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success) {
          setStudents(data.students)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 0) {
        fetchStudents()
      } else {
        setStudents([])
      }
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="space-y-2 text-center max-w-2xl mx-auto pt-8">
          <h1 className="text-4xl font-bold text-foreground">Global Talent Search</h1>
          <p className="text-muted-foreground">Discover and connect with top candidates across the entire campus.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative shadow-lg rounded-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            <Input
              placeholder="Search by name, branch, skills (e.g. React, Bangalore)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-16 pr-6 py-8 rounded-full bg-card border-primary/20 focus:border-primary text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {loading ? (
            <div className="col-span-full flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : students.length > 0 ? (
            students.map((student) => (
              <div
                key={student.id}
                className="group relative overflow-hidden rounded-xl bg-card border border-primary/20 hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 flex flex-col"
              >
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex items-center justify-center shrink-0">
                        {student.user.avatar ? (
                          <Image width={500} height={500} src={student.user.avatar} className="w-full h-full object-cover" alt="avatar" />
                        ) : (
                          <span className="text-xl font-bold">{student.user.name[0]}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{student.user.name}</h3>
                        <p className="text-sm text-primary font-medium">{student.branch || 'General'} • Year {student.year || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Employability Score</span>
                      <span className="text-sm font-bold text-primary">{student.score || 0}/100</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${student.score || 0}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {student.skills.slice(0, 4).map((skill: any, idx: number) => (
                        <span key={idx} className="px-2 py-1 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                          {skill.name}
                        </span>
                      ))}
                      {student.skills.length > 4 && (
                        <span className="px-2 py-1 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-muted-foreground/20">
                          +{student.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-muted/30 bg-muted/10 grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => { setSelectedStudent(student); setDrawerOpen(true); }}>
                    View Profile
                  </Button>
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-xs">
                    <Mail className="w-3 h-3 mr-2" /> Message
                  </Button>
                </div>
              </div>
            ))
          ) : searchQuery.length > 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">No candidates found for "{searchQuery}"</div>
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">Start typing to search the global talent pool.</div>
          )}
        </div>
      </div>

      {drawerOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl overflow-hidden shadow-2xl relative border border-primary/20">
            <div className="p-6 border-b border-muted flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedStudent?.user?.name}</h2>
              <button onClick={() => setDrawerOpen(false)} className="p-2 text-muted-foreground hover:bg-muted rounded-full">
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-y-auto">
               <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-foreground border-b border-muted pb-2 mb-3">Academic Overview</h4>
                    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Branch:</span> {selectedStudent?.branch}</p>
                    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Year:</span> {selectedStudent?.year}</p>
                    <p className="text-sm text-muted-foreground mt-2">{selectedStudent?.bio}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground border-b border-muted pb-2 mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent?.skills?.map((s: any) => (
                        <span key={s.id} className="bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded text-xs">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
               </div>
               <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-foreground border-b border-muted pb-2 mb-3">Verified Projects</h4>
                    <div className="space-y-2">
                      {selectedStudent?.projects?.length > 0 ? selectedStudent.projects.map((p: any) => (
                        <div key={p.id} className="p-3 bg-muted/20 border border-muted rounded-lg flex items-center justify-between">
                           <span className="text-sm font-medium">{p.title}</span>
                           <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </div>
                      )) : <p className="text-sm text-muted-foreground">No approved projects.</p>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground border-b border-muted pb-2 mb-3">Verified Certificates</h4>
                    <div className="space-y-2">
                      {selectedStudent?.certificates?.length > 0 ? selectedStudent.certificates.map((c: any) => (
                        <div key={c.id} className="p-3 bg-muted/20 border border-muted rounded-lg flex items-center justify-between">
                           <span className="text-sm font-medium">{c.title}</span>
                           <ShieldCheck className="w-4 h-4 text-blue-500" />
                        </div>
                      )) : <p className="text-sm text-muted-foreground">No approved certificates.</p>}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
