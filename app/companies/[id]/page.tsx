'use client'
import Image from 'next/image'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { MapPin, Globe, Briefcase, Users, Building, ExternalLink, ArrowLeft, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function CompanyProfilePage() {
  const params = useParams()
  const companyId = params.id as string
  
  const [company, setCompany] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState<string | null>(null)
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`/api/companies/${companyId}`)
        const data = await res.json()
        if (data.success) {
          setCompany(data.company)
          setStats(data.stats)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchCompany()
    
    // Attempt to fetch applied jobs if student is logged in
    const fetchApplications = async () => {
      const token = localStorage.getItem('token')
      if (!token) return
      try {
        const res = await fetch('/api/applications', { headers: { 'Authorization': `Bearer ${token}` }})
        const data = await res.json()
        if (data.success && data.applications) {
          setAppliedJobs(data.applications.map((a: any) => a.jobId))
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchApplications()
  }, [companyId])

  const handleApply = async (jobId: string) => {
    const token = localStorage.getItem('token')
    if (!token) return alert('Please login as a student to apply.')
    
    setApplying(jobId)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setAppliedJobs([...appliedJobs, jobId])
      } else {
        alert(data.message || 'Failed to apply')
      }
    } catch (e) {
      alert('An error occurred while applying.')
    } finally {
      setApplying(null)
    }
  }

  if (loading) {
    return <AppLayout><div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div></AppLayout>
  }

  if (!company) {
    return <AppLayout><div className="text-center p-12 text-muted-foreground">Company not found.</div></AppLayout>
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Banner */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-muted border border-primary/20 shadow-lg">
          {company.hiringBanner ? (
            <Image width={500} height={500} src={company.hiringBanner} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30" />
          )}
          <Link href="/career-hub">
            <Button variant="outline" className="absolute top-4 left-4 bg-background/50 backdrop-blur border-none hover:bg-background/80"><ArrowLeft className="w-4 h-4 mr-2"/> Back</Button>
          </Link>
        </div>

        {/* Profile Info Row */}
        <div className="px-4 sm:px-8 -mt-20 relative z-10 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-background bg-card shadow-xl overflow-hidden shrink-0 flex items-center justify-center">
            {company.companyLogo ? (
              <Image width={500} height={500} src={company.companyLogo} alt={company.company} className="w-full h-full object-cover" />
            ) : (
              <Building className="w-16 h-16 text-muted-foreground opacity-50" />
            )}
          </div>
          
          <div className="flex-1 pt-2 md:pt-24 pb-4 w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 w-full">
              <div>
                <h1 className="text-4xl font-bold text-foreground">{company.company || 'Unnamed Company'}</h1>
                <p className="text-lg text-primary font-medium mt-1">{company.industry || 'Tech Industry'}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                  {company.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {company.location}</span>}
                  {company.companySize && <span className="flex items-center gap-1"><Users className="w-4 h-4"/> {company.companySize}</span>}
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline">
                      <Globe className="w-4 h-4"/> Website <ExternalLink className="w-3 h-3 ml-0.5"/>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-primary/20 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">About the Company</h2>
              <div className="prose prose-sm sm:prose dark:prose-invert max-w-none text-muted-foreground">
                {company.description ? (
                  <p className="whitespace-pre-wrap">{company.description}</p>
                ) : (
                  <p className="italic opacity-70">No description provided.</p>
                )}
              </div>
            </div>

            <div className="bg-card border border-primary/20 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Briefcase className="w-6 h-6 text-primary"/> Active Roles</h2>
              {company.jobs && company.jobs.length > 0 ? (
                <div className="space-y-4">
                  {company.jobs.map((job: any) => {
                    const hasApplied = appliedJobs.includes(job.id);
                    return (
                      <div key={job.id} className="border border-muted rounded-xl p-5 hover:border-primary/50 transition-colors bg-muted/10 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center group">
                        <div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{job.title}</h3>
                          <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                            <span className="bg-muted px-2 py-0.5 rounded">{job.employmentType}</span>
                            <span className="bg-muted px-2 py-0.5 rounded">{job.location}</span>
                            <span className="bg-muted px-2 py-0.5 rounded">₹{job.salary}</span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleApply(job.id)}
                          disabled={hasApplied || applying === job.id}
                          className={hasApplied ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-none' : ''}
                        >
                          {applying === job.id ? 'Applying...' : hasApplied ? 'Applied' : <><Send className="w-4 h-4 mr-2"/> Quick Apply</>}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center p-8 border border-dashed border-muted rounded-xl text-muted-foreground">
                  No active job listings at the moment.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-card border border-primary/20 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Hiring Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Total Roles Posted</span>
                  <span className="font-bold text-xl">{stats?.totalJobs || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Applications Processed</span>
                  <span className="font-bold text-xl text-primary">{stats?.totalApplications || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Campus Hires</span>
                  <span className="font-bold text-xl text-emerald-500">{stats?.hiredCount || 0}</span>
                </div>
              </div>
            </div>

            {company.socialLinks && (
              <div className="bg-card border border-primary/20 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Connect</h3>
                <a href={company.socialLinks} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center break-all">
                  <ExternalLink className="w-4 h-4 mr-2 shrink-0"/> {company.socialLinks}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
