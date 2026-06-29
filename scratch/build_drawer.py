import sys

file_path = r"d:\work\campousforge\app\recruiter\jobs\[id]\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if "      {drawerOpen && selectedApp && (" in line:
        start_idx = i
    if start_idx != -1 and i > start_idx and "      )}\n" == line or "      )}\r\n" == line:
        end_idx = i
        break

if start_idx == -1 or end_idx == -1:
    print("Could not find bounds")
    sys.exit(1)

new_drawer = """      {drawerOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background border border-primary/20 w-full max-w-6xl max-h-[95vh] h-full flex flex-col rounded-xl overflow-hidden shadow-2xl relative">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-muted bg-card flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-primary/20 shrink-0">
                   {selectedApp?.student?.user?.avatar ? <img src={selectedApp.student.user.avatar} className="w-full h-full object-cover"/> : <User className="w-8 h-8 text-muted-foreground" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {selectedApp?.student?.user?.name}
                    {selectedApp?.student?.isPlacementReady && <span className="bg-emerald-500/10 text-emerald-500 text-xs px-2 py-0.5 rounded-full border border-emerald-500/20">Placement Ready</span>}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">{selectedApp?.student?.branch} • Employability Score: <span className="font-bold text-primary">{selectedApp?.student?.score || 0}/100</span></p>
                </div>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-2 text-muted-foreground hover:bg-muted rounded-full">
                <X className="w-6 h-6"/>
              </button>
            </div>

            <Tabs defaultValue="profile" className="flex-1 flex flex-col overflow-hidden">
               <div className="px-6 py-2 border-b border-muted bg-muted/10 shrink-0">
                 <TabsList>
                   <TabsTrigger value="profile">Profile & Credentials</TabsTrigger>
                   <TabsTrigger value="activity">Activity & Timeline</TabsTrigger>
                   <TabsTrigger value="manage">Management & Actions</TabsTrigger>
                 </TabsList>
               </div>
               
               {/* TAB 1: Profile & Credentials */}
               <TabsContent value="profile" className="flex-1 overflow-y-auto p-6 m-0 h-full">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                   {/* Left Column */}
                   <div className="space-y-6">
                     <div className="bg-card border border-muted rounded-xl p-5 shadow-sm">
                       <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2"><MapPin className="w-4 h-4 text-accent"/> Overview</h3>
                       <p className="text-sm text-muted-foreground mb-4 whitespace-pre-wrap">{selectedApp?.student?.bio || 'No bio provided.'}</p>
                       
                       <div className="space-y-2 text-sm">
                         {selectedApp?.student?.github && (
                           <a href={selectedApp.student.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                             <ExternalLink className="w-4 h-4"/> GitHub Profile
                           </a>
                         )}
                         {selectedApp?.student?.linkedin && (
                           <a href={selectedApp.student.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                             <ExternalLink className="w-4 h-4"/> LinkedIn Profile
                           </a>
                         )}
                         {selectedApp?.student?.portfolio && (
                           <a href={selectedApp.student.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                             <ExternalLink className="w-4 h-4"/> Portfolio Website
                           </a>
                         )}
                       </div>
                     </div>

                     <div className="bg-card border border-muted rounded-xl p-5 shadow-sm">
                       <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2"><Star className="w-4 h-4 text-amber-500"/> Ratings & Reviews</h3>
                       <div className="space-y-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Profile Rating:</span>
                            <div className="flex items-center mt-1">{selectedApp?.student?.profileRating ? <><Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1"/> <span className="font-bold">{selectedApp.student.profileRating}/5</span></> : <span className="text-muted-foreground italic">Not rated</span>}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Faculty Feedback:</span>
                            <p className="mt-1 bg-muted/30 p-2 rounded text-muted-foreground italic border border-muted/50">{selectedApp?.student?.profileFeedback || 'No feedback yet.'}</p>
                          </div>
                       </div>
                     </div>

                     <div className="bg-card border border-muted rounded-xl p-5 shadow-sm">
                       <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary"/> Skills</h3>
                       <div className="flex flex-wrap gap-2">
                         {selectedApp?.student?.skills?.map((s: any) => (
                           <span key={s.id} className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full text-xs font-medium">
                             {s.name}
                           </span>
                         ))}
                         {(!selectedApp?.student?.skills || selectedApp.student.skills.length === 0) && <span className="text-sm text-muted-foreground">No skills listed.</span>}
                       </div>
                     </div>
                   </div>

                   {/* Middle Column */}
                   <div className="space-y-6">
                     <div className="bg-card border border-muted rounded-xl p-5 shadow-sm">
                       <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500"/> Verified Projects</h3>
                       <div className="space-y-3">
                         {selectedApp?.student?.projects?.filter((p:any) => p.status === 'APPROVED').map((p: any) => (
                           <div key={p.id} className="text-sm p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                             <p className="font-bold">{p.title}</p>
                             <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                             {p.rating && <p className="text-xs text-amber-500 flex items-center mt-2"><Star className="w-3 h-3 mr-1 fill-amber-500"/> {p.rating} / 5 Rating</p>}
                           </div>
                         ))}
                         {(!selectedApp?.student?.projects?.filter((p:any) => p.status === 'APPROVED').length) && <span className="text-sm text-muted-foreground">No verified projects.</span>}
                       </div>
                     </div>

                     <div className="bg-card border border-muted rounded-xl p-5 shadow-sm">
                       <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2"><Award className="w-4 h-4 text-purple-500"/> Verified Certificates</h3>
                       <div className="space-y-3">
                         {selectedApp?.student?.certificates?.filter((c:any) => c.status === 'APPROVED').map((c: any) => (
                           <div key={c.id} className="text-sm p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                             <p className="font-bold">{c.title}</p>
                             <p className="text-xs text-muted-foreground mt-1">{c.issuer}</p>
                             {c.credentialUrl && (
                               <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-500 mt-2 flex items-center hover:underline">
                                 <ExternalLink className="w-3 h-3 mr-1"/> View Credential
                               </a>
                             )}
                           </div>
                         ))}
                         {(!selectedApp?.student?.certificates?.filter((c:any) => c.status === 'APPROVED').length) && <span className="text-sm text-muted-foreground">No verified certificates.</span>}
                       </div>
                     </div>
                   </div>

                   {/* Right Column (Resume) */}
                   <div className="bg-card border border-muted rounded-xl shadow-sm flex flex-col overflow-hidden relative">
                      <div className="p-4 border-b border-muted flex justify-between items-center bg-muted/30 shrink-0">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-secondary" />
                          <div>
                            <h3 className="font-bold text-foreground">Resume Viewer</h3>
                            {selectedApp?.student?.resumeStatus === 'APPROVED' ? (
                              <span className="text-xs text-emerald-500 font-semibold flex items-center"><ShieldCheck className="w-3 h-3 mr-1"/> Faculty Verified</span>
                            ) : (
                              <span className="text-xs text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1"/> Pending Verification</span>
                            )}
                          </div>
                        </div>
                        {selectedApp?.student?.resume && (
                          <a href={selectedApp.student.resume} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4"/> Download</Button>
                          </a>
                        )}
                      </div>
                      
                      {selectedApp?.student?.resume && (
                         <div className="px-4 py-2 bg-background border-b border-muted flex gap-6 text-xs text-muted-foreground shrink-0">
                           <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {selectedApp.student.resumeUpdatedAt ? new Date(selectedApp.student.resumeUpdatedAt).toLocaleDateString() : 'Unknown'}</span>
                           {selectedApp.student.resumeRating && <span className="flex items-center gap-1 text-amber-500"><Star className="w-3 h-3 fill-amber-500"/> {selectedApp.student.resumeRating}/5</span>}
                         </div>
                      )}

                      <div className="flex-1 bg-muted/20 relative min-h-[300px]">
                        {selectedApp?.student?.resume ? (
                          <iframe 
                            src={`${selectedApp.student.resume}#view=FitH`} 
                            className="absolute inset-0 w-full h-full border-0" 
                            title="Resume Preview"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground flex-col gap-2">
                            <FileText className="w-12 h-12 opacity-20"/>
                            <p>No resume uploaded</p>
                          </div>
                        )}
                      </div>
                   </div>
                 </div>
               </TabsContent>

               {/* TAB 2: Activity & Timeline */}
               <TabsContent value="activity" className="flex-1 overflow-y-auto p-6 m-0">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                     <div className="bg-card border border-muted rounded-xl p-5 shadow-sm">
                        <h3 className="font-semibold mb-6 text-foreground flex items-center gap-2"><Activity className="w-5 h-5 text-primary"/> Application Timeline</h3>
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
                          {selectedApp?.timeline?.map((t: any) => (
                            <div key={t.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                  <div className="w-2 h-2 bg-background rounded-full"></div>
                                </div>
                                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-card border border-muted p-4 rounded shadow-sm">
                                  <div className="flex items-center justify-between space-x-2 mb-1">
                                      <div className="font-bold text-foreground text-sm">{t.status}</div>
                                      <time className="text-xs font-medium text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</time>
                                  </div>
                                </div>
                            </div>
                          ))}
                          {(!selectedApp?.timeline || selectedApp.timeline.length === 0) && <div className="text-muted-foreground text-sm pl-8">No timeline events recorded.</div>}
                        </div>
                     </div>
                   </div>

                   <div className="space-y-6">
                     <div className="bg-card border border-muted rounded-xl p-5 shadow-sm">
                        <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2"><Clock className="w-5 h-5 text-accent"/> Recent Platform Activity</h3>
                        <div className="space-y-4">
                           {selectedApp?.student?.user?.activities?.map((act: any) => (
                             <div key={act.id} className="border-l-2 border-primary/50 pl-4 py-1">
                               <p className="font-semibold text-sm">{act.action}</p>
                               <p className="text-xs text-muted-foreground mt-0.5">{act.details}</p>
                               <p className="text-xs text-muted-foreground/60 mt-1">{new Date(act.createdAt).toLocaleString()}</p>
                             </div>
                           ))}
                           {(!selectedApp?.student?.user?.activities || selectedApp.student.user.activities.length === 0) && <p className="text-sm text-muted-foreground">No recent activities.</p>}
                        </div>
                     </div>
                     
                     <div className="bg-card border border-muted rounded-xl p-5 shadow-sm">
                        <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2"><Calendar className="w-5 h-5 text-secondary"/> Interview Rounds</h3>
                        <div className="space-y-3">
                           {selectedApp?.interviews?.map((inv: any) => (
                             <div key={inv.id} className="bg-muted/20 border border-muted p-3 rounded-lg flex flex-col gap-2">
                               <div className="flex justify-between items-center">
                                 <span className="font-bold text-sm">Round {inv.round} - {inv.mode}</span>
                                 <span className={`text-xs px-2 py-0.5 rounded-full ${inv.status === 'SCHEDULED' ? 'bg-blue-500/10 text-blue-500' : inv.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{inv.status}</span>
                               </div>
                               <div className="text-xs text-muted-foreground">
                                 {new Date(inv.scheduledAt).toLocaleString()} • {inv.interviewerName}
                               </div>
                               {inv.meetingLink && <a href={inv.meetingLink} target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"><ExternalLink className="w-3 h-3"/> Join Meeting</a>}
                             </div>
                           ))}
                           {(!selectedApp?.interviews || selectedApp.interviews.length === 0) && <p className="text-sm text-muted-foreground">No interviews scheduled yet.</p>}
                        </div>
                     </div>
                   </div>
                 </div>
               </TabsContent>

               {/* TAB 3: Management & Actions */}
               <TabsContent value="manage" className="flex-1 overflow-y-auto p-6 m-0">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   
                   <div className="space-y-6">
                     <div className="bg-card border border-muted rounded-xl p-6 shadow-sm space-y-4">
                       <h3 className="font-bold text-lg text-foreground border-b border-muted pb-4">Pipeline Actions</h3>
                       <p className="text-sm text-muted-foreground mb-4">Current Status: <span className="font-bold text-foreground">{selectedApp?.status}</span></p>
                       <div className="flex flex-col gap-3">
                         <Button onClick={() => updateStatus(selectedApp.id, 'TECHNICAL_ROUND')} variant="outline" className="justify-start text-indigo-500 hover:text-indigo-600 hover:bg-indigo-500/10 border-indigo-500/30 w-full"><Briefcase className="w-4 h-4 mr-2"/> Move to Technical Round</Button>
                         <Button onClick={() => updateStatus(selectedApp.id, 'HR_ROUND')} variant="outline" className="justify-start text-purple-500 hover:text-purple-600 hover:bg-purple-500/10 border-purple-500/30 w-full"><Briefcase className="w-4 h-4 mr-2"/> Move to HR Round</Button>
                         <Button onClick={() => updateStatus(selectedApp.id, 'OFFER')} variant="outline" className="justify-start text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30 w-full"><CheckCircle className="w-4 h-4 mr-2"/> Extend Offer</Button>
                         <Button onClick={() => updateStatus(selectedApp.id, 'REJECTED')} variant="outline" className="justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/30 w-full"><X className="w-4 h-4 mr-2"/> Reject Candidate</Button>
                       </div>
                     </div>

                     <div className="bg-card border border-muted rounded-xl p-6 shadow-sm space-y-4 relative">
                        {showInterviewForm ? (
                          <div className="space-y-4">
                            <h3 className="font-bold text-lg text-foreground mb-4">Schedule Interview</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2"><label className="text-sm font-medium">Date</label><Input type="date" value={interviewData.date} onChange={e => setInterviewData({...interviewData, date: e.target.value})}/></div>
                              <div className="space-y-2"><label className="text-sm font-medium">Time</label><Input type="time" value={interviewData.time} onChange={e => setInterviewData({...interviewData, time: e.target.value})}/></div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Mode</label>
                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={interviewData.mode} onChange={e => setInterviewData({...interviewData, mode: e.target.value})}>
                                  <option value="ONLINE">Online</option>
                                  <option value="OFFLINE">Offline</option>
                                </select>
                              </div>
                              <div className="space-y-2"><label className="text-sm font-medium">Round</label><Input type="number" value={interviewData.round} onChange={e => setInterviewData({...interviewData, round: e.target.value})}/></div>
                              {interviewData.mode === 'ONLINE' ? (
                                <div className="col-span-2 space-y-2"><label className="text-sm font-medium">Meeting Link</label><Input value={interviewData.link} onChange={e => setInterviewData({...interviewData, link: e.target.value})} placeholder="https://meet.google.com/..."/></div>
                              ) : (
                                <div className="col-span-2 space-y-2"><label className="text-sm font-medium">Location</label><Input value={interviewData.location} onChange={e => setInterviewData({...interviewData, location: e.target.value})} placeholder="123 Tech Park..."/></div>
                              )}
                              <div className="col-span-2 space-y-2"><label className="text-sm font-medium">Interviewer Name</label><Input value={interviewData.interviewer} onChange={e => setInterviewData({...interviewData, interviewer: e.target.value})} placeholder="e.g. John Doe"/></div>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-muted">
                              <Button variant="outline" onClick={() => setShowInterviewForm(false)}>Cancel</Button>
                              <Button onClick={scheduleInterview}>Confirm & Notify</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                             <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4"/>
                             <h3 className="font-bold text-lg mb-2">Interview Management</h3>
                             <p className="text-sm text-muted-foreground mb-4">Schedule a new interview round for this candidate.</p>
                             <Button onClick={() => setShowInterviewForm(true)} className="w-full">Schedule Interview</Button>
                          </div>
                        )}
                     </div>
                   </div>

                   {/* Offer Management */}
                   <div className="bg-card border border-muted rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-foreground">Offer Documents</h3>
                        {['OFFER', 'ACCEPTED', 'HIRED'].includes(selectedApp.status) ? (
                          <span className="bg-emerald-500/10 text-emerald-500 text-xs px-2 py-1 rounded-full border border-emerald-500/20 font-bold">Unlocked</span>
                        ) : (
                          <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full border border-muted font-bold">Locked</span>
                        )}
                      </div>
                      
                      {['OFFER', 'ACCEPTED', 'HIRED'].includes(selectedApp.status) ? (
                        <div className="grid grid-cols-1 gap-6">
                          {[
                            { key: 'offerLetter', label: 'Offer Letter' },
                            { key: 'ndaDocument', label: 'NDA Document' },
                            { key: 'joiningLetter', label: 'Joining Letter' },
                            { key: 'hrDocument', label: 'Other HR Docs' }
                          ].map(doc => (
                            <div key={doc.key} className="bg-muted/10 border border-muted p-4 rounded-xl space-y-3">
                              <h4 className="font-semibold text-sm">{doc.label}</h4>
                              {selectedApp[doc.key] ? (
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                  <a href={selectedApp[doc.key]} target="_blank" rel="noopener noreferrer" className="w-full sm:flex-1">
                                    <Button variant="outline" className="w-full text-blue-500 border-blue-500/30 gap-2 h-9"><ExternalLink className="w-3 h-3"/> View Document</Button>
                                  </a>
                                  <label className="cursor-pointer w-full sm:w-auto">
                                    <Input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleDocumentUpload(e, doc.key)} disabled={uploadingDoc === doc.key} />
                                    <div className="h-9 px-4 flex items-center justify-center border border-muted rounded-md hover:bg-muted text-muted-foreground text-sm font-medium">{uploadingDoc === doc.key ? <Clock className="w-3 h-3 animate-spin"/> : 'Update'}</div>
                                  </label>
                                </div>
                              ) : (
                                <label className="cursor-pointer block">
                                  <Input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleDocumentUpload(e, doc.key)} disabled={uploadingDoc === doc.key} />
                                  <div className="w-full py-4 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center text-xs text-muted-foreground hover:bg-muted/20 hover:border-primary/50 transition-colors flex items-center justify-center gap-2">
                                    {uploadingDoc === doc.key ? <Clock className="w-4 h-4 animate-spin"/> : <FileText className="w-4 h-4"/>}
                                    {uploadingDoc === doc.key ? 'Uploading...' : `Upload ${doc.label}`}
                                  </div>
                                </label>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 border-2 border-dashed border-muted rounded-xl">
                          <CheckCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4"/>
                          <p className="text-muted-foreground text-sm px-6">Move candidate to Offer stage to unlock document management.</p>
                        </div>
                      )}
                   </div>
                 </div>
               </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
"""

lines[start_idx:end_idx+1] = [new_drawer]

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Updated drawer UI")
