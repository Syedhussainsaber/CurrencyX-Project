'use client'

import { useEffect, useState } from 'react'
import { Mail, Phone, CheckCircle } from 'lucide-react'

interface ContactSubmission {
  _id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'responded'
  createdAt: string
}

export default function AdminContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/contact', { cache: 'no-store' })
      if (!response.ok) throw new Error('Unable to load submissions')
      const payload = await response.json()
      setSubmissions(payload.data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const markAsResponded = async (id: string) => {
    const response = await fetch('/api/admin/contact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'responded' })
    })
    if (!response.ok) return
    setSubmissions((prev) => prev.map((submission) => (submission._id === id ? { ...submission, status: 'responded' } : submission)))
  }

  if (loading) return <p>Loading…</p>
  if (error) return <p className="text-destructive">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <button onClick={fetchData} className="text-sm underline">
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {submissions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">No contact submissions yet.</div>
        ) : (
          submissions.map((submission) => (
            <div
              key={submission._id}
              className={`bg-card border rounded-xl p-6 ${submission.status === 'new' ? 'border-primary/40 bg-primary/5' : 'border-border'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{submission.subject}</h3>
                  <p className="text-sm text-muted-foreground">{new Date(submission.createdAt).toLocaleString()}</p>
                </div>
                {submission.status === 'responded' ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                    <CheckCircle size={12} /> Responded
                  </span>
                ) : (
                  <button
                    onClick={() => markAsResponded(submission._id)}
                    className="text-xs px-3 py-1 rounded-full border border-primary text-primary hover:bg-primary/10 transition"
                  >
                    Mark responded
                  </button>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4">{submission.message}</p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Mail size={16} />
                  <a href={`mailto:${submission.email}`} className="hover:text-primary">
                    {submission.email}
                  </a>
                </span>
                {submission.phone && (
                  <span className="flex items-center gap-2">
                    <Phone size={16} />
                    <a href={`tel:${submission.phone}`} className="hover:text-primary">
                      {submission.phone}
                    </a>
                  </span>
                )}
                <span>— {submission.name}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

