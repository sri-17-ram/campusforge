export async function GET() {
  return Response.json([
    {
      id: 1,
      title: "AI Resume Builder",
      domain: "AI",
      requiredSkills: ["React", "Node.js"],
    },
    {
      id: 2,
      title: "Smart Campus App",
      domain: "Web Development",
      requiredSkills: ["Next.js", "AWS"],
    },
  ]);
}