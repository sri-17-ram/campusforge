'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Bell, Check, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async (page = 1) => {
    const token = localStorage.getItem('token')
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(`/api/notifications?page=${page}&limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setNotifications(data.notifications)
        setPagination(data.pagination)
        setUnreadCount(data.unreadCount)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id?: string) => {
    const token = localStorage.getItem('token')
    if (!token) return
    
    // Optimistic UI update
    if (id) {
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
      setUnreadCount(Math.max(0, unreadCount - 1))
    } else {
      setNotifications(notifications.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    }

    await fetch(`/api/notifications${id ? `?id=${id}` : ''}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
  }

  const handleDelete = async (id?: string) => {
    const token = localStorage.getItem('token')
    if (!token) return
    
    if (id) {
      setNotifications(notifications.filter(n => n.id !== id))
    } else {
      setNotifications([])
      setUnreadCount(0)
    }

    await fetch(`/api/notifications${id ? `?id=${id}` : ''}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (!id) fetchNotifications(1) // Refetch if bulk deleted
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-muted pb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary"/> Notification Center
            </h1>
            <p className="text-muted-foreground mt-1">You have <span className="font-bold text-foreground">{unreadCount}</span> unread notifications.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleMarkAsRead()} disabled={unreadCount === 0} className="border-primary/50 text-primary hover:bg-primary/10">
              <Check className="w-4 h-4 mr-2"/> Mark all as read
            </Button>
            <Button variant="outline" onClick={() => handleDelete()} disabled={notifications.length === 0} className="border-destructive/50 text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4 mr-2"/> Clear all
            </Button>
          </div>
        </div>

        {loading && notifications.length === 0 ? (
          <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-16 border border-dashed border-muted rounded-xl bg-card/50">
            <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4"/>
            <h2 className="text-xl font-bold text-muted-foreground">All caught up!</h2>
            <p className="text-muted-foreground mt-2">You don't have any notifications at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-5 rounded-xl border transition-all flex justify-between gap-4 items-start ${
                  notif.read ? 'bg-card border-muted opacity-70' : 'bg-primary/5 border-primary/30 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {notif.read ? (
                       <CheckCircle2 className="w-5 h-5 text-emerald-500/70" />
                    ) : (
                       <Circle className="w-5 h-5 text-primary fill-primary/20" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-bold ${notif.read ? 'text-foreground' : 'text-primary'}`}>{notif.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                    <time className="text-xs text-muted-foreground/60 mt-2 block">{new Date(notif.createdAt).toLocaleString()}</time>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {!notif.read && (
                    <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notif.id)} className="h-8 text-xs text-muted-foreground hover:text-primary">
                      Mark Read
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(notif.id)} className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-6 border-t border-muted">
            <Button 
              variant="outline" 
              onClick={() => fetchNotifications(pagination.page - 1)} 
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button 
              variant="outline" 
              onClick={() => fetchNotifications(pagination.page + 1)} 
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
