import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Mail, MapPin, Phone } from 'lucide-react'

export const metadata = {
  title: 'Contact Us - Grok Ghibli AI Support Team',
  description: 'Get in touch with the Grok Ghibli team. We\'re here to help with any questions about our AI photo transformation service. Last updated: April 3, 2025.',
  keywords: ['contact grok ghibli', 'ghibli ai support', 'grok help', 'ai transformation contact'],
  openGraph: {
    title: 'Contact Grok Ghibli - Get Support & Information',
    description: 'Need help with Grok Ghibli? Contact our support team today. We respond to all inquiries within 24 hours. Last updated: April 3, 2025.',
    type: 'website',
    url: 'https://grokghibli.com/contact',
    images: [
      {
        url: 'https://grokghibli.com/images/og/contact-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Grok Ghibli Contact'
      }
    ]
  }
}

export default function ContactPage() {
  return (
    <div className="space-y-12 py-8">
      {/* Hero Banner */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-ghibli-dark">
          Contact Us
        </h1>
        <p className="text-xl text-ghibli-primary max-w-3xl mx-auto">
          Have questions about Grok Ghibli? Our team is ready to assist you with any inquiries.
        </p>
      </section>

      {/* Contact Form and Info */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Send Us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email address" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What is this regarding?" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Your message..." 
                  className="min-h-[150px]"
                />
              </div>
              
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-heading font-semibold mb-6 text-ghibli-dark">
              Contact Information
            </h2>
            <p className="text-ghibli-dark/80 mb-8">
              We're here to help! Choose the most convenient way to reach out to us.
            </p>
          </div>
          
          <div className="space-y-6">
            <Card className="border-l-4 border-l-ghibli-primary">
              <CardContent className="flex items-center p-6">
                <div className="bg-ghibli-light p-3 rounded-full mr-4">
                  <Mail className="w-6 h-6 text-ghibli-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-ghibli-dark/70">Email Us</p>
                  <p className="text-ghibli-dark font-medium">support@grokghibli.com</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-ghibli-secondary">
              <CardContent className="flex items-center p-6">
                <div className="bg-ghibli-light p-3 rounded-full mr-4">
                  <Phone className="w-6 h-6 text-ghibli-secondary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-ghibli-dark/70">Call Us</p>
                  <p className="text-ghibli-dark font-medium">+1 (888) GROK-GBL</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-ghibli-accent">
              <CardContent className="flex items-center p-6">
                <div className="bg-ghibli-light p-3 rounded-full mr-4">
                  <MapPin className="w-6 h-6 text-ghibli-accent" />
                </div>
                <div>
                  <p className="font-medium text-sm text-ghibli-dark/70">Visit Us</p>
                  <p className="text-ghibli-dark font-medium">Virtual Office</p>
                  <p className="text-ghibli-dark/70 text-sm">We're a fully remote team</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-ghibli-light/50 p-6 rounded-lg">
            <h3 className="text-xl font-heading font-medium mb-3 text-ghibli-dark">
              Business Hours
            </h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-ghibli-dark/70">Monday-Friday:</span>
                <span className="text-ghibli-dark font-medium">9:00 AM - 6:00 PM EST</span>
              </li>
              <li className="flex justify-between">
                <span className="text-ghibli-dark/70">Saturday:</span>
                <span className="text-ghibli-dark font-medium">10:00 AM - 4:00 PM EST</span>
              </li>
              <li className="flex justify-between">
                <span className="text-ghibli-dark/70">Sunday:</span>
                <span className="text-ghibli-dark font-medium">Closed</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-12 bg-ghibli-light/30 rounded-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-semibold text-ghibli-dark text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How quickly will I receive my transformed image?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Most transformations complete within 20-30 seconds, depending on server load and image complexity.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my data secure when I upload images?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Yes! We encrypt all uploads and delete images from our servers after processing unless you specifically choose to save them.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I use the transformed images commercially?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Personal use is included with all plans. Commercial rights are available with our Professional and Enterprise plans.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer bulk transformations?</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Yes! Our Professional and Enterprise plans include batch processing features for multiple images.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
} 