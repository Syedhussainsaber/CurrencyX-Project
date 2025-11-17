'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { TrendingUp, Users, DollarSign, ArrowRight } from 'lucide-react'

interface DashboardStats {
  totalTransfers: number
  totalAmount: string
  activeUsers: number
  exchangeRates: { pair: string; rate: string }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockStats: DashboardStats = {
      totalTransfers: 12453,
      totalAmount: '$2.5B',
      activeUsers: 450000,
      exchangeRates: [
        { pair: 'USD/EUR', rate: '0.92' },
        { pair: 'GBP/USD', rate: '1.27' },
        { pair: 'EUR/JPY', rate: '162.8' }
      ]
    }
    setStats(mockStats)
    setLoading(false)
  }, [])

  if (loading) return <div>Loading...</div>
  if (!stats) return <div>Error loading dashboard</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Total Transfers</p>
              <p className="text-3xl font-bold">{stats.totalTransfers.toLocaleString()}</p>
            </div>
            <TrendingUp size={40} className="text-primary opacity-20" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Total Amount Transferred</p>
              <p className="text-3xl font-bold">{stats.totalAmount}</p>
            </div>
            <DollarSign size={40} className="text-primary opacity-20" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-2">Active Users</p>
              <p className="text-3xl font-bold">{stats.activeUsers.toLocaleString()}</p>
            </div>
            <Users size={40} className="text-primary opacity-20" />
          </div>
        </div>
      </div>

      {/* Exchange Rates */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Live Exchange Rates</h2>

        <div className="space-y-4">
          {stats.exchangeRates.map((rate) => (
            <div key={rate.pair} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <span className="font-semibold">{rate.pair}</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{rate.rate}</span>
                <ArrowRight size={18} className="text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
