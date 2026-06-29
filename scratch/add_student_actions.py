import sys
import re

file_path = r"d:\work\campousforge\app\career-hub\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

handlers_code = """
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
"""

content = content.replace("  useEffect(() => {", handlers_code, 1)

ui_code = """
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
"""

content = content.replace("""
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
""", ui_code, 1)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated career-hub/page.tsx")
