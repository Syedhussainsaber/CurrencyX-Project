'use client'

import { useEffect, useState } from 'react'
import { Mail, Phone, CheckCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

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
      setError(null)
      const response = await fetch('/api/admin/contact', { cache: 'no-store' })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Unable to load submissions')
      }
      const payload = await response.json()
      setSubmissions(payload.data)
    } catch (err) {
      const errorMessage = (err as Error).message
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const markAsResponded = async (id: string) => {
    try {
      const response = await fetch('/api/admin/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'responded' })
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Failed to update status')
      }
      setSubmissions((prev) => prev.map((submission) => (submission._id === id ? { ...submission, status: 'responded' } : submission)))
      toast.success('Marked as responded')
    } catch (err) {
      const errorMessage = (err as Error).message
      toast.error(errorMessage)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Contact Submissions</h1>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <Button onClick={fetchData} variant="outline" disabled={loading} className="flex items-center gap-2">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-card border border-border rounded-xl p-6">
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/4 mb-4" />
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : submissions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl bg-muted/30">
            <Mail size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-medium">No contact submissions yet</p>
            <p className="text-sm mt-1">New submissions will appear here</p>
          </div>
        ) : (
          submissions.map((submission) => (
            <div
              key={submission._id}
              className={`bg-card border rounded-xl p-6 ${submission.status === 'new' ? 'border-primary/40 bg-primary/5' : 'border-border'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{submission.subject}</h3>
                  <p className="text-sm text-muted-foreground">{new Date(submission.createdAt).toLocaleString()}</p>
                </div>
                {submission.status === 'responded' ? (
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center gap-1 w-fit">
                    <CheckCircle size={12} /> Responded
                  </span>
                ) : (
                  <Button
                    onClick={() => markAsResponded(submission._id)}
                    variant="outline"
                    size="sm"
                    className="w-fit"
                  >
                    Mark responded
                  </Button>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4 whitespace-pre-wrap">{submission.message}</p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50">
                <span className="flex items-center gap-2">
                  <Mail size={16} className="flex-shrink-0" />
                  <a href={`mailto:${submission.email}`} className="hover:text-primary break-all">
                    {submission.email}
                  </a>
                </span>
                {submission.phone && (
                  <span className="flex items-center gap-2">
                    <Phone size={16} className="flex-shrink-0" />
                    <a href={`tel:${submission.phone}`} className="hover:text-primary">
                      {submission.phone}
                    </a>
                  </span>
                )}
                <span className="sm:ml-auto">— {submission.name}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

