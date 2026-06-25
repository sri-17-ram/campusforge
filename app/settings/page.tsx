'use client'

import { AppLayout } from '@/components/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sun, Moon, Bell, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Settings Tabs */}
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

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 mt-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal details and public profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Profile Photo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl font-bold text-white">
                      JD
                    </div>
                    <Button variant="outline" className="border-border hover:border-primary/50">
                      Change Photo
                    </Button>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      defaultValue="John"
                      className="bg-card border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      defaultValue="Doe"
                      className="bg-card border-border"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john@example.com"
                    className="bg-card border-border"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium text-foreground">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    defaultValue="Full Stack Developer | ML Enthusiast"
                    className="w-full h-24 px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Social Links */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Social Links</label>
                  <div className="space-y-2">
                    <Input
                      placeholder="GitHub URL"
                      defaultValue="github.com/johndoe"
                      className="bg-card border-border"
                    />
                    <Input
                      placeholder="LinkedIn URL"
                      defaultValue="linkedin.com/in/johndoe"
                      className="bg-card border-border"
                    />
                    <Input
                      placeholder="Portfolio Website"
                      defaultValue="johndoe.dev"
                      className="bg-card border-border"
                    />
                  </div>
                </div>

                <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4 mt-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your password and account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Change Password */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Change Password</h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="currentPassword" className="text-sm font-medium text-foreground">
                      Current Password
                    </label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your current password"
                        className="bg-card border-border pr-10"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
                      New Password
                    </label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter your new password"
                      className="bg-card border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      Confirm Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                      className="bg-card border-border"
                    />
                  </div>

                  <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto">
                    Update Password
                  </Button>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-border">
                  <h3 className="font-semibold text-destructive mb-4">Danger Zone</h3>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                      Delete Account
                    </Button>
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
                <CardDescription>
                  Customize your experience on CampusForge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Theme</h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsDarkMode(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                        !isDarkMode
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Sun className="w-5 h-5" />
                      <span className="font-medium">Light</span>
                    </button>
                    <button
                      onClick={() => setIsDarkMode(true)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                        isDarkMode
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Moon className="w-5 h-5" />
                      <span className="font-medium">Dark</span>
                    </button>
                  </div>
                </div>

                {/* Notifications */}
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

                <Button className="bg-primary hover:bg-primary/90 w-full md:w-auto mt-6">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
