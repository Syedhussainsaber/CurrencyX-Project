import Header from '@/components/common/header'
import Footer from '@/components/common/footer'
import { getSiteSettings } from '@/lib/site'
import prisma from '@/lib/prisma'

const milestones = [
  { year: '2018', detail: 'PayIn Global launches with 20 currencies and instant FX alerts.' },
  { year: '2020', detail: 'Introduced API-first converter widget and compliance automation.' },
  { year: '2023', detail: 'Expanded to 150+ countries with admin CMS and analytics.' },
  { year: '2025', detail: 'Rolled out PayIn Global platform with blog + dashboard bundle.' }
]

export const revalidate = 60

export default async function AboutPage() {
  const settings = await getSiteSettings()
  const members: { fullName: string; role: string | null }[] = await prisma.user.findMany({
    select: { fullName: true, role: true },
    orderBy: { createdAt: 'asc' },
    take: 8
  })
  const teamMembers: { fullName: string; role?: string | null }[] =
    members.length
      ? members.map((m) => ({ fullName: m.fullName, role: m.role }))
      : [
          { fullName: 'Syed Hussain', role: 'CEO & Co-founder' },
          { fullName: 'Syed Shoiab', role: 'COO & Co-founder' }
        ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Our story</p>
            <h1 className="text-4xl md:text-5xl font-bold">{settings.brandName}</h1>
            <p className="text-lg text-muted-foreground">
              We build currency infrastructure so marketers, finance teams, and founders can deploy real-time FX
              experiences without reinventing the stack.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold">Mission</h2>
              <p className="text-muted-foreground">
                Empower every organization to provide transparent, fast, and compliant currency experiences. We align our
                product roadmap with regulatory clarity, enterprise-grade security, and delightful UX.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold">Vision</h2>
              <p className="text-muted-foreground">
                A single operating layer for currency intelligence—where conversion, editorial, and administration
                co-exist, share data, and keep humans in control.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-center mb-12">Timeline</h2>
            <div className="space-y-6">
              {milestones.map((milestone) => (
                <div key={milestone.year} className="flex flex-col md:flex-row md:items-center gap-4">
                  <span className="text-primary font-semibold text-lg w-24">{milestone.year}</span>
                  <p className="text-muted-foreground flex-1">{milestone.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-center mb-12">Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <div key={member.fullName} className="bg-card border border-border rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto bg-primary/10 mb-4" />
                  <p className="font-semibold">{member.fullName}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

