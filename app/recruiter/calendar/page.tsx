'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Clock, MapPin, Video, User, X, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

export default function RecruiterCalendarPage() {
  const [interviews, setInterviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const [selectedInterview, setSelectedInterview] = useState<any>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [rescheduleForm, setRescheduleForm] = useState(false)
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '', link: '', location: '', mode: '' })

  const fetchInterviews = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch('/api/recruiter/interviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setInterviews(data.interviews)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInterviews()
  }, [])

  const handleReschedule = async () => {
    const token = localStorage.getItem('token')
    if (!token || !rescheduleData.date || !rescheduleData.time) return alert("Date and time required")
    
    const dateTime = new Date(`${rescheduleData.date}T${rescheduleData.time}`).toISOString()

    try {
      const res = await fetch('/api/recruiter/interviews', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId: selectedInterview.id,
          date: dateTime,
          mode: rescheduleData.mode,
          link: rescheduleData.link,
          location: rescheduleData.location
        })
      })
      if (res.ok) {
        setRescheduleForm(false)
        setDrawerOpen(false)
        fetchInterviews()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleCancel = async () => {
    const token = localStorage.getItem('token')
    if (!token || !confirm("Are you sure you want to cancel this interview? The candidate will be notified.")) return

    try {
      const res = await fetch(`/api/recruiter/interviews?id=${selectedInterview.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        setDrawerOpen(false)
        fetchInterviews()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const openInterview = (interview: any) => {
    setSelectedInterview(interview)
    setRescheduleData({
      date: new Date(interview.date).toISOString().split('T')[0],
      time: new Date(interview.date).toISOString().split('T')[1].substring(0, 5),
      link: interview.link || '',
      location: interview.location || '',
      mode: interview.mode
    })
    setRescheduleForm(false)
    setDrawerOpen(true)
  }

  // Filter interviews by view
  const filteredInterviews = interviews.filter(i => {
    const d = new Date(i.date)
    if (view === 'day') {
      return d.toDateString() === currentDate.toDateString()
    } else if (view === 'month') {
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate)
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      return d >= startOfWeek && d <= endOfWeek
    }
    return true
  })

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Interview Calendar</h1>
            <p className="text-sm text-muted-foreground">Manage and track your upcoming candidate interviews.</p>
          </div>
          
          <div className="flex gap-2 bg-muted/50 p-1 rounded-lg border border-primary/20">
            <Button variant={view === 'day' ? 'default' : 'ghost'} size="sm" onClick={() => setView('day')}>Day</Button>
            <Button variant={view === 'week' ? 'default' : 'ghost'} size="sm" onClick={() => setView('week')}>Week</Button>
            <Button variant={view === 'month' ? 'default' : 'ghost'} size="sm" onClick={() => setView('month')}>Month</Button>
          </div>
        </div>

        <div className="bg-card border border-primary/20 rounded-xl overflow-hidden shadow-lg flex flex-col h-[70vh]">
          {/* Calendar Header */}
          <div className="p-4 border-b border-muted flex justify-between items-center bg-muted/20">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              {view === 'day' ? currentDate.toDateString() : view === 'month' ? currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' }) : 'This Week'}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => {
                const d = new Date(currentDate)
                if (view === 'day') d.setDate(d.getDate() - 1)
                else if (view === 'week') d.setDate(d.getDate() - 7)
                else if (view === 'month') d.setMonth(d.getMonth() - 1)
                setCurrentDate(d)
              }}><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" onClick={() => setCurrentDate(new Date())}>Today</Button>
              <Button variant="outline" size="icon" onClick={() => {
                const d = new Date(currentDate)
                if (view === 'day') d.setDate(d.getDate() + 1)
                else if (view === 'week') d.setDate(d.getDate() + 7)
                else if (view === 'month') d.setMonth(d.getMonth() + 1)
                setCurrentDate(d)
              }}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Calendar Content */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {loading ? (
              <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
            ) : filteredInterviews.length > 0 ? (
              <div className="space-y-4">
                {filteredInterviews.map(interview => (
                  <div key={interview.id} className="flex gap-4 p-4 border border-muted bg-background rounded-xl hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => openInterview(interview)}>
                    <div className="w-24 text-center shrink-0 border-r border-muted pr-4">
                      <p className="text-2xl font-bold text-primary">{new Date(interview.date).getDate()}</p>
                      <p className="text-xs text-muted-foreground uppercase font-bold">{new Date(interview.date).toLocaleDateString('default', { month: 'short' })}</p>
                      <p className="text-xs font-semibold mt-1 bg-muted/50 py-1 rounded">{new Date(interview.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{interview.application?.student?.user?.name}</h3>
                      <p className="text-sm font-medium text-muted-foreground">{interview.application?.job?.title}</p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> Round {interview.round}</span>
                        <span className="flex items-center gap-1">
                          {interview.mode === 'ONLINE' ? <Video className="w-3 h-3 text-blue-500" /> : <MapPin className="w-3 h-3 text-red-500" />}
                          {interview.mode}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          interview.status === 'SCHEDULED' ? 'bg-primary/20 text-primary' :
                          interview.status === 'RESCHEDULED' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-red-500/20 text-red-500'
                        }`}>
                          {interview.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <CalendarIcon className="w-16 h-16 mb-4" />
                <p>No interviews scheduled for this {view}.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {drawerOpen && selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-primary/20 w-full max-w-2xl flex flex-col rounded-xl overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-muted flex justify-between items-center bg-muted/10">
              <div>
                <h2 className="text-2xl font-bold">{selectedInterview.application?.student?.user?.name}</h2>
                <p className="text-sm text-primary font-medium">{selectedInterview.application?.job?.title} (Round {selectedInterview.round})</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-2 text-muted-foreground hover:bg-muted rounded-full">
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            <div className="p-6">
              {rescheduleForm ? (
                <div className="space-y-4">
                  <h3 className="font-bold border-b border-muted pb-2">Reschedule Interview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-sm font-medium">Date</label><Input type="date" value={rescheduleData.date} onChange={e => setRescheduleData({...rescheduleData, date: e.target.value})}/></div>
                    <div className="space-y-2"><label className="text-sm font-medium">Time</label><Input type="time" value={rescheduleData.time} onChange={e => setRescheduleData({...rescheduleData, time: e.target.value})}/></div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mode</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={rescheduleData.mode} onChange={e => setRescheduleData({...rescheduleData, mode: e.target.value})}>
                        <option value="ONLINE">Online</option>
                        <option value="OFFLINE">Offline</option>
                      </select>
                    </div>
                    {rescheduleData.mode === 'ONLINE' ? (
                      <div className="space-y-2"><label className="text-sm font-medium">Meeting Link</label><Input value={rescheduleData.link} onChange={e => setRescheduleData({...rescheduleData, link: e.target.value})}/></div>
                    ) : (
                      <div className="space-y-2"><label className="text-sm font-medium">Office Location</label><Input value={rescheduleData.location} onChange={e => setRescheduleData({...rescheduleData, location: e.target.value})}/></div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-muted">
                    <Button variant="outline" onClick={() => setRescheduleForm(false)}>Cancel</Button>
                    <Button onClick={handleReschedule}>Confirm Reschedule</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg border border-muted">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Scheduled For</p>
                      <p className="font-medium flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-primary"/> {new Date(selectedInterview.date).toLocaleDateString()}</p>
                      <p className="font-medium flex items-center gap-2 mt-1"><Clock className="w-4 h-4 text-primary"/> {new Date(selectedInterview.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Location / Link</p>
                      {selectedInterview.mode === 'ONLINE' ? (
                        <p className="font-medium flex items-center gap-2"><Video className="w-4 h-4 text-blue-500"/> <a href={selectedInterview.link} target="_blank" className="text-blue-500 hover:underline truncate">Join Meeting</a></p>
                      ) : (
                        <p className="font-medium flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500"/> {selectedInterview.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {selectedInterview.status !== 'CANCELLED' && (
                      <>
                        <Button variant="outline" className="flex-1 border-primary/50 text-primary hover:bg-primary/10" onClick={() => setRescheduleForm(true)}>
                          <Edit2 className="w-4 h-4 mr-2" /> Reschedule
                        </Button>
                        <Button variant="outline" className="flex-1 border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-600" onClick={handleCancel}>
                          <Trash2 className="w-4 h-4 mr-2" /> Cancel Interview
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
