import Header from '@/components/common/header'
import Footer from '@/components/common/footer'
import { getSiteSettings } from '@/lib/site'
import { Scale, AlertCircle, CheckCircle, FileCheck } from 'lucide-react'

export const metadata = {
  title: 'Terms & Conditions - PayIn Global',
  description: 'Read PayIn Global terms and conditions to understand the rules and regulations for using our currency conversion services.',
  alternates: {
    canonical: 'https://payinglobal.com/terms'
  }
}

export default async function TermsPage() {
  const settings = await getSiteSettings()
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <Scale size={48} className="text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms & Conditions</h1>
            <p className="text-xl text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose dark:prose-invert max-w-none">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FileCheck size={24} className="text-primary" />
                  Agreement to Terms
                </h2>
                <p className="text-muted-foreground">
                  By accessing or using PayIn Global's website, services, or applications, you agree to be bound by these Terms and Conditions. 
                  If you disagree with any part of these terms, you may not access or use our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle size={24} className="text-primary" />
                  Use of Service
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Eligibility</h3>
                    <p>You must be at least 18 years old and have the legal capacity to enter into binding agreements to use our services.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Account Registration</h3>
                    <p>When you create an account, you agree to:</p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                      <li>Provide accurate, current, and complete information</li>
                      <li>Maintain and update your information to keep it accurate</li>
                      <li>Maintain the security of your account credentials</li>
                      <li>Accept responsibility for all activities under your account</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Acceptable Use</h3>
                    <p>You agree not to:</p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                      <li>Use the service for any illegal or unauthorized purpose</li>
                      <li>Violate any laws in your jurisdiction</li>
                      <li>Transmit any viruses, malware, or harmful code</li>
                      <li>Attempt to gain unauthorized access to our systems</li>
                      <li>Interfere with or disrupt the service or servers</li>
                      <li>Use automated systems to access the service without permission</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <AlertCircle size={24} className="text-primary" />
                  Currency Conversion Services
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Exchange Rates</h3>
                    <p>
                      Exchange rates displayed on our platform are provided for informational purposes and may not reflect 
                      the exact rates available at financial institutions. Rates are updated regularly but may vary based 
                      on market conditions. We do not guarantee the accuracy, completeness, or timeliness of exchange rate information.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Service Availability</h3>
                    <p>
                      We strive to provide continuous access to our services but do not guarantee uninterrupted or error-free 
                      operation. We reserve the right to modify, suspend, or discontinue any part of our service at any time 
                      without prior notice.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Limitations of Liability</h3>
                    <p>
                      PayIn Global provides currency conversion information and tools for general informational purposes. We are not 
                      a financial institution and do not provide financial advice. You acknowledge that any decisions made based 
                      on information from our service are made at your own risk.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
                <p className="text-muted-foreground">
                  All content, features, and functionality of our service, including but not limited to text, graphics, logos, 
                  icons, images, and software, are the exclusive property of PayIn Global and are protected by international 
                  copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or 
                  create derivative works without our express written permission.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">User Content</h2>
                <p className="text-muted-foreground mb-4">
                  If you submit, post, or display content on our platform, you grant us a worldwide, non-exclusive, royalty-free 
                  license to use, reproduce, modify, and distribute such content. You represent and warrant that you have all 
                  necessary rights to grant this license and that your content does not violate any third-party rights.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Prohibited Activities</h2>
                <p className="text-muted-foreground mb-4">You are expressly prohibited from:</p>
                <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                  <li>Using the service to violate any applicable laws or regulations</li>
                  <li>Engaging in any fraudulent, abusive, or illegal activity</li>
                  <li>Attempting to reverse engineer or extract source code from our service</li>
                  <li>Using the service to transmit spam, unsolicited messages, or advertisements</li>
                  <li>Collecting or harvesting information about other users</li>
                  <li>Impersonating any person or entity or misrepresenting your affiliation</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Termination</h2>
                <p className="text-muted-foreground">
                  We reserve the right to terminate or suspend your account and access to our service immediately, without prior 
                  notice, for any reason, including but not limited to breach of these Terms. Upon termination, your right to use 
                  the service will cease immediately.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Disclaimer of Warranties</h2>
                <p className="text-muted-foreground">
                  Our service is provided "as is" and "as available" without warranties of any kind, either express or implied. 
                  We do not warrant that the service will be uninterrupted, secure, or error-free, or that defects will be corrected.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  To the maximum extent permitted by law, PayIn Global shall not be liable for any indirect, incidental, special, 
                  consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, 
                  or any loss of data, use, goodwill, or other intangible losses resulting from your use of our service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Indemnification</h2>
                <p className="text-muted-foreground">
                  You agree to indemnify, defend, and hold harmless PayIn Global and its officers, directors, employees, and agents 
                  from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of or relating to 
                  your use of the service or violation of these Terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which PayIn Global 
                  operates, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be subject 
                  to the exclusive jurisdiction of the courts in that jurisdiction.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at 
                  least 30 days notice prior to any new terms taking effect. Your continued use of the service after any changes 
                  constitutes acceptance of the new Terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Severability</h2>
                <p className="text-muted-foreground">
                  If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or 
                  eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about these Terms & Conditions, please contact us:
                </p>
                <div className="mt-4 p-4 bg-card border border-border rounded-lg">
                  <p className="font-semibold">PayIn Global Legal Department</p>
                  <p className="text-muted-foreground">Email: legal@payinglobal.com</p>
                  <p className="text-muted-foreground">Phone: {settings.supportPhone}</p>
                  <p className="text-muted-foreground">Address: Hyderabad, India</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

