'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Mail } from 'lucide-react'

interface OverviewResponse {
  blogs: { _id: string; count: number }[]
  contacts: { _id: string; count: number }[]
  rates: { base: string; fetchedAt: string; provider?: string }[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<OverviewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/overview', { cache: 'no-store' })
        if (!response.ok) throw new Error('Unable to load overview')
        const payload = await response.json()
        setData(payload)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchOverview()
  }, [])

  if (loading) return <p>Loading dashboard…</p>
  if (error) return <p className="text-destructive">{error}</p>
  if (!data) return null

  const published = data.blogs.find((item) => item._id === 'published')?.count || 0
  const drafts = data.blogs.find((item) => item._id === 'draft')?.count || 0
  const newContacts = data.contacts.find((item) => item._id === 'new')?.count || 0
  const responded = data.contacts.find((item) => item._id === 'responded')?.count || 0

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-muted-foreground text-sm mb-1">Published articles</p>
          <p className="text-3xl font-semibold">{published}</p>
          <p className="text-xs text-muted-foreground">{drafts} drafts</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-muted-foreground text-sm mb-1">Draft queue</p>
          <p className="text-3xl font-semibold">{drafts}</p>
          <p className="text-xs text-muted-foreground">Awaiting approval</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
          <Mail className="text-primary" />
          <div>
            <p className="text-muted-foreground text-sm">New contact forms</p>
            <p className="text-2xl font-semibold">{newContacts}</p>
            <p className="text-xs text-muted-foreground">{responded} resolved</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-muted-foreground text-sm mb-1">Rate snapshots</p>
          <p className="text-3xl font-semibold">{data.rates.length}</p>
          <p className="text-xs text-muted-foreground">
            Last fetch {data.rates[0]?.provider || 'pending'}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Latest rate base pulls</h2>
        <div className="space-y-4">
          {data.rates.map((rate) => (
            <div key={rate.base} className="flex items-center justify-between p-4 bg-muted/40 rounded-lg">
              <span className="font-semibold">{rate.base}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {new Date(rate.fetchedAt).toLocaleString()} · {rate.provider}
                </span>
                <ArrowRight size={18} className="text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
