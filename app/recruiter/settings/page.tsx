'use client'
import Image from 'next/image'

import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileUpload } from '@/components/ui/file-upload'
import { useState, useEffect } from 'react'

export default function RecruiterSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    designation: '',
    companyLogo: '',
    hiringBanner: '',
    industry: '',
    website: '',
    location: '',
    description: '',
    companySize: '',
    foundedYear: '',
    socialLinks: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await fetch('/api/recruiter/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success) {
          const rec = data.recruiter
          setFormData({
            name: rec.user?.name || '',
            company: rec.company || '',
            designation: rec.designation || '',
            companyLogo: rec.companyLogo || '',
            hiringBanner: rec.hiringBanner || '',
            industry: rec.industry || '',
            website: rec.website || '',
            location: rec.location || '',
            description: rec.description || '',
            companySize: rec.companySize || '',
            foundedYear: rec.foundedYear || '',
            socialLinks: rec.socialLinks || ''
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleFileUpload = async (file: File | null, type: 'companyLogo' | 'hiringBanner') => {
    if (!file) return;
    const setUploading = type === 'companyLogo' ? setUploadingLogo : setUploadingBanner;
    
    setUploading(true);
    try {
      const { uploadToS3 } = await import("@/lib/upload");
      const uploadResult = await uploadToS3(file);

      if (!uploadResult.success || !uploadResult.url) {
        alert("Upload Failed: " + uploadResult.message);
        return;
      }

      const token = localStorage.getItem('token');
      const oldUrl = formData[type];
      
      if (oldUrl) {
        await fetch("/api/upload/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ fileUrl: oldUrl })
        }).catch(console.error);
      }

      setFormData(prev => ({ ...prev, [type]: uploadResult.url || "" }));
      alert(`${type === 'companyLogo' ? 'Logo' : 'Banner'} uploaded successfully.`);

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const handleSave = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    setSaving(true)
    try {
      const res = await fetch('/api/recruiter/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        alert('Company Profile saved successfully!')
      } else {
        alert('Failed to save settings: ' + data.message)
      }
    } catch (err) {
      console.error(err)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Company Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your employer branding and company details</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Branding & Media</CardTitle>
            <CardDescription>Upload your company logo and hiring banner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Company Logo (AWS S3)</label>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 shrink-0 bg-muted rounded-xl overflow-hidden flex items-center justify-center border border-border shadow-sm">
                  {formData.companyLogo ? (
                    <Image width={500} height={500} src={formData.companyLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-xs text-muted-foreground">No Logo</span>
                  )}
                </div>
                <div className="w-full max-w-sm">
                  <FileUpload
                    label=""
                    accept="image/*"
                    maxSizeMB={5}
                    onFileSelect={(file) => handleFileUpload(file, 'companyLogo')}
                    uploading={uploadingLogo}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Hiring Banner (AWS S3)</label>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full h-32 bg-muted rounded-xl overflow-hidden flex items-center justify-center border border-border shadow-sm">
                  {formData.hiringBanner ? (
                    <Image width={500} height={500} src={formData.hiringBanner} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-muted-foreground">No Banner Uploaded</span>
                  )}
                </div>
                <div className="w-full max-w-sm shrink-0">
                  <FileUpload
                    label=""
                    accept="image/*"
                    maxSizeMB={10}
                    onFileSelect={(file) => handleFileUpload(file, 'hiringBanner')}
                    uploading={uploadingBanner}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>Provide comprehensive information to attract candidates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Company Name</label>
                <Input value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="bg-card" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Your Designation</label>
                <Input value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} className="bg-card" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Industry</label>
                <Input value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="bg-card" placeholder="e.g. Information Technology" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Website URL</label>
                <Input value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="bg-card" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Headquarters / Location</label>
                <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="bg-card" placeholder="e.g. San Francisco, CA" />
              </div>
              <div className="space-y-2 flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-foreground">Company Size</label>
                  <Input value={formData.companySize} onChange={(e) => setFormData({...formData, companySize: e.target.value})} className="bg-card" placeholder="e.g. 50-200" />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-foreground">Founded Year</label>
                  <Input value={formData.foundedYear} onChange={(e) => setFormData({...formData, foundedYear: e.target.value})} className="bg-card" placeholder="e.g. 2012" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Company Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full h-32 px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Describe your company culture, mission, and vision..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Social Links (LinkedIn/Twitter)</label>
              <Input value={formData.socialLinks} onChange={(e) => setFormData({...formData, socialLinks: e.target.value})} className="bg-card" placeholder="Comma separated links..." />
            </div>

            <div className="pt-4 border-t border-muted">
              <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
                {saving ? 'Saving...' : 'Save Company Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
