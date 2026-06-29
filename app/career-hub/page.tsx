'use client'
import Image from 'next/image'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, FileText, Award, Briefcase, Plus, CheckCircle, Clock, TrendingUp, Building, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const APPLICATION_STAGES = ['PENDING', 'SHORTLISTED', 'INTERVIEW', 'HIRED', 'REJECTED']

export default function CareerHubPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('companies')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [companies, setCompanies] = useState<any[]>([])
  
  // Certificate Modal State
  const [showCertModal, setShowCertModal] = useState(false)
  const [certTitle, setCertTitle] = useState("")
  const [certIssuer, setCertIssuer] = useState("")
  const [certFile, setCertFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  
  // Resume Upload State
  const [resumeUploading, setResumeUploading] = useState(false)

  const handleResumeUpload = async (file: File | null) => {
    if (!file) return;
    setResumeUploading(true);
    try {
      const { uploadToS3 } = await import("@/lib/upload");
      const uploadResult = await uploadToS3(file);

      if (!uploadResult.success || !uploadResult.url) {
        alert("Upload Failed: " + uploadResult.message);
        setResumeUploading(false);
        return;
      }

      // If replacing an existing resume, delete the old one from S3
      const token = localStorage.getItem('token');
      if (student.resume) {
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ fileUrl: student.resume })
        }).catch(console.error);
      }

      // Update Database
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ resume: uploadResult.url })
      });

      const data = await res.json();
      if (data.success) {
        // Optimistic UI Update
        setUser((prev: any) => ({
          ...prev,
          student: {
            ...prev.student,
            resume: uploadResult.url
          }
        }));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Resume upload failed");
    } finally {
      setResumeUploading(false);
    }
  }

  const handleAddCertificate = async () => {
    if (!certTitle || !certIssuer || !certFile) {
      alert("Please fill all fields and select a file");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload to AWS S3 using global utility
      const { uploadToS3 } = await import("@/lib/upload");
      const uploadResult = await uploadToS3(certFile);

      if (!uploadResult.success || !uploadResult.url) {
        alert("Upload Failed: " + uploadResult.message);
        setUploading(false);
        return;
      }

      // 2. Save Certificate to Database
      const token = localStorage.getItem('token');
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: certTitle,
          issuer: certIssuer,
          fileUrl: uploadResult.url
        })
      });

      const data = await res.json();
      if (data.success) {
        // Optimistic UI Update
        setUser((prev: any) => ({
          ...prev,
          student: {
            ...prev.student,
            certificates: [data.certificate, ...(prev.student.certificates || [])]
          }
        }));
        setShowCertModal(false);
        setCertTitle("");
        setCertIssuer("");
        setCertFile(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred");
    } finally {
      setUploading(false);
    }
  }


  const handleOfferAction = async (applicationId: string, action: 'ACCEPT' | 'DECLINE') => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await fetch('/api/applications/offer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ applicationId, action })
      })
      if (res.ok) window.location.reload()
    } catch (e) { console.error(e) }
  }

  const handleInterviewAction = async (interviewId: string, action: 'ACCEPT' | 'REJECT') => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await fetch('/api/interviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ interviewId, action })
      })
      if (res.ok) window.location.reload()
    } catch (e) { console.error(e) }
  }

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm("Are you sure you want to withdraw your application?")) return
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await fetch(`/api/applications?id=${applicationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) window.location.reload()
    } catch (e) { console.error(e) }
  }

  useEffect(() => {

    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const res = await fetch('/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success) {
          setUser(data.user)
        }

        const compRes = await fetch('/api/companies')
        const compData = await compRes.json()
        if (compData.success) {
          setCompanies(compData.companies)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    )
  }

  const student = user?.student || {}
  const certificates = student.certificates || []
  const applications = student.applications || []
  const score = student.score || 0

  const getStageIndex = (status: string) => {
    if (status === 'REJECTED') return APPLICATION_STAGES.length
    return APPLICATION_STAGES.indexOf(status)
  }

  const getStageColor = (stageIndex: number, currentStage: number) => {
    if (stageIndex < currentStage) return 'bg-primary text-primary-foreground'
    if (stageIndex === currentStage) return 'bg-accent text-accent-foreground border-2 border-accent'
    return 'bg-muted text-muted-foreground'
  }

  const getStageTextColor = (stageIndex: number, currentStage: number) => {
    if (stageIndex <= currentStage) return 'text-foreground'
    return 'text-muted-foreground'
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Career Hub</h1>
          <p className="text-lg text-muted-foreground">
            Manage your resume, certificates, and track your interview progress
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 border border-primary/30 backdrop-blur-sm p-8">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 -left-1/2 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 -right-1/2 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <span className="text-sm font-semibold text-accent">Your Score</span>
                </div>
                <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {score}/100
                </h2>
                <p className="text-muted-foreground">
                  Based on your skills, projects, and certifications
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-muted/30 border border-muted rounded-lg p-1">
            <TabsTrigger value="companies" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              <Building className="w-4 h-4 mr-2" />
              Companies
            </TabsTrigger>
            <TabsTrigger value="resume" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              <FileText className="w-4 h-4 mr-2" />
              Resume
            </TabsTrigger>
            <TabsTrigger value="certificates" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              <Award className="w-4 h-4 mr-2" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded">
              <Briefcase className="w-4 h-4 mr-2" />
              Applications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="space-y-6 mt-8">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold text-foreground">Discover Companies</h2>
              <p className="text-muted-foreground">Browse active companies and view their open roles</p>
            </div>
            {companies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <Link href={`/companies/${company.id}`} key={company.id}>
                    <div className="group border border-muted rounded-xl p-6 bg-card hover:border-primary/50 hover:shadow-lg transition-all flex flex-col items-center text-center cursor-pointer h-full">
                      <div className="w-20 h-20 rounded-xl bg-muted overflow-hidden flex items-center justify-center mb-4">
                        {company.companyLogo ? (
                          <Image width={500} height={500} src={company.companyLogo} alt={company.company} className="w-full h-full object-cover" />
                        ) : (
                          <Building className="w-8 h-8 text-muted-foreground opacity-50" />
                        )}
                      </div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{company.company}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{company.industry || 'General'}</p>
                      <div className="mt-4 pt-4 border-t border-muted w-full flex justify-between items-center text-sm">
                        <span className="text-muted-foreground"><Briefcase className="w-4 h-4 inline mr-1"/> {company._count?.jobs || 0} Jobs</span>
                        <span className="text-primary font-medium hover:underline flex items-center gap-1">View Profile <ArrowRight className="w-3 h-3"/></span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center p-12 border border-dashed border-muted rounded-xl text-muted-foreground">
                No companies available at the moment.
              </div>
            )}
          </TabsContent>

          <TabsContent value="resume" className="space-y-6 mt-8">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold text-foreground">Resume Builder</h2>
              <p className="text-muted-foreground">Build and manage your professional resume</p>
            </div>
            <div className="group relative overflow-hidden rounded-xl bg-card border border-primary/30 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 p-8 hover:shadow-2xl hover:shadow-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col items-center justify-center text-center gap-6">
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                  <FileText className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Your Resume</h3>
                  <p className="text-muted-foreground mb-2">
                    {student.resume ? 'Resume uploaded' : 'No resume uploaded yet'}
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap justify-center">
                  {student.resume && (
                    <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                      <Download className="w-4 h-4 mr-2" />
                      <a href={student.resume} target="_blank" rel="noreferrer">Download</a>
                    </Button>
                  )}
                </div>
                <div className="w-full max-w-sm mx-auto mt-4">
                  <FileUpload
                    label={student.resume ? "Replace Resume" : "Upload Resume"}
                    accept="application/pdf"
                    maxSizeMB={10}
                    onFileSelect={handleResumeUpload}
                    uploading={resumeUploading}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6 mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Your Certificates</h2>
                <p className="text-muted-foreground">{certificates.length} professional certifications</p>
              </div>
              <Button 
                onClick={() => setShowCertModal(true)}
                className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/40"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Certificate
              </Button>
            </div>
            
            {showCertModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
                <div className="bg-card border border-primary/20 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
                  <h3 className="text-xl font-bold text-foreground mb-4">Add New Certificate</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Certificate Title</label>
                      <input 
                        type="text" 
                        value={certTitle}
                        onChange={(e) => setCertTitle(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-background border rounded-md text-foreground"
                        placeholder="e.g. AWS Solutions Architect"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Issuer</label>
                      <input 
                        type="text" 
                        value={certIssuer}
                        onChange={(e) => setCertIssuer(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-background border rounded-md text-foreground"
                        placeholder="e.g. Amazon Web Services"
                      />
                    </div>
                    <div>
                      <FileUpload
                        label="Certificate File (PDF/Image)"
                        accept="application/pdf,image/*"
                        maxSizeMB={10}
                        onFileSelect={(file) => setCertFile(file)}
                        uploading={uploading}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 justify-end">
                    <Button variant="outline" onClick={() => setShowCertModal(false)} disabled={uploading}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddCertificate} disabled={uploading} className="bg-primary text-primary-foreground">
                      {uploading ? "Uploading..." : "Save Certificate"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div className="grid gap-4">
              {certificates.length > 0 ? certificates.map((cert: any, idx: number) => (
                <div key={idx} className="group relative overflow-hidden rounded-lg bg-card border border-secondary/20 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20 p-5">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 flex-shrink-0 mt-1">
                        <Award className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors">{cert.title}</h3>
                          {cert.status && (
                            <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full border ${
                              cert.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                              cert.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                              'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            }`}>
                              {cert.status === 'APPROVED' ? 'Verified' : cert.status === 'REJECTED' ? 'Rejected' : 'Pending'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(cert.createdAt).toLocaleDateString()}</p>
                      </div>
                      {cert.fileUrl && (
                        <Button variant="ghost" size="sm" className="text-secondary hover:bg-secondary/10 flex-shrink-0">
                          <a href={cert.fileUrl} target="_blank" rel="noreferrer">View</a>
                        </Button>
                      )}
                    </div>
                    {cert.remarks && (
                      <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 text-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-accent block">Faculty Feedback</span>
                          <span className="text-xs text-muted-foreground italic">
                            {cert.verifiedAt && `Reviewed on ${new Date(cert.verifiedAt).toLocaleDateString()} `}
                            {cert.reviewerName && `by ${cert.reviewerName}`}
                          </span>
                        </div>
                        <span className="text-muted-foreground">{cert.remarks}</span>
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center p-8 bg-card border rounded-lg text-muted-foreground">No certificates yet.</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6 mt-8">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold text-foreground">Application Tracker</h2>
              <p className="text-muted-foreground">Monitor your interview progress across {applications.length} applications</p>
            </div>
            <div className="space-y-4">
              {applications.length > 0 ? applications.map((app: any, idx: number) => {
                const currentStage = getStageIndex(app.status);
                const displayStages = ['PENDING', 'SHORTLISTED', 'INTERVIEW', 'HIRED'];
                return (
                  <div key={idx} className="group relative overflow-hidden rounded-xl bg-card border border-accent/20 backdrop-blur-sm hover:border-accent/60 transition-all duration-300 hover:shadow-xl hover:shadow-accent/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 p-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                            {app.job?.title || 'Unknown Role'}
                          </h3>
                          <p className="text-muted-foreground mt-1">{app.job?.location || 'Remote'}</p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground flex-shrink-0">
                          <p>Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-muted/30">
                        <div className="flex items-center justify-between gap-2">
                          {displayStages.map((stage, stageIdx) => (
                            <div key={stage} className="flex-1 flex items-center gap-2">
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${getStageColor(stageIdx, currentStage)}`}>
                                {stageIdx < currentStage ? <CheckCircle className="w-5 h-5" /> : stageIdx + 1}
                              </div>
                              <span className={`text-xs font-medium ${getStageTextColor(stageIdx, currentStage)}`}>{stage}</span>
                              {stageIdx < displayStages.length - 1 && (
                                <div className={`flex-1 h-0.5 transition-all ${stageIdx < currentStage ? 'bg-primary' : 'bg-muted/30'}`}></div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* Student Action Needed Section */}
                        <div className="mt-4 flex flex-col gap-3">
                          {app.status === 'OFFER' && (
                            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                               <div>
                                 <h4 className="font-bold text-emerald-500">Offer Extended!</h4>
                                 <p className="text-sm text-muted-foreground mt-1">The company has extended an offer. Please review and respond.</p>
                               </div>
                               <div className="flex gap-2">
                                 <Button variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10" onClick={() => handleOfferAction(app.id, 'DECLINE')}>Decline</Button>
                                 <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleOfferAction(app.id, 'ACCEPT')}>Accept Offer</Button>
                               </div>
                            </div>
                          )}
                          
                          {app.interviews?.filter((inv: any) => inv.status === 'SCHEDULED').map((inv: any) => (
                            <div key={inv.id} className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                               <div>
                                 <h4 className="font-bold text-blue-500">Interview Scheduled: Round {inv.round} ({inv.mode})</h4>
                                 <p className="text-sm text-muted-foreground mt-1">{new Date(inv.date).toLocaleString()} • {inv.mode === 'ONLINE' ? 'Virtual' : inv.location}</p>
                               </div>
                               <div className="flex gap-2 shrink-0">
                                 <Button variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10" onClick={() => handleInterviewAction(inv.id, 'REJECT')}>Can't Make It</Button>
                                 <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleInterviewAction(inv.id, 'ACCEPT')}>Confirm Attendance</Button>
                               </div>
                            </div>
                          ))}

                          {app.status === 'PENDING' && (
                             <div className="flex justify-end">
                                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10 text-xs h-7" onClick={() => handleWithdraw(app.id)}>Withdraw Application</Button>
                             </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }) : (
                <div className="text-center p-8 bg-card border rounded-lg text-muted-foreground">No applications yet.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
