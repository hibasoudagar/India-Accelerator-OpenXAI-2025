import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { image } = await req.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Call Ollama with stream disabled
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llava:latest",  // make sure this matches `ollama list`
        prompt: "Describe this image in detail.",
        images: [image],
        stream: false,          // 👈 important
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Ollama request failed" }, { status: 500 })
    }

    const data = await response.json()

    // Debugging: log raw response
    console.log("OLLAMA RESPONSE:", data)

    return NextResponse.json({ result: data.response ?? "No response field found" })
  } catch (error) {
    console.error("API ERROR:", error)
    return NextResponse.json(
      { error: "Image analysis failed", details: String(error) },
      { status: 500 }
    )
  }
}
