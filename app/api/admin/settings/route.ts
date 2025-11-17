export async function POST(request: Request) {
  try {
    const settings = await request.json()

    // In production, save to database
    console.log("[v0] Settings saved:", settings)

    return Response.json({ success: true })
  } catch (error) {
    console.log("[v0] Settings error:", error)
    return Response.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
