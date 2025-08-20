"use client"

import { useState } from "react"

export default function Page() {
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64Image = reader.result
      if (!base64Image) return

      try {
        setLoading(true)
        setError(null)
        setResult(null)

        const res = await fetch("/api/analyze-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Image }),
        })

        const data = await res.json()

        if (data.error) {
          setError(data.error)
        } else {
          setResult(data.result)
        }
      } catch (err) {
        setError("Something went wrong while analyzing the image.")
      } finally {
        setLoading(false)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-6">👁️ AI Vision Analyzer</h1>

      {/* File Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {/* Loading */}
      {loading && <p className="animate-pulse text-blue-400">Analyzing image...</p>}

      {/* Result */}
      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-700 w-full max-w-md">
          <p className="font-bold">Analysis Result:</p>
          <p>{result}</p>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-400 mt-4">{error}</p>}
    </main>
  )
}
