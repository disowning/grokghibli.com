import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Mail, MapPin, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact the Grok Ghibli team for support, feedback, or inquiries',
};

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-ghibli-primary">Contact Us</h1>
        
        <div className="prose prose-lg max-w-none">
          <p>
            We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to get in touch.
          </p>
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">General Inquiries</h2>
            <p>
              For general questions about our service:
              <br />
              <a href="mailto:info@grokghibli.com" className="text-ghibli-primary hover:underline">
                info@grokghibli.com
              </a>
            </p>
          </div>
          
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Technical Support</h2>
            <p>
              If you're experiencing any issues with our service:
              <br />
              <a href="mailto:support@grokghibli.com" className="text-ghibli-primary hover:underline">
                support@grokghibli.com
              </a>
            </p>
          </div>
          
          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Privacy & Legal</h2>
            <p>
              For inquiries related to privacy or legal matters:
              <br />
              <a href="mailto:legal@grokghibli.com" className="text-ghibli-primary hover:underline">
                legal@grokghibli.com
              </a>
            </p>
            <p className="mt-4">
              Please review our <Link href="/privacy-policy" className="text-ghibli-primary hover:underline">Privacy Policy</Link> and <Link href="/terms-of-service" className="text-ghibli-primary hover:underline">Terms of Service</Link> for detailed information about how we handle your data and our service terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 