export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Mock authentication - in production, use a proper auth system
    if (email === 'admin@currencyx.com' && password === 'password123') {
      return Response.json({
        success: true,
        token: 'mock-jwt-token-' + Date.now()
      })
    }

    return Response.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.log("[v0] Login error:", error)
    return Response.json({ error: 'Login failed' }, { status: 500 })
  }
}
