export async function POST(req: Request) {
  const body = await req.json();

  // Here you would typically save the project to the database
  // For example: const project = await prisma.project.create({ data: body });

  return Response.json({
    success: true,
    project: body,
    message: "Project Created Successfully",
  });
}