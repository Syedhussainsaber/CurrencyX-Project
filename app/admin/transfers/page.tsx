'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'

interface Transfer {
  id: string
  from: string
  to: string
  amount: string
  currency: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  user: string
}

export default function AdminTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock transfers
    setTransfers([
      {
        id: 'TRX001',
        from: 'USA',
        to: 'UK',
        amount: '1,000',
        currency: 'USD',
        status: 'completed',
        date: '2025-11-15',
        user: 'John Doe'
      },
      {
        id: 'TRX002',
        from: 'Germany',
        to: 'France',
        amount: '500',
        currency: 'EUR',
        status: 'pending',
        date: '2025-11-14',
        user: 'Jane Smith'
      },
      {
        id: 'TRX003',
        from: 'Japan',
        to: 'USA',
        amount: '25,000',
        currency: 'JPY',
        status: 'completed',
        date: '2025-11-14',
        user: 'Yuki Tanaka'
      }
    ])
    setLoading(false)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={18} className="text-green-600" />
      case 'pending':
        return <Clock size={18} className="text-yellow-600" />
      case 'failed':
        return <AlertCircle size={18} className="text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      default:
        return ''
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Transfers</h1>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-6 py-3 font-semibold">ID</th>
              <th className="text-left px-6 py-3 font-semibold">Route</th>
              <th className="text-left px-6 py-3 font-semibold">Amount</th>
              <th className="text-left px-6 py-3 font-semibold">Status</th>
              <th className="text-left px-6 py-3 font-semibold">User</th>
              <th className="text-left px-6 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer) => (
              <tr key={transfer.id} className="border-b border-border hover:bg-muted/30 transition">
                <td className="px-6 py-4 font-mono text-sm">{transfer.id}</td>
                <td className="px-6 py-4 text-sm">{transfer.from} → {transfer.to}</td>
                <td className="px-6 py-4 font-semibold">{transfer.amount} {transfer.currency}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(transfer.status)}
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(transfer.status)} capitalize`}>
                      {transfer.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{transfer.user}</td>
                <td className="px-6 py-4 text-sm">{new Date(transfer.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
