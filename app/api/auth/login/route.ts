export async function POST(req: Request) {
  const body = await req.json();

  const { email, password } = body;

  if (
    email === "ram@test.com" &&
    password === "123456"
  ) {
    return Response.json({
      success: true,
      message: "Login Successful",
    });
  }

  return Response.json({
    success: false,
    message: "Invalid Credentials",
  });
}