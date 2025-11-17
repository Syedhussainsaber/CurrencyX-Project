'use client'

import { useEffect, useState } from 'react'
import { Trash2, Mail, Phone } from 'lucide-react'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  timestamp: string
  status: 'new' | 'responded'
}

export default function AdminContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    // Mock contact submissions
    setSubmissions([
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1 (555) 123-4567',
        subject: 'Transfer Issues',
        message: 'I am experiencing issues with my recent transfer to the UK.',
        timestamp: '2025-11-15T10:30:00',
        status: 'new'
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike@example.com',
        phone: '+1 (555) 987-6543',
        subject: 'Rate Inquiry',
        message: 'Can you provide information about your current exchange rates?',
        timestamp: '2025-11-14T15:45:00',
        status: 'responded'
      },
      {
        id: '3',
        name: 'Emma Davis',
        email: 'emma@example.com',
        phone: '+1 (555) 555-5555',
        subject: 'Account Verification',
        message: 'I need help verifying my account for larger transfers.',
        timestamp: '2025-11-14T08:20:00',
        status: 'new'
      }
    ])
    setLoading(false)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('Delete this submission?')) {
      setSubmissions(submissions.filter(s => s.id !== id))
    }
  }

  const markAsResponded = (id: string) => {
    setSubmissions(submissions.map(s =>
      s.id === id ? { ...s, status: 'responded' } : s
    ))
  }

  if (loading) return <div>Loading...</div>

  const newCount = submissions.filter(s => s.status === 'new').length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Contact Submissions</h1>
          {newCount > 0 && (
            <p className="text-sm text-primary mt-1">{newCount} new submission{newCount !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {submissions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No contact submissions yet.
          </div>
        ) : (
          submissions.map((submission) => (
            <div
              key={submission.id}
              className={`bg-card border rounded-xl p-6 transition ${
                submission.status === 'new'
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{submission.subject}</h3>
                    {submission.status === 'new' && (
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full font-semibold">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(submission.timestamp).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => markAsResponded(submission.id)}
                    className="px-3 py-1 text-sm bg-muted hover:bg-primary/20 rounded-lg transition"
                  >
                    Mark Responded
                  </button>
                  <button
                    onClick={() => handleDelete(submission.id)}
                    className="p-2 hover:bg-destructive/20 rounded-lg transition"
                  >
                    <Trash2 size={18} className="text-destructive" />
                  </button>
                </div>
              </div>

              {selectedId === submission.id && (
                <div className="mb-4 space-y-3">
                  <div>
                    <p className="text-sm font-semibold mb-1">Name</p>
                    <p className="text-foreground">{submission.name}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-muted-foreground" />
                    <a href={`mailto:${submission.email}`} className="text-primary hover:underline text-sm">
                      {submission.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-muted-foreground" />
                    <a href={`tel:${submission.phone}`} className="text-primary hover:underline text-sm">
                      {submission.phone}
                    </a>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-1">Message</p>
                    <p className="text-foreground text-sm whitespace-pre-wrap">{submission.message}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedId(selectedId === submission.id ? null : submission.id)}
                className="text-primary hover:underline text-sm font-semibold mt-4"
              >
                {selectedId === submission.id ? 'Hide Details' : 'View Details'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
