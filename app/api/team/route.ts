export async function GET() {
  return Response.json([
    {
      id: 1,
      name: "John",
      department: "CSE",
      skills: ["React", "Next.js", "AWS"]
    },
    {
      id: 2,
      name: "Priya",
      department: "AI & DS",
      skills: ["Python", "Machine Learning"]
    }
  ]);
}