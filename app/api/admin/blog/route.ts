export async function POST(request: Request) {
  try {
    const data = await request.json()

    // In production, save to database
    console.log("[v0] Blog post created:", data)

    return Response.json({ success: true, id: Date.now() })
  } catch (error) {
    console.log("[v0] Blog creation error:", error)
    return Response.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
