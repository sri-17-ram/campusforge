export async function GET() {
  return Response.json({
    name: "Ram",
    department: "CSE",
    year: 3,
    skills: ["React", "Next.js", "AWS"],
    github: "github.com/ram"
  });
}