'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    appName: 'CurrencyX',
    supportEmail: 'support@currencyx.com',
    supportPhone: '+1 (800) 123-4567',
    maxTransferAmount: '100,000',
    conversionFeePercentage: '0.5',
    maintenanceMode: false
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const inputElement = e.target as HTMLInputElement
    const newValue = type === 'checkbox' ? inputElement.checked : value
    setSettings(prev => ({ ...prev, [name]: newValue }))
    setSaved(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.log("[v0] Error saving settings:", error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-8 max-w-2xl space-y-6">
        {/* General */}
        <div>
          <h2 className="text-xl font-bold mb-4">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">App Name</label>
              <input
                type="text"
                name="appName"
                value={settings.appName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Support Email</label>
              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Support Phone</label>
              <input
                type="tel"
                name="supportPhone"
                value={settings.supportPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Transaction Settings */}
        <div className="border-t border-border pt-6">
          <h2 className="text-xl font-bold mb-4">Transaction Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Max Transfer Amount</label>
              <input
                type="text"
                name="maxTransferAmount"
                value={settings.maxTransferAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Conversion Fee (%)</label>
              <input
                type="text"
                name="conversionFeePercentage"
                value={settings.conversionFeePercentage}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="border-t border-border pt-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="w-4 h-4 rounded border-border"
            />
            <span className="font-semibold">Enable Maintenance Mode</span>
          </label>
        </div>

        {/* Submit */}
        <div className="border-t border-border pt-6 flex gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
          >
            <Save size={18} />
            Save Changes
          </button>
          {saved && <p className="text-sm text-green-600 self-center">Settings saved successfully!</p>}
        </div>
      </form>
    </div>
  )
}
