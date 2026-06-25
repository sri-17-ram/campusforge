export async function POST(req: Request) {
  const body = await req.json();

  const { name, email, password } = body;

  // Here you would typically save the user to the database
  // For example: const user = await prisma.user.create({ data: { name, email, password } });

  return Response.json({
    success: true,
    user: {
      name,
      email,
    },
    message: "User Registered Successfully",
  });
}