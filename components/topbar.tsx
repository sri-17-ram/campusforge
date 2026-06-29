'use client'
import { useState, useEffect } from 'react'
import { Search, Bell, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

export function TopBar() {
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) setUser(JSON.parse(storedUser))

      const token = localStorage.getItem('token')
      if (token) {
        try {
          const res = await fetch('/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const data = await res.json()
          if (data.success && data.user) {
            setUser(data.user)
            localStorage.setItem('user', JSON.stringify(data.user))
            const notifs = data.user.notifications || []
            setNotifications(notifs)
            setUnreadCount(notifs.filter((n: any) => !n.read).length)
          }
        } catch (e) { console.error(e) }
      }
    }
    fetchUserData()
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const markNotificationsRead = async () => {
    if (unreadCount === 0) return
    const token = localStorage.getItem('token')
    if (token) {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setUnreadCount(0)
      setNotifications(notifications.map(n => ({...n, read: true})))
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/50 backdrop-blur-lg">
      <div className="h-16 px-6 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex flex-1 items-center gap-2 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <Input
            placeholder="Search projects, people, skills..."
            className="h-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-auto">
          <ThemeToggle />

          {/* Notifications */}
          <DropdownMenu onOpenChange={(open) => { if (open) markNotificationsRead() }}>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="p-3 border-b font-semibold">Notifications</div>
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div key={n.id} className="p-2 text-sm rounded hover:bg-muted/50">
                      <div className="font-semibold">{n.title}</div>
                      <div className="text-xs text-muted-foreground">{n.message}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet</div>
                )}
              </div>
              <div className="p-2 border-t">
                <Button variant="ghost" className="w-full text-xs text-primary" onClick={() => window.location.href='/recruiter/notifications'}>
                  View Notification Center
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="icon" className="ml-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm uppercase">
                  {user?.name?.[0] || 'U'}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm">
                <p className="font-semibold text-foreground">{user?.name || 'User Name'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'user@campus.dev'}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => window.location.href='/settings'}>
                <Settings className="w-4 h-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
