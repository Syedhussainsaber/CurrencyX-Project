import Header from '@/components/common/header'
import Footer from '@/components/common/footer'
import { getSiteSettings } from '@/lib/site'
import { Shield, Lock, Eye, FileText } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - PayIn Global',
  description: 'Read PayIn Global privacy policy to understand how we collect, use, and protect your personal information.',
  alternates: {
    canonical: 'https://payinglobal.com/privacy'
  }
}

export default async function PrivacyPage() {
  const settings = await getSiteSettings()
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <Shield size={48} className="text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose dark:prose-invert max-w-none">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Lock size={24} className="text-primary" />
                  Introduction
                </h2>
                <p className="text-muted-foreground">
                  At PayIn Global, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                  currency conversion services, website, and related applications.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Eye size={24} className="text-primary" />
                  Information We Collect
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                    <p>We may collect personal information that you voluntarily provide to us when you:</p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                      <li>Register for an account</li>
                      <li>Use our currency conversion services</li>
                      <li>Contact us through our contact form</li>
                      <li>Subscribe to our newsletter or blog updates</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Automatically Collected Information</h3>
                    <p>When you visit our website, we automatically collect certain information about your device, including:</p>
                    <ul className="list-disc ml-6 mt-2 space-y-1">
                      <li>IP address and location data</li>
                      <li>Browser type and version</li>
                      <li>Operating system</li>
                      <li>Pages visited and time spent on pages</li>
                      <li>Referring website addresses</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FileText size={24} className="text-primary" />
                  How We Use Your Information
                </h2>
                <p className="text-muted-foreground mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                  <li>Providing and maintaining our currency conversion services</li>
                  <li>Processing transactions and managing your account</li>
                  <li>Improving our website and services</li>
                  <li>Communicating with you about our services, updates, and promotional offers</li>
                  <li>Responding to your inquiries and providing customer support</li>
                  <li>Detecting, preventing, and addressing technical issues and security threats</li>
                  <li>Complying with legal obligations and enforcing our terms of service</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, 
                  secure servers, and regular security audits. However, no method of transmission over the Internet or 
                  electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
                <p className="text-muted-foreground">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this 
                  Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need 
                  your information, we will securely delete or anonymize it.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                <p className="text-muted-foreground mb-4">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                  <li>The right to access your personal information</li>
                  <li>The right to rectify inaccurate or incomplete information</li>
                  <li>The right to request deletion of your personal information</li>
                  <li>The right to object to processing of your personal information</li>
                  <li>The right to data portability</li>
                  <li>The right to withdraw consent at any time</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Cookies and Tracking Technologies</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to track activity on our website and store certain information. 
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you 
                  do not accept cookies, you may not be able to use some portions of our service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
                <p className="text-muted-foreground">
                  Our website may contain links to third-party websites or services that are not owned or controlled by PayIn Global. 
                  We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy 
                  policies of any third-party services you access.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal 
                  information from children. If you become aware that a child has provided us with personal information, 
                  please contact us immediately.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                  Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy 
                  Policy periodically for any changes.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-card border border-border rounded-lg">
                  <p className="font-semibold">PayIn Global Privacy Team</p>
                  <p className="text-muted-foreground">Email: privacy@payinglobal.com</p>
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

