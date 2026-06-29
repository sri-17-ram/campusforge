'use client'
import Image from 'next/image'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, MessageSquare, Clock, FileText, ExternalLink, ShieldCheck, Download, Eye, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function FacultyReviewsPage() {
  const [selectedTab, setSelectedTab] = useState('projects')
  const [projects, setProjects] = useState<any[]>([])
  const [certificates, setCertificates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewTarget, setReviewTarget] = useState<any>(null)
  const [reviewType, setReviewType] = useState<'PROJECT' | 'CERTIFICATE'>('PROJECT')
  const [rating, setRating] = useState(0)
  const [comments, setComments] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    setLoading(true)
    try {
      const res = await fetch('/api/faculty/reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setProjects(data.pendingProjects)
        setCertificates(data.pendingCertificates)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openReviewModal = (item: any, type: 'PROJECT' | 'CERTIFICATE') => {
    setReviewTarget(item)
    setReviewType(type)
    setRating(type === 'PROJECT' ? (item.rating || 0) : 0)
    setComments(type === 'PROJECT' ? (item.reviewComment || '') : (item.remarks || ''))
    setReviewModalOpen(true)
  }

  const submitReview = async (status: 'APPROVED' | 'REJECTED') => {
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const body = {
        type: reviewType,
        id: reviewTarget.id,
        status,
        rating: reviewType === 'PROJECT' ? rating : null,
        comments
      }
      
      const res = await fetch('/api/faculty/reviews', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      if (data.success) {
        setReviewModalOpen(false)
        setReviewTarget(null)
        fetchData()
      } else {
        alert('Failed to submit review')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-8 relative">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Review Center</h1>
          <p className="text-muted-foreground">Approve, reject, and rate student projects and certificates</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/30 border border-muted rounded-lg p-1">
            <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              <FileText className="w-4 h-4 mr-2" /> Projects <span className="ml-2 bg-primary/20 px-2 py-0.5 rounded-full text-xs">{projects.length}</span>
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              <ShieldCheck className="w-4 h-4 mr-2" /> Certificates <span className="ml-2 bg-primary/20 px-2 py-0.5 rounded-full text-xs">{certificates.length}</span>
            </TabsTrigger>
          </TabsList>

          {loading ? (
             <div className="py-20 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : (
            <>
              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-8 mt-6">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-accent"/> Pending Review</h3>
                  {projects.filter(p => p.status === 'PENDING').length === 0 ? (
                    <Card className="border-dashed border-muted bg-transparent shadow-none"><CardContent className="p-8 text-center text-muted-foreground">No pending projects to review.</CardContent></Card>
                  ) : (
                    <div className="grid gap-4">
                      {projects.filter(p => p.status === 'PENDING').map(project => (
                        <div key={project.id} className="p-6 rounded-xl bg-card border border-primary/20 hover:shadow-lg transition-all flex flex-col md:flex-row gap-6">
                          {project.imageUrl && (
                            <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0 border border-muted">
                              <Image width={500} height={500} src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="text-2xl font-bold text-foreground">{project.title}</h3>
                              <p className="text-sm text-muted-foreground">By {project.student?.user?.name || 'Unknown Student'} • {new Date(project.createdAt).toLocaleDateString()}</p>
                            </div>
                            <p className="text-sm text-foreground line-clamp-2">{project.description}</p>
                            <div className="flex gap-2 text-xs flex-wrap">
                              {project.techStack?.split(',').map((tech: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-muted rounded-full">{tech.trim()}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col justify-center shrink-0">
                            <Button onClick={() => openReviewModal(project, 'PROJECT')} className="bg-gradient-to-r from-secondary to-primary">Review Project</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary"/> Reviewed Projects</h3>
                  {projects.filter(p => p.status !== 'PENDING').length === 0 ? (
                    <Card className="border-dashed border-muted bg-transparent shadow-none"><CardContent className="p-8 text-center text-muted-foreground">No reviewed projects.</CardContent></Card>
                  ) : (
                    <div className="grid gap-4">
                      {projects.filter(p => p.status !== 'PENDING').map(project => (
                        <div key={project.id} className="p-6 rounded-xl bg-card border border-muted hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 opacity-75 hover:opacity-100">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-foreground">{project.title}</h3>
                              <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full border ${
                                project.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                              }`}>
                                {project.status}
                              </span>
                              {project.rating && <span className="text-amber-500 text-xs font-bold border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 rounded-full">★ {project.rating}</span>}
                            </div>
                            <p className="text-sm text-muted-foreground">Reviewed on {new Date(project.reviewedAt).toLocaleDateString()}</p>
                            <p className="text-sm text-muted-foreground italic">"{project.reviewComment}"</p>
                          </div>
                          <div className="flex flex-col justify-center shrink-0">
                            <Button onClick={() => openReviewModal(project, 'PROJECT')} variant="outline">Edit Review</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Certificates Tab */}
              <TabsContent value="certificates" className="space-y-8 mt-6">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-accent"/> Pending Review</h3>
                  {certificates.filter(c => c.status === 'PENDING').length === 0 ? (
                    <Card className="border-dashed border-muted bg-transparent shadow-none"><CardContent className="p-8 text-center text-muted-foreground">No pending certificates to review.</CardContent></Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certificates.filter(c => c.status === 'PENDING').map(cert => (
                        <div key={cert.id} className="p-6 rounded-xl bg-card border border-accent/20 hover:shadow-lg transition-all space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <ShieldCheck className="w-8 h-8 text-accent shrink-0" />
                              <div>
                                <h3 className="font-bold text-lg text-foreground">{cert.title}</h3>
                                <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.student?.user?.name}</p>
                              </div>
                            </div>
                          </div>
                          <Button onClick={() => openReviewModal(cert, 'CERTIFICATE')} className="w-full bg-accent hover:bg-accent/90 text-white">Review Certificate</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary"/> Reviewed Certificates</h3>
                  {certificates.filter(c => c.status !== 'PENDING').length === 0 ? (
                    <Card className="border-dashed border-muted bg-transparent shadow-none"><CardContent className="p-8 text-center text-muted-foreground">No reviewed certificates.</CardContent></Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certificates.filter(c => c.status !== 'PENDING').map(cert => (
                        <div key={cert.id} className="p-6 rounded-xl bg-card border border-muted hover:shadow-lg transition-all space-y-4 opacity-75 hover:opacity-100">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <ShieldCheck className="w-8 h-8 text-muted-foreground shrink-0" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-lg text-foreground">{cert.title}</h3>
                                  <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full border ${
                                    cert.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                                  }`}>
                                    {cert.status}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">Reviewed on {new Date(cert.verifiedAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                          <Button onClick={() => openReviewModal(cert, 'CERTIFICATE')} variant="outline" className="w-full">Edit Review</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Review Modal */}
        {reviewModalOpen && reviewTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setReviewModalOpen(false)}></div>
            <div className="relative w-full max-w-2xl bg-card border border-muted rounded-xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Review {reviewType === 'PROJECT' ? 'Project' : 'Certificate'}</h2>
                <Button variant="ghost" size="icon" onClick={() => setReviewModalOpen(false)}><X className="w-5 h-5"/></Button>
              </div>

              {/* Target Details */}
              <div className="bg-muted/30 p-4 rounded-lg border border-muted mb-6 space-y-3">
                <h3 className="font-bold text-xl">{reviewTarget.title}</h3>
                {reviewType === 'PROJECT' && <p className="text-sm">{reviewTarget.description}</p>}
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {reviewTarget.github && <Button variant="outline" size="sm" onClick={() => window.open(reviewTarget.github)}><ExternalLink className="w-4 h-4 mr-2"/> GitHub</Button>}
                  {reviewTarget.demo && <Button variant="outline" size="sm" onClick={() => window.open(reviewTarget.demo)}><ExternalLink className="w-4 h-4 mr-2"/> Live Demo</Button>}
                  {reviewTarget.projectFileUrl && <Button variant="outline" size="sm" onClick={() => window.open(reviewTarget.projectFileUrl)}><Download className="w-4 h-4 mr-2"/> Download Artifact</Button>}
                  {reviewTarget.fileUrl && <Button variant="outline" size="sm" onClick={() => window.open(reviewTarget.fileUrl)}><Eye className="w-4 h-4 mr-2"/> View Certificate Image</Button>}
                  {reviewTarget.credentialUrl && <Button variant="outline" size="sm" onClick={() => window.open(reviewTarget.credentialUrl)}><ExternalLink className="w-4 h-4 mr-2"/> Verify Credential URL</Button>}
                </div>
              </div>

              {/* Review Form */}
              <div className="space-y-6">
                {reviewType === 'PROJECT' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Assign a Rating (1-5)</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(star => (
                        <button key={star} onClick={() => setRating(star)} className={`${rating >= star ? 'text-amber-400' : 'text-muted'} hover:text-amber-300 transition-colors`}>
                          <Star className="w-8 h-8 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Feedback / Comments</label>
                  <textarea 
                    className="w-full bg-card border border-muted rounded-md p-3 focus:border-primary outline-none"
                    rows={4}
                    placeholder={`Provide feedback to the student about their ${reviewType.toLowerCase()}...`}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-muted">
                  <Button 
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white" 
                    onClick={() => submitReview('APPROVED')}
                    disabled={submitting || (reviewType === 'PROJECT' && rating === 0)}
                  >
                    Approve {reviewType === 'PROJECT' && rating === 0 ? '(Select Rating)' : ''}
                  </Button>
                  <Button 
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white" 
                    onClick={() => submitReview('REJECTED')}
                    disabled={submitting}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
