'use client'
import Image from 'next/image'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Award, FileText, CheckCircle, Clock, X, Star, Link as LinkIcon, Download, Eye, ExternalLink, ShieldCheck } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

export default function FacultyStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [department, setDepartment] = useState('')
  const [page, setPage] = useState(1)

  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Drawer specific states for review
  const [resumeRating, setResumeRating] = useState(0)
  const [resumeFeedback, setResumeFeedback] = useState('')
  const [profileRating, setProfileRating] = useState(0)
  const [profileFeedback, setProfileFeedback] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const fetchStudents = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    setLoading(true)
    try {
      const res = await fetch(`/api/faculty/students?search=${searchQuery}&department=${department}&page=${page}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setStudents(data.students)
        setTotalCount(data.totalCount)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, department, page])

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchStudents()
    }, 500)
    return () => clearTimeout(debounce)
  }, [searchQuery, department, page, fetchStudents])

  const openStudent = (student: any) => {
    setSelectedStudent(student)
    setResumeRating(student.resumeRating || 0)
    setResumeFeedback(student.resumeFeedback || '')
    setProfileRating(student.profileRating || 0)
    setProfileFeedback(student.profileFeedback || '')
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setSelectedStudent(null)
  }

  const submitReview = async (type: 'RESUME' | 'PROFILE') => {
    if (!selectedStudent) return
    setSubmittingReview(true)
    try {
      const token = localStorage.getItem('token')
      const body = {
        type,
        id: selectedStudent.id,
        rating: type === 'RESUME' ? resumeRating : profileRating,
        comments: type === 'RESUME' ? resumeFeedback : profileFeedback,
        status: "APPROVED" // Simplify for now
      }

      const res = await fetch('/api/faculty/reviews', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      if (data.success) {
        alert(`${type} review saved successfully!`)
        fetchStudents() // refresh list
      } else {
        alert("Failed to save review")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSubmittingReview(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Student Management</h1>
          <p className="text-muted-foreground mt-1">Search, filter, and review student profiles globally</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-muted focus:border-primary"
            />
          </div>
          <select 
            className="px-4 py-2 bg-card border border-muted rounded-md text-sm text-foreground focus:outline-none focus:border-primary"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
          </select>
        </div>

        {/* Table/List */}
        <div className="bg-card border border-muted rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : students.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No students found matching your criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Student</th>
                    <th className="px-6 py-4 font-medium">Department</th>
                    <th className="px-6 py-4 font-medium">Placement Status</th>
                    <th className="px-6 py-4 font-medium">Metrics</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shrink-0">
                            {student.user.avatar ? (
                              <Image width={500} height={500} src={student.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                            ) : (
                              student.user.name[0].toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{student.user.name}</div>
                            <div className="text-xs text-muted-foreground">{student.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {student.branch || <span className="text-muted-foreground italic">Not specified</span>}
                      </td>
                      <td className="px-6 py-4">
                        {student.isPlacementReady ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Ready
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            Not Ready
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1" title="Projects"><Award className="w-4 h-4 text-primary" /> {student.projects.length}</span>
                          <span className="flex items-center gap-1" title="Certificates"><ShieldCheck className="w-4 h-4 text-accent" /> {student.certificates.length}</span>
                          <span className="flex items-center gap-1" title="Resume"><FileText className={`w-4 h-4 ${student.resume ? 'text-secondary' : 'text-muted'}`} /></span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="outline" size="sm" onClick={() => openStudent(student)}>View Profile</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Drawer */}
        {drawerOpen && selectedStudent && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={closeDrawer}></div>
            <div className="relative w-full max-w-2xl bg-card border-l border-muted h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right-full">
              <div className="sticky top-0 z-10 bg-card border-b border-muted p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Student Profile</h2>
                <Button variant="ghost" size="icon" onClick={closeDrawer}><X className="w-5 h-5" /></Button>
              </div>
              
              <div className="p-6 space-y-8">
                {/* Header Info */}
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shrink-0">
                    {selectedStudent.user.avatar ? (
                      <Image width={500} height={500} src={selectedStudent.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      selectedStudent.user.name[0].toUpperCase()
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <h3 className="text-3xl font-bold text-foreground">{selectedStudent.user.name}</h3>
                    <p className="text-muted-foreground">{selectedStudent.branch || 'No Department'} • Year {selectedStudent.year || 'N/A'}</p>
                    <div className="flex gap-2 pt-2">
                      {selectedStudent.github && <a href={selectedStudent.github} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm flex items-center gap-1"><ExternalLink className="w-3 h-3"/> GitHub</a>}
                      {selectedStudent.linkedin && <a href={selectedStudent.linkedin} target="_blank" rel="noreferrer" className="text-secondary hover:underline text-sm flex items-center gap-1"><ExternalLink className="w-3 h-3"/> LinkedIn</a>}
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg border border-muted text-sm text-foreground">
                  <span className="font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Bio</span>
                  {selectedStudent.bio || 'No biography provided.'}
                </div>

                {/* Profile Grading */}
                <div className="border border-primary/20 rounded-xl p-5 space-y-4 bg-primary/5">
                  <h4 className="font-bold text-primary flex items-center gap-2"><Star className="w-5 h-5"/> Profile Evaluation</h4>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} onClick={() => setProfileRating(star)} className={`${profileRating >= star ? 'text-amber-400' : 'text-muted'} hover:text-amber-300 transition-colors`}>
                        <Star className="w-6 h-6 fill-current" />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    placeholder="Leave feedback on overall profile..." 
                    className="w-full bg-card border border-muted rounded-md p-3 text-sm focus:border-primary outline-none"
                    rows={3}
                    value={profileFeedback}
                    onChange={(e) => setProfileFeedback(e.target.value)}
                  />
                  <Button onClick={() => submitReview('PROFILE')} disabled={submittingReview} size="sm">Save Profile Review</Button>
                </div>

                {/* Resume Section */}
                <div className="space-y-3">
                  <h4 className="font-bold text-lg text-foreground border-b border-muted pb-2">Resume</h4>
                  {selectedStudent.resume ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border border-muted rounded-lg bg-card">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-secondary" />
                          <div>
                            <p className="font-medium text-sm text-foreground">{selectedStudent.resumeName || 'Resume.pdf'}</p>
                            <p className="text-xs text-muted-foreground">Uploaded on {new Date(selectedStudent.resumeUpdatedAt || new Date()).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => window.open(selectedStudent.resume, '_blank')}><Eye className="w-4 h-4 text-secondary"/></Button>
                          <Button variant="ghost" size="icon" onClick={() => window.open(selectedStudent.resume, '_blank')}><Download className="w-4 h-4 text-primary"/></Button>
                        </div>
                      </div>
                      <div className="border border-secondary/20 rounded-xl p-5 space-y-4 bg-secondary/5">
                        <h4 className="font-bold text-secondary flex items-center gap-2"><FileText className="w-5 h-5"/> Resume Evaluation</h4>
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(star => (
                            <button key={star} onClick={() => setResumeRating(star)} className={`${resumeRating >= star ? 'text-amber-400' : 'text-muted'} hover:text-amber-300 transition-colors`}>
                              <Star className="w-6 h-6 fill-current" />
                            </button>
                          ))}
                        </div>
                        <textarea 
                          placeholder="Leave feedback on resume..." 
                          className="w-full bg-card border border-muted rounded-md p-3 text-sm focus:border-secondary outline-none"
                          rows={3}
                          value={resumeFeedback}
                          onChange={(e) => setResumeFeedback(e.target.value)}
                        />
                        <Button onClick={() => submitReview('RESUME')} disabled={submittingReview} size="sm" variant="secondary">Save Resume Review</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Student has not uploaded a resume yet.</p>
                  )}
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <h4 className="font-bold text-lg text-foreground border-b border-muted pb-2">Top Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map((skill: any) => (
                      <span key={skill.id} className="px-3 py-1 bg-muted/50 border border-muted rounded-full text-xs font-medium text-foreground">
                        {skill.name}
                      </span>
                    ))}
                    {selectedStudent.skills.length === 0 && <span className="text-muted-foreground text-sm">No skills added.</span>}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
