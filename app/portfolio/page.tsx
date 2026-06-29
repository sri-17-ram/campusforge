'use client'
import Image from 'next/image'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import {
  Globe,
  Mail,
  Edit2,
  Download,
  ExternalLink,
  Code,
  Award,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileUpload } from '@/components/ui/file-upload'
import { Plus, Trash2, FileText } from 'lucide-react'

const skillColors: Record<string, { bg: string; text: string; border: string }> = {
  'React': { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  'TypeScript': { bg: 'bg-blue-600/20', text: 'text-blue-200', border: 'border-blue-600/30' },
  'Node.js': { bg: 'bg-green-600/20', text: 'text-green-300', border: 'border-green-600/30' },
  'Python': { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
  'Machine Learning': { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
}

export default function PortfolioPage() {
  const router = useRouter()
  const [previewMode, setPreviewMode] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Project Modal State
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [projectTitle, setProjectTitle] = useState("")
  const [projectDesc, setProjectDesc] = useState("")
  const [projectGithub, setProjectGithub] = useState("")
  const [projectDemo, setProjectDemo] = useState("")
  const [projectTechStack, setProjectTechStack] = useState("")
  const [projectImage, setProjectImage] = useState<File | null>(null)
  const [projectFile, setProjectFile] = useState<File | null>(null)
  const [projectUploading, setProjectUploading] = useState(false)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)

  const handleEditProject = (project: any) => {
    setEditingProjectId(project.id)
    setProjectTitle(project.title)
    setProjectDesc(project.description)
    setProjectGithub(project.github || "")
    setProjectDemo(project.demo || "")
    setProjectTechStack(project.techStack || "")
    setProjectImage(null)
    setProjectFile(null)
    setShowProjectModal(true)
  }

  const handleAddProject = async () => {
    if (!projectTitle || !projectDesc) {
      alert("Title and Description are required");
      return;
    }
    setProjectUploading(true);
    try {
      let imageUrl = null;
      let projectFileUrl = null;
      let projectFileName = null;
      let projectFileSize = null;
      let projectFileType = null;
      
      const { uploadToS3 } = await import("@/lib/upload");

      if (projectImage) {
        const uploadResult = await uploadToS3(projectImage);
        if (!uploadResult.success || !uploadResult.url) {
          alert("Image Upload Failed: " + uploadResult.message);
          setProjectUploading(false);
          return;
        }
        imageUrl = uploadResult.url;
      }

      if (projectFile) {
        const fileUploadResult = await uploadToS3(projectFile);
        if (!fileUploadResult.success || !fileUploadResult.url) {
          alert("Project File Upload Failed: " + fileUploadResult.message);
          setProjectUploading(false);
          return;
        }
        projectFileUrl = fileUploadResult.url;
        projectFileName = projectFile.name;
        projectFileSize = projectFile.size;
        projectFileType = projectFile.type;
      }

      const token = localStorage.getItem('token');
      const isEditing = !!editingProjectId;
      
      // If editing and replacing files, we should ideally delete old files from AWS
      // but for simplicity we will just let them be overwritten or leave as orphans 
      // since the prompt says "Delete previous AWS file". Let's do it if we are replacing:
      if (isEditing) {
        const existingProject = student.projects.find((p: any) => p.id === editingProjectId);
        if (imageUrl && existingProject?.imageUrl) {
           await fetch("/api/upload/delete", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify({ fileUrl: existingProject.imageUrl }) }).catch(console.error);
        }
        if (projectFileUrl && existingProject?.projectFileUrl) {
           await fetch("/api/upload/delete", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify({ fileUrl: existingProject.projectFileUrl }) }).catch(console.error);
        }
      }

      const res = await fetch("/api/projects", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(isEditing ? {
          id: editingProjectId,
          title: projectTitle,
          description: projectDesc,
          github: projectGithub,
          demo: projectDemo,
          techStack: projectTechStack,
          ...(imageUrl && { imageUrl }),
          ...(projectFileUrl && { projectFileUrl, projectFileName, projectFileSize, projectFileType })
        } : {
          title: projectTitle,
          description: projectDesc,
          github: projectGithub,
          demo: projectDemo,
          techStack: projectTechStack,
          imageUrl,
          projectFileUrl,
          projectFileName,
          projectFileSize,
          projectFileType
        })
      });

      const data = await res.json();
      if (data.success) {
        setUser((prev: any) => ({
          ...prev,
          student: {
            ...prev.student,
            projects: isEditing 
              ? prev.student.projects.map((p: any) => p.id === editingProjectId ? data.project : p)
              : [data.project, ...(prev.student?.projects || [])]
          }
        }));
        setShowProjectModal(false);
        setEditingProjectId(null);
        setProjectTitle("");
        setProjectDesc("");
        setProjectGithub("");
        setProjectDemo("");
        setProjectTechStack("");
        setProjectImage(null);
        setProjectFile(null);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add project");
    } finally {
      setProjectUploading(false);
    }
  }

  const handleDeleteProject = async (id: string, imageUrl: string | null, projectFileUrl: string | null) => {
    if (!confirm("Delete this project?")) return;
    try {
      const token = localStorage.getItem('token');
      if (imageUrl) {
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ fileUrl: imageUrl })
        }).catch(console.error);
      }
      if (projectFileUrl) {
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ fileUrl: projectFileUrl })
        }).catch(console.error);
      }
      // Assuming a DELETE endpoint exists
      const res = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setUser((prev: any) => ({
          ...prev,
          student: {
            ...prev.student,
            projects: prev.student.projects.filter((p: any) => p.id !== id)
          }
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }

  const handleResumeUpload = async (file: File | null) => {
    if (!file) return;
    setLoading(true);
    try {
      const { uploadToS3 } = await import("@/lib/upload");
      const uploadResult = await uploadToS3(file);

      if (!uploadResult.success || !uploadResult.url) {
        alert("Upload Failed: " + uploadResult.message);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (student.resume) {
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ fileUrl: student.resume })
        }).catch(console.error);
      }

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ 
          resume: uploadResult.url,
          resumeName: file.name,
          resumeSize: file.size,
        })
      });

      const data = await res.json();
      if (data.success) {
        setUser((prev: any) => ({
          ...prev,
          student: {
            ...prev.student,
            resume: uploadResult.url,
            resumeName: file.name,
            resumeSize: file.size,
            resumeUpdatedAt: new Date().toISOString()
          }
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteResume = async () => {
    if (!confirm("Delete your resume?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await fetch("/api/upload/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ fileUrl: student.resume })
      }).catch(console.error);

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ 
          resume: null,
          resumeName: null,
          resumeSize: null,
        })
      });

      const data = await res.json();
      if (data.success) {
        setUser((prev: any) => ({
          ...prev,
          student: {
            ...prev.student,
            resume: null,
            resumeName: null,
            resumeSize: null,
            resumeUpdatedAt: null
          }
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
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
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
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
  const skills = student.skills?.map((s: any) => s.name) || []
  const projects = student.projects || []
  const certificates = student.certificates || []

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header with Preview Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Portfolio</h1>
            <p className="text-muted-foreground mt-2">Professional personal website & project showcase</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="border-primary/50 text-primary hover:bg-primary/10"
          >
            {previewMode ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Exit Preview
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </>
            )}
          </Button>
        </div>

        {/* Premium Hero Profile Section */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20"></div>
          <div className="absolute top-0 -left-1/2 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 -right-1/2 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>

          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 md:items-start">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-primary/40">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="space-y-3">
                  <div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">{user?.name || 'User Name'}</h1>
                    <p className="text-xl text-accent font-semibold">{student.branch ? `${student.branch} Student` : 'Student'}</p>
                  </div>

                  <div className="py-4 border-t border-muted/30">
                    <p className="text-foreground leading-relaxed max-w-2xl">
                      {student.bio || 'Passionate student developer building innovative solutions. Always learning, always building.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4">
                    {student.github && (
                      <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10">
                        <Code className="w-4 h-4 mr-2" />
                        <a href={student.github} target="_blank" rel="noreferrer">GitHub</a>
                      </Button>
                    )}
                    {student.linkedin && (
                      <Button variant="outline" size="sm" className="border-secondary/50 text-secondary hover:bg-secondary/10">
                        <Briefcase className="w-4 h-4 mr-2" />
                        <a href={student.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="border-accent/50 text-accent hover:bg-accent/10">
                      <Mail className="w-4 h-4 mr-2" />
                      <a href={`mailto:${user?.email}`}>Email</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {skills.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">Skills & Expertise</h2>
                <p className="text-sm text-muted-foreground mt-1">Technologies and tools I work with</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl bg-card border border-primary/20 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 p-8 hover:shadow-xl hover:shadow-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-wrap gap-3">
                {skills.map((skill: string, idx: number) => {
                  const colors = skillColors[skill] || {
                    bg: 'bg-primary/20',
                    text: 'text-primary',
                    border: 'border-primary/30',
                  }
                  return (
                    <div
                      key={idx}
                      className={`px-4 py-2 rounded-full border ${colors.bg} ${colors.text} ${colors.border} font-semibold text-sm transition-all hover:shadow-lg hover:shadow-primary/30`}
                    >
                      {skill}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20">
                <Briefcase className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">Featured Projects</h2>
                <p className="text-sm text-muted-foreground mt-1">Showcase of my best work</p>
              </div>
            </div>
            {!previewMode && (
              <Button onClick={() => {
                setEditingProjectId(null);
                setProjectTitle("");
                setProjectDesc("");
                setProjectGithub("");
                setProjectDemo("");
                setProjectTechStack("");
                setProjectImage(null);
                setProjectFile(null);
                setShowProjectModal(true);
              }} className="bg-gradient-to-r from-secondary to-primary text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Project
              </Button>
            )}
          </div>

          {showProjectModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
              <div className="bg-card border border-primary/20 rounded-xl p-6 w-full max-w-2xl shadow-2xl relative my-8">
                <h3 className="text-xl font-bold text-foreground mb-4">{editingProjectId ? "Edit Project" : "Add New Project"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Project Title</label>
                      <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="w-full mt-1 px-3 py-2 bg-background border rounded-md text-foreground" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Description</label>
                      <textarea value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} className="w-full mt-1 px-3 py-2 bg-background border rounded-md text-foreground h-24" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Tech Stack (comma separated)</label>
                      <input type="text" value={projectTechStack} onChange={(e) => setProjectTechStack(e.target.value)} className="w-full mt-1 px-3 py-2 bg-background border rounded-md text-foreground" placeholder="e.g. React, Node.js, PostgreSQL" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Project File (Max 100MB)</label>
                      <FileUpload
                        label=""
                        accept="application/zip,application/x-zip-compressed,application/vnd.rar,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
                        maxSizeMB={100}
                        onFileSelect={setProjectFile}
                        uploading={projectUploading}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">GitHub URL (Optional)</label>
                      <input type="text" value={projectGithub} onChange={(e) => setProjectGithub(e.target.value)} className="w-full mt-1 px-3 py-2 bg-background border rounded-md text-foreground" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Live Demo URL (Optional)</label>
                      <input type="text" value={projectDemo} onChange={(e) => setProjectDemo(e.target.value)} className="w-full mt-1 px-3 py-2 bg-background border rounded-md text-foreground" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Project Thumbnail (Optional)</label>
                      <FileUpload
                        label=""
                        accept="image/*"
                        maxSizeMB={5}
                        onFileSelect={setProjectImage}
                        uploading={projectUploading}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6 justify-end">
                  <Button variant="outline" onClick={() => setShowProjectModal(false)} disabled={projectUploading}>Cancel</Button>
                  <Button onClick={handleAddProject} disabled={projectUploading} className="bg-primary">{projectUploading ? "Uploading..." : "Save Project"}</Button>
                </div>
              </div>
            </div>
          )}

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project: any, idx: number) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-xl bg-card border border-secondary/20 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="relative z-10 flex flex-col gap-4 h-full">
                    {project.imageUrl && (
                      <div className="w-full h-48 rounded-lg overflow-hidden shrink-0">
                        <Image width={500} height={500} src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                      <div className="flex flex-col p-6 pt-2">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {project.status && (
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                                project.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                project.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              }`}>
                                {project.status === 'APPROVED' ? 'Verified' : project.status === 'REJECTED' ? 'Rejected' : 'Pending Review'}
                              </span>
                            )}
                            {project.rating && (
                              <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                                ★ {project.rating}
                              </span>
                            )}
                            {project.github && (
                              <a href={project.github} target="_blank" rel="noreferrer">
                                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors flex-shrink-0" />
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {project.description}
                        </p>
                        {project.reviewComment && (
                          <div className="mb-4 p-3 rounded-lg bg-accent/5 border border-accent/20 text-sm">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-accent block">Faculty Feedback</span>
                              <span className="text-xs text-muted-foreground italic">
                                {project.reviewedAt && `Reviewed on ${new Date(project.reviewedAt).toLocaleDateString()} `}
                                {project.reviewerName && `by ${project.reviewerName}`}
                              </span>
                            </div>
                            <span className="text-muted-foreground">{project.reviewComment}</span>
                          </div>
                        )}
                        {project.techStack && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.techStack.split(',').map((tech: string, i: number) => (
                            <span key={i} className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.projectFileUrl && (
                        <div className="mt-auto p-3 bg-muted/30 rounded-lg border flex items-center justify-between">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{project.projectFileName}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{(project.projectFileSize / (1024 * 1024)).toFixed(2)} MB</span>
                                <span>•</span>
                                <span>{new Date(project.projectUpdatedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {(!project.projectFileName?.endsWith('.zip') && !project.projectFileName?.endsWith('.rar')) && (
                              <Button variant="ghost" size="icon" onClick={() => window.open(project.projectFileUrl, '_blank')}>
                                <Eye className="w-4 h-4 text-secondary" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => window.open(project.projectFileUrl, '_blank')}>
                              <Download className="w-4 h-4 text-primary" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 w-full px-6 pb-6 mt-auto">
                      {!previewMode && project.demo && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-1 text-secondary hover:bg-secondary/10 justify-between group/btn"
                          onClick={() => window.open(project.demo, '_blank')}
                        >
                          View Demo
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      )}
                      {!previewMode && (
                        <>
                          <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 ml-auto" onClick={() => handleEditProject(project)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteProject(project.id, project.imageUrl, project.projectFileUrl)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground bg-card p-6 rounded-lg text-center border">
              No projects added yet.
            </div>
          )}
        </div>

        {/* Resume Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">Resume</h2>
                <p className="text-sm text-muted-foreground mt-1">Professional curriculum vitae</p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-card border border-primary/20 backdrop-blur-sm p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center">
              {student.resume ? (
                <>
                  <div className="flex-1 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                        {student.resumeName || 'Resume.pdf'}
                        {student.resumeStatus && (
                          <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full border ${
                            student.resumeStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            student.resumeStatus === 'REJECTED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {student.resumeStatus === 'APPROVED' ? 'Verified' : student.resumeStatus === 'REJECTED' ? 'Rejected' : 'Pending'}
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        {student.resumeSize && (
                          <>
                            <span>{(student.resumeSize / (1024 * 1024)).toFixed(2)} MB</span>
                            <span>•</span>
                          </>
                        )}
                        <span>{student.resumeUpdatedAt ? new Date(student.resumeUpdatedAt).toLocaleDateString() : 'Uploaded'}</span>
                        {student.resumeRating && (
                          <>
                            <span>•</span>
                            <span className="text-amber-500 font-bold">★ {student.resumeRating}/5</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {student.resumeFeedback && (
                    <div className="w-full md:w-auto flex-1 bg-accent/5 border border-accent/20 p-3 rounded-lg text-sm md:ml-4">
                      <span className="font-semibold text-accent block mb-1">Faculty Feedback:</span>
                      <span className="text-muted-foreground">{student.resumeFeedback}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                    <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10" onClick={() => window.open(student.resume, '_blank')}>
                      <Eye className="w-4 h-4 mr-2" /> Preview
                    </Button>
                    <Button variant="outline" className="border-secondary/30 text-secondary hover:bg-secondary/10" onClick={() => window.open(student.resume, '_blank')}>
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                    {!previewMode && (
                      <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={handleDeleteResume}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    )}
                  </div>
                  {!previewMode && (
                    <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-muted pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0">
                      <FileUpload
                        label=""
                        accept="application/pdf"
                        maxSizeMB={10}
                        onFileSelect={handleResumeUpload}
                        uploading={loading}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full">
                  {!previewMode ? (
                    <FileUpload
                      label="Upload your resume (PDF only)"
                      accept="application/pdf"
                      maxSizeMB={10}
                      onFileSelect={handleResumeUpload}
                      uploading={loading}
                    />
                  ) : (
                    <div className="text-muted-foreground text-center p-4">No resume uploaded.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certificates & Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Certificates */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20">
                <Award className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Certificates</h2>
                <p className="text-sm text-muted-foreground mt-1">{certificates.length} professional credentials</p>
              </div>
            </div>

            <div className="space-y-3">
              {certificates.length > 0 ? (
                certificates.map((cert: any, idx: number) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden rounded-lg bg-card border border-accent/20 backdrop-blur-sm hover:border-accent/60 transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 p-4"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10 flex items-start gap-3">
                      <Award className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm group-hover:text-accent transition-colors">
                          {cert.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{cert.issuer || 'Verified credential'}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground bg-card p-4 rounded-lg text-center border text-sm">
                  No certificates yet.
                </div>
              )}
            </div>
          </div>

          {/* Contact & Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Connect</h2>
                <p className="text-sm text-muted-foreground mt-1">Get in touch with me</p>
              </div>
            </div>

            <div className="space-y-3">
              {student.portfolio && (
                <div className="group relative overflow-hidden rounded-lg bg-card border border-primary/20 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 p-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Personal Website</p>
                    <a
                      href={student.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-foreground font-semibold group-hover:text-primary transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      {student.portfolio.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}

              <div className="group relative overflow-hidden rounded-lg bg-card border border-secondary/20 backdrop-blur-sm hover:border-secondary/60 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/20 p-4">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email</p>
                  <a
                    href={`mailto:${user?.email}`}
                    className="flex items-center gap-2 text-foreground font-semibold group-hover:text-secondary transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
