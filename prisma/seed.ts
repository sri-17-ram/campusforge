import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Delete old data
  await prisma.jobApplication.deleteMany();
  await prisma.job.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.student.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.recruiter.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("123456", 10);

  // ===========================
  // STUDENT
  // ===========================

  const studentUser = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "student@campusforge.com",
      password,
      role: Role.STUDENT,

      student: {
        create: {
          bio: "Full Stack Developer",
          branch: "Computer Science",
          year: 4,
          github: "https://github.com/johndoe",
          linkedin: "https://linkedin.com/in/johndoe",
          portfolio: "https://johndoe.dev",
          score: 89,

          skills: {
            create: [
              { name: "React" },
              { name: "Next.js" },
              { name: "TypeScript" },
              { name: "Node.js" },
              { name: "Prisma" },
            ],
          },

          certificates: {
            create: [
              {
                title: "AWS Cloud Practitioner",
                issuer: "Amazon",
              },
              {
                title: "Google Cloud Associate",
                issuer: "Google",
              },
            ],
          },

          projects: {
            create: [
              {
                title: "CampusForge",
                description: "Campus Placement Portal",
                github: "https://github.com/demo/campusforge",
                demo: "https://campusforge.vercel.app",
              },
              {
                title: "AI Resume Builder",
                description: "Resume Generator using AI",
              },
            ],
          },
        },
      },
    },
  });

  // ===========================
  // FACULTY
  // ===========================

  await prisma.user.create({
    data: {
      name: "Dr. Smith",
      email: "faculty@campusforge.com",
      password,
      role: Role.FACULTY,

      faculty: {
        create: {
          department: "Computer Science",
        },
      },
    },
  });

  // ===========================
  // RECRUITER
  // ===========================

  const recruiterUser = await prisma.user.create({
    data: {
      name: "HR Manager",
      email: "recruiter@campusforge.com",
      password,
      role: Role.RECRUITER,

      recruiter: {
        create: {
          company: "Google",
          designation: "Hiring Manager",

          jobs: {
            create: [
              {
                title: "Frontend Developer",
                description: "React + Next.js Developer",
                salary: "12 LPA",
                location: "Bangalore",
              },
              {
                title: "Backend Developer",
                description: "Node.js + Prisma Developer",
                salary: "15 LPA",
                location: "Hyderabad",
              },
            ],
          },
        },
      },
    },
  });

  // ===========================
  // SAMPLE APPLICATION
  // ===========================

  const student = await prisma.student.findFirst();
  const jobs = await prisma.job.findMany();

  if (student && jobs.length > 0) {
    await prisma.jobApplication.create({
      data: {
        studentId: student.id,
        jobId: jobs[0].id,
      },
    });
  }

  console.log("✅ Database Seeded Successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });