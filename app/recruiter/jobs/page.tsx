'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Briefcase, MapPin, DollarSign, Users, Clock, Plus, Edit2, Trash2, Calendar, Archive, Play, Pause, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', salary: '', 
    employmentType: '', experience: '', department: '', 
    skillsRequired: '', openings: '', deadline: ''
  })

  const fetchJobs = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch('/api/recruiter/jobs', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setJobs(data.jobs || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const openCreateForm = () => {
    setEditingId(null)
    setFormData({
      title: '', description: '', location: '', salary: '', 
      employmentType: '', experience: '', department: '', 
      skillsRequired: '', openings: '', deadline: ''
    })
    setFormOpen(true)
  }

  const openEditForm = (job: any) => {
    setEditingId(job.id)
    setFormData({
      title: job.title || '',
      description: job.description || '',
      location: job.location || '',
      salary: job.salary || '',
      employmentType: job.employmentType || '',
      experience: job.experience || '',
      department: job.department || '',
      skillsRequired: job.skillsRequired || '',
      openings: job.openings ? job.openings.toString() : '',
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ''
    })
    setFormOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.description) return alert("Title and description required")
    const token = localStorage.getItem('token')
    const url = editingId ? `/api/recruiter/jobs/${editingId}` : '/api/recruiter/jobs'
    const method = editingId ? 'PUT' : 'POST'
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setFormOpen(false)
        fetchJobs()
      } else {
        alert("Failed to save job")
      }
    } catch (e) {
      console.error(e)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/recruiter/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) fetchJobs()
    } catch (e) {
      console.error(e)
    }
  }

  const deleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/api/recruiter/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) fetchJobs()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Job Postings</h1>
            <p className="text-muted-foreground">Manage your open positions and attract top talent</p>
          </div>
          <Button onClick={openCreateForm} className="bg-gradient-to-r from-primary to-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : (
          <div className="grid gap-4">
            {jobs.length === 0 && <div className="text-center p-12 text-muted-foreground border border-dashed rounded-xl">No jobs posted yet.</div>}
            
            {jobs.map((job) => (
              <div key={job.id} className="group relative overflow-hidden rounded-xl bg-card border border-secondary/20 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20">
                <div className="relative z-10 p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-6 h-6 text-secondary" />
                        <h3 className="text-xl font-bold text-foreground">{job.title}</h3>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          job.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                          job.status === 'DRAFT' ? 'bg-gray-500/20 text-gray-500 border border-gray-500/30' :
                          job.status === 'PAUSED' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                          'bg-red-500/20 text-red-500 border border-red-500/30'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="ghost" size="icon" onClick={() => openEditForm(job)}><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-500/10" onClick={() => deleteJob(job.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" />{job.location || 'Remote'}</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><DollarSign className="w-4 h-4" />{job.salary || 'Not specified'}</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" />{job._count?.applications || 0} Applicants</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" />{job.employmentType || 'Full-time'}</div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" />{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}</div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-muted/30">
                    <div className="flex gap-2">
                      {job.status !== 'PUBLISHED' && <Button variant="outline" size="sm" onClick={() => updateStatus(job.id, 'PUBLISHED')}><Play className="w-4 h-4 mr-1"/> Publish</Button>}
                      {job.status === 'PUBLISHED' && <Button variant="outline" size="sm" onClick={() => updateStatus(job.id, 'PAUSED')}><Pause className="w-4 h-4 mr-1"/> Pause</Button>}
                      {job.status !== 'CLOSED' && job.status !== 'EXPIRED' && <Button variant="outline" size="sm" onClick={() => updateStatus(job.id, 'CLOSED')}><XCircle className="w-4 h-4 mr-1"/> Close</Button>}
                      {job.status !== 'ARCHIVED' && <Button variant="outline" size="sm" onClick={() => updateStatus(job.id, 'ARCHIVED')}><Archive className="w-4 h-4 mr-1"/> Archive</Button>}
                    </div>
                    <Link href={`/recruiter/jobs/${job.id}`}>
                      <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-white">ATS Dashboard</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 border border-primary/20 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Job' : 'Post New Job'}</h2>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Job Title *</label>
                <Input value={formData.title} onChange={(e: any) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Senior Software Engineer" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Description *</label>
                <textarea className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" value={formData.description} onChange={(e: any) => setFormData({...formData, description: e.target.value})} rows={4} placeholder="Describe the role..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input value={formData.location} onChange={(e: any) => setFormData({...formData, location: e.target.value})} placeholder="e.g. Remote, Bangalore" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Salary Range</label>
                <Input value={formData.salary} onChange={(e: any) => setFormData({...formData, salary: e.target.value})} placeholder="e.g. $100k - $120k" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Employment Type</label>
                <Input value={formData.employmentType} onChange={(e: any) => setFormData({...formData, employmentType: e.target.value})} placeholder="e.g. Full-time, Internship" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience Required</label>
                <Input value={formData.experience} onChange={(e: any) => setFormData({...formData, experience: e.target.value})} placeholder="e.g. 2-4 years" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Input value={formData.department} onChange={(e: any) => setFormData({...formData, department: e.target.value})} placeholder="e.g. Engineering" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Openings</label>
                <Input type="number" value={formData.openings} onChange={(e: any) => setFormData({...formData, openings: e.target.value})} placeholder="e.g. 3" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Skills Required (comma separated)</label>
                <Input value={formData.skillsRequired} onChange={(e: any) => setFormData({...formData, skillsRequired: e.target.value})} placeholder="e.g. React, Node.js, TypeScript" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Application Deadline</label>
                <Input type="date" value={formData.deadline} onChange={(e: any) => setFormData({...formData, deadline: e.target.value})} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-muted/50">
              <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Job</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
