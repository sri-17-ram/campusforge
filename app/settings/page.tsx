'use client'
import Image from 'next/image'

import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileUpload } from '@/components/ui/file-upload'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sun, Moon, Bell, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    github: '',
    linkedin: '',
    portfolio: '',
    avatar: '',
    resume: ''
  })

  const [avatarUploading, setAvatarUploading] = useState(false)

  const handleFileUpload = async (file: File | null, type: 'avatar') => {
    if (!file) return;
    const setUploading = setAvatarUploading;
    
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
      alert(`Profile photo updated. Remember to save changes!`);

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
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
          const user = data.user
          const student = user.student || {}
          setFormData({
            name: user.name || '',
            email: user.email || '',
            bio: student.bio || '',
            github: student.github || '',
            linkedin: student.linkedin || '',
            portfolio: student.portfolio || '',
            avatar: user.avatar || '',
            resume: student.resume || ''
          })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [router])

  const handleSave = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        // Update user in local storage so topbar/sidebar pick it up immediately
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userObj = JSON.parse(storedUser)
          userObj.name = formData.name
          localStorage.setItem('user', JSON.stringify(userObj))
        }
        alert('Settings saved successfully!')
        window.location.reload()
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
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card border-b border-border rounded-none">
            <TabsTrigger value="profile" className="rounded-none border-b-2 data-[state=active]:border-primary">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="account" className="rounded-none border-b-2 data-[state=active]:border-primary">
              <Lock className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-none border-b-2 data-[state=active]:border-primary">
              <Bell className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and public profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Profile Photo</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 shrink-0 bg-gradient-to-br from-primary to-secondary rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                      {formData.avatar ? (
                        <Image width={500} height={500} src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        formData.name?.[0]?.toUpperCase() || 'U'
                      )}
                    </div>
                    <div className="w-full max-w-sm">
                      <FileUpload
                        label=""
                        accept="image/*"
                        maxSizeMB={5}
                        onFileSelect={(file) => handleFileUpload(file, 'avatar')}
                        uploading={avatarUploading}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-card border-border"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-card border-border opacity-70"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium text-foreground">Bio</label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full h-24 px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Social Links</label>
                  <div className="space-y-2">
                    <Input
                      placeholder="GitHub URL"
                      value={formData.github}
                      onChange={(e) => setFormData({...formData, github: e.target.value})}
                      className="bg-card border-border"
                    />
                    <Input
                      placeholder="LinkedIn URL"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                      className="bg-card border-border"
                    />
                    <Input
                      placeholder="Portfolio Website"
                      value={formData.portfolio}
                      onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                      className="bg-card border-border"
                    />
                  </div>
                </div>



                <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 w-full md:w-auto">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4 mt-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Manage your password and account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Change Password</h3>
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="text-sm font-medium text-foreground">Current Password</label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your current password"
                        className="bg-card border-border pr-10"
                      />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium text-foreground">New Password</label>
                    <Input id="newPassword" type="password" placeholder="Enter your new password" className="bg-card border-border" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</label>
                    <Input id="confirmPassword" type="password" placeholder="Confirm your new password" className="bg-card border-border" />
                  </div>
                  <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto">Update Password</Button>
                </div>
                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold text-destructive mb-4">Danger Zone</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Delete your account and all associated data. This action cannot be undone.</p>
                    <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">Delete Account</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4 mt-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your experience on CampusForge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Theme</h3>
                  <div className="flex gap-4">
                    <button onClick={() => setIsDarkMode(false)} className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${!isDarkMode ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                      <Sun className="w-5 h-5" />
                      <span className="font-medium">Light</span>
                    </button>
                    <button onClick={() => setIsDarkMode(true)} className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${isDarkMode ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                      <Moon className="w-5 h-5" />
                      <span className="font-medium">Dark</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-4 pt-6 border-t border-border">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  {[
                    { label: 'Project updates', description: 'Get notified when projects you are part of are updated' },
                    { label: 'Team invitations', description: 'Receive notifications for new team invitations' },
                    { label: 'Messages', description: 'Alerts for new messages from team members' },
                    { label: 'Career updates', description: 'Notifications about job opportunities and interviews' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 mt-1" />
                    </div>
                  ))}
                </div>
                <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto mt-6">Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
