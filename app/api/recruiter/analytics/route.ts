import { prisma } from "@/lib/prisma";
import { verifyToken, getServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded || decoded.role !== "RECRUITER") return NextResponse.json({ success: false }, { status: 401 });

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: decoded.id },
      include: {
        jobs: {
          include: {
            applications: {
              include: {
                student: { include: { user: true, skills: true } },
                interviews: true
              }
            }
          }
        }
      }
    });

    if (!recruiter) return NextResponse.json({ success: false }, { status: 404 });

    const allApps = recruiter.jobs.flatMap(job => job.applications);
    const allInterviews = allApps.flatMap(app => app.interviews);

    // 1. Monthly Applications & Monthly Hiring
    const monthlyMap: Record<string, { apps: number, hired: number }> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthlyMap[`${monthNames[d.getMonth()]} ${d.getFullYear()}`] = { apps: 0, hired: 0 };
    }

    allApps.forEach(app => {
      const d = new Date(app.appliedAt);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (monthlyMap[key]) {
        monthlyMap[key].apps++;
        if (app.status === 'HIRED') {
          monthlyMap[key].hired++;
        }
      }
    });
    const monthlyStats = Object.keys(monthlyMap).map(k => ({ name: k, applications: monthlyMap[k].apps, hired: monthlyMap[k].hired }));

    // 2. Hiring Funnel
    const funnelStages = ['APPLIED', 'SCREENING', 'TECHNICAL_ROUND', 'HR_ROUND', 'OFFER', 'HIRED'];
    const funnelCounts: Record<string, number> = {
      APPLIED: 0, SCREENING: 0, TECHNICAL_ROUND: 0, HR_ROUND: 0, OFFER: 0, HIRED: 0
    };
    
    allApps.forEach(app => {
      const idx = funnelStages.indexOf(app.status);
      if (idx !== -1) {
        // If they are at HR_ROUND, they also passed APPLIED, SCREENING, TECH...
        // Traditional funnel: count how many reached at least this stage.
        for (let i = 0; i <= idx; i++) {
          funnelCounts[funnelStages[i]]++;
        }
      } else if (app.status === 'ACCEPTED') {
         // ACCEPTED means they passed OFFER
         for (let i = 0; i <= funnelStages.indexOf('OFFER'); i++) funnelCounts[funnelStages[i]]++;
      } else if (app.status === 'REJECTED') {
         // If rejected, we don't know exactly at which stage unless we check timeline. 
         // For simplicity, we just count them in APPLIED.
         funnelCounts['APPLIED']++;
      }
    });
    const funnel = funnelStages.map(stage => ({ stage, value: funnelCounts[stage] }));

    // 3. Top Departments
    const deptMap: Record<string, number> = {};
    allApps.forEach(app => {
      const dept = app.student.branch || 'Unknown';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    const topDepartments = Object.keys(deptMap).map(k => ({ name: k, value: deptMap[k] })).sort((a,b) => b.value - a.value).slice(0, 5);

    // 4. Top Colleges (Extracted from Email Domains)
    const collegeMap: Record<string, number> = {};
    allApps.forEach(app => {
      const email = app.student.user.email;
      const domain = email.split('@')[1] || 'Unknown';
      const cleanDomain = domain.replace('.edu', '').replace('.ac.in', '').split('.')[0];
      const name = cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1);
      collegeMap[name] = (collegeMap[name] || 0) + 1;
    });
    const topColleges = Object.keys(collegeMap).map(k => ({ name: k, value: collegeMap[k] })).sort((a,b) => b.value - a.value).slice(0, 5);

    // 5. Top Skills
    const skillMap: Record<string, number> = {};
    allApps.forEach(app => {
      app.student.skills.forEach(skill => {
        skillMap[skill.name] = (skillMap[skill.name] || 0) + 1;
      });
    });
    const topSkills = Object.keys(skillMap).map(k => ({ name: k, value: skillMap[k] })).sort((a,b) => b.value - a.value).slice(0, 10);

    // 6. Offer Acceptance Rate
    // Offers made = applications with status OFFER, ACCEPTED, HIRED, or REJECTED (if they rejected the offer).
    // Let's count ACCEPTED and HIRED as accepted offers. 
    // And OFFER as pending.
    // For simplicity, let's just find applications that ever reached OFFER stage. 
    const appsWithOffers = allApps.filter(app => ['OFFER', 'ACCEPTED', 'HIRED'].includes(app.status));
    const acceptedOffers = allApps.filter(app => ['ACCEPTED', 'HIRED'].includes(app.status));
    const offerAcceptanceRate = appsWithOffers.length > 0 ? Math.round((acceptedOffers.length / appsWithOffers.length) * 100) : 0;

    // 7. Interview Success Rate
    const completedInterviews = allInterviews.filter(i => ['COMPLETED', 'ACCEPTED', 'REJECTED'].includes(i.status));
    const successfulInterviews = completedInterviews.filter(i => i.status === 'ACCEPTED' || i.status === 'COMPLETED'); // assuming completed is success, or students accepted it.
    const interviewSuccessRate = completedInterviews.length > 0 ? Math.round((successfulInterviews.length / completedInterviews.length) * 100) : 0;

    // 8. Application Trends (Last 30 Days)
    const trendsMap: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
      trendsMap[dateStr] = 0;
    }
    allApps.forEach(app => {
      const dateStr = new Date(app.appliedAt).toISOString().split('T')[0];
      if (trendsMap[dateStr] !== undefined) {
        trendsMap[dateStr]++;
      }
    });
    const applicationTrends = Object.keys(trendsMap).map(date => ({ date: date.slice(5), applications: trendsMap[date] })); // MM-DD

    return NextResponse.json({
      success: true,
      analytics: {
        monthlyStats,
        funnel,
        topDepartments,
        topColleges,
        topSkills,
        offerAcceptanceRate,
        interviewSuccessRate,
        applicationTrends,
        totalApplications: allApps.length
      }
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to load analytics" }, { status: 500 });
  }
}
