import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const decoded = getServerSession(req);

    if (!decoded) {
      return Response.json({ success: false, message: "Invalid or missing token" }, { status: 401 });
    }

    const body = await req.json();
    const userId = decoded.id;
    const role = decoded.role;

    let profile;

    if (body.name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: body.name }
      });
    }

    if (role === "STUDENT") {
      const updateData: any = {
        bio: body.bio,
        branch: body.branch,
        year: body.year,
        github: body.github,
        linkedin: body.linkedin,
        portfolio: body.portfolio,
      };

      if (body.resume) {
        updateData.resume = body.resume;
        updateData.resumeUpdatedAt = new Date();
        updateData.resumeStatus = 'PENDING'; // Needs re-verification
      }

      profile = await prisma.student.upsert({
        where: { userId },
        update: updateData,
        create: {
          userId,
          bio: body.bio,
          branch: body.branch,
          year: body.year,
          github: body.github,
          linkedin: body.linkedin,
          portfolio: body.portfolio,
          ...(body.resume ? { resume: body.resume, resumeUpdatedAt: new Date() } : {})
        }
      });

      // If resume updated, notify all recruiters they applied to
      if (body.resume) {
        const apps = await prisma.jobApplication.findMany({
          where: { studentId: profile.id },
          include: { job: { include: { recruiter: true } } }
        });
        
        const recruiterUserIds = [...new Set(apps.map(a => a.job.recruiter.userId))];
        
        for (const rId of recruiterUserIds) {
          await prisma.notification.create({
            data: {
              userId: rId,
              title: "Resume Updated",
              message: `Applicant ${(decoded as any).name || 'A student'} has updated their resume.`
            }
          });
        }
      }
    } else if (role === "FACULTY") {
      profile = await prisma.faculty.upsert({
        where: { userId },
        update: { department: body.department },
        create: { userId, department: body.department }
      });
    } else if (role === "RECRUITER") {
      profile = await prisma.recruiter.upsert({
        where: { userId },
        update: { company: body.company, designation: body.designation },
        create: { userId, company: body.company, designation: body.designation }
      });
    }

    return Response.json({
      success: true,
      message: "Profile Saved Successfully",
      profile,
    });
  } catch (error) {
    console.error("Profile Error:", error);
    return Response.json({ success: false, message: "Profile Save Failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const decoded = getServerSession(req);
    if (!decoded) {
      return Response.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: { include: { projects: true, skills: true, certificates: true, applications: { include: { job: true, interviews: true } } } },
        faculty: true,
        recruiter: { include: { jobs: true } },
        notifications: { orderBy: { createdAt: 'desc' } },
        activities: { orderBy: { createdAt: 'desc' }, take: 10 }
      }
    });

    if (!user) {
       return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    let profileCompletion = 0;
    if (user.student) {
      const s = user.student;
      if (s.bio) profileCompletion += 10;
      if (s.resume) profileCompletion += 15;
      if (s.projects.length > 0) profileCompletion += 20;
      if (s.skills.length > 0) profileCompletion += 15;
      if (s.certificates.length > 0) profileCompletion += 15;
      if (s.github) profileCompletion += 10;
      if (s.linkedin) profileCompletion += 10;
      if (user.name) profileCompletion += 5; // Simulating Photo uploaded for now
      
      profileCompletion = Math.min(100, profileCompletion);
      
      // Update score if needed
      const newScore = profileCompletion;
      if (s.score !== newScore) {
         await prisma.student.update({ where: { id: s.id }, data: { score: newScore } });
         user.student.score = newScore;
      }
      // Attach Reviewer Names
      const reviewerIds = [
        ...s.projects.map(p => p.reviewedById),
        ...s.certificates.map(c => c.verifiedById)
      ].filter(Boolean) as string[];

      if (reviewerIds.length > 0) {
        const reviewers = await prisma.user.findMany({
          where: { id: { in: reviewerIds } },
          select: { id: true, name: true }
        });
        const reviewerMap = Object.fromEntries(reviewers.map(r => [r.id, r.name]));

        user.student.projects = s.projects.map(p => ({
          ...p,
          reviewerName: p.reviewedById ? reviewerMap[p.reviewedById] : null
        })) as any;

        user.student.certificates = s.certificates.map(c => ({
          ...c,
          reviewerName: c.verifiedById ? reviewerMap[c.verifiedById] : null
        })) as any;
      }
    }

    return Response.json({ success: true, user, profileCompletion });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to fetch profile" }, { status: 500 });
  }
}
