import Pricing from '@/components/Pricing'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata = {
  title: 'Grok Ghibli Pricing - Transform Photos to Ghibli Art | Free & Premium Plans',
  description: 'Explore Grok Ghibli\'s affordable pricing plans for 2025. Choose between Free, Totoro, and Spirited plans to transform your photos into beautiful Studio Ghibli-style artwork with our AI technology. Last updated: April 3, 2025.',
  keywords: [
    'grok ghibli pricing', 
    'ghibli art generator cost', 
    'ai transformation price', 
    'studio ghibli filter subscription', 
    'photo to anime pricing', 
    'ghibli style converter cost',
    'totoro plan',
    'spirited plan',
    'free ghibli art',
    '2025 ai pricing'
  ],
  openGraph: {
    title: 'Grok Ghibli Pricing - Transform Photos to Ghibli Art | 2025 Plans',
    description: 'Explore our simple, transparent pricing plans for 2025. Choose the perfect option to transform your photos into Studio Ghibli-style artwork. Updated April 3, 2025.',
    type: 'website',
    url: 'https://grokghibli.com/pricing',
    images: [
      {
        url: 'https://grokghibli.com/images/og/pricing-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Grok Ghibli Pricing Plans'
      }
    ]
  }
}

export default function PricingPage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Banner */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-ghibli-dark">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-ghibli-primary max-w-3xl mx-auto">
          Choose the plan that's right for your creative journey, with no hidden fees or subscriptions.
        </p>
      </section>

      {/* Pricing Component */}
      <Pricing />

      {/* FAQ Section */}
      <section className="py-12 bg-white rounded-xl shadow-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-semibold text-ghibli-dark text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <FAQItem 
              question="How many transformations do I get with each plan?"
              answer="Our Free plan includes 10 transformations, the Totoro plan includes 20 transformations, and the Spirited plan includes 100 transformations. Once you use all your transformations, you can purchase a new plan."
            />
            <FAQItem 
              question="What's the difference between the plans besides the number of transformations?"
              answer="Higher-tier plans offer more features such as higher resolution outputs, advanced Ghibli styles with more customization options, priority support, and exclusive styles not available in lower tiers."
            />
            <FAQItem 
              question="Do the plans expire?"
              answer="No, our plans are one-time purchases and your transformations never expire. You can use them at your own pace without worrying about monthly fees or time limits."
            />
            <FAQItem 
              question="Can I upgrade my plan later?"
              answer="Yes, you can upgrade to a higher-tier plan at any time. When you upgrade, you'll receive the full number of transformations included in your new plan."
            />
            <FAQItem 
              question="What payment methods do you accept?"
              answer="We accept all major credit cards, PayPal, and select cryptocurrency payments. All transactions are secure and encrypted."
            />
            <FAQItem 
              question="Do you offer refunds?"
              answer="We offer a satisfaction guarantee. If you're not happy with the quality of transformations, please contact our support team within 7 days of purchase, and we'll work to make it right or provide a refund."
            />
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-semibold text-ghibli-dark text-center mb-8">
            Compare Plans
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-4 text-left">Feature</th>
                  <th className="py-4 px-4 text-center">Free</th>
                  <th className="py-4 px-4 text-center bg-ghibli-light/30">Totoro</th>
                  <th className="py-4 px-4 text-center">Spirited</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Transformations</td>
                  <td className="py-4 px-4 text-center">10</td>
                  <td className="py-4 px-4 text-center bg-ghibli-light/30">20</td>
                  <td className="py-4 px-4 text-center">100</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Output Resolution</td>
                  <td className="py-4 px-4 text-center">Standard (720p)</td>
                  <td className="py-4 px-4 text-center bg-ghibli-light/30">High (1080p)</td>
                  <td className="py-4 px-4 text-center">Ultra (4K)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Style Options</td>
                  <td className="py-4 px-4 text-center">Basic (1)</td>
                  <td className="py-4 px-4 text-center bg-ghibli-light/30">Advanced (5+)</td>
                  <td className="py-4 px-4 text-center">All Styles (10+)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Style Customization</td>
                  <td className="py-4 px-4 text-center">❌</td>
                  <td className="py-4 px-4 text-center bg-ghibli-light/30">✓</td>
                  <td className="py-4 px-4 text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Download Format</td>
                  <td className="py-4 px-4 text-center">JPG</td>
                  <td className="py-4 px-4 text-center bg-ghibli-light/30">JPG, PNG</td>
                  <td className="py-4 px-4 text-center">JPG, PNG, TIFF</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Priority Processing</td>
                  <td className="py-4 px-4 text-center">❌</td>
                  <td className="py-4 px-4 text-center bg-ghibli-light/30">✓</td>
                  <td className="py-4 px-4 text-center">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Customer Support</td>
                  <td className="py-4 px-4 text-center">Email</td>
                  <td className="py-4 px-4 text-center bg-ghibli-light/30">Priority Email</td>
                  <td className="py-4 px-4 text-center">24/7 Support</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Commercial Usage</td>
                  <td className="py-4 px-4 text-center">❌</td>
                  <td className="py-4 px-4 text-center bg-ghibli-light/30">Limited</td>
                  <td className="py-4 px-4 text-center">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-12 bg-ghibli-light/30 rounded-xl">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-semibold text-ghibli-dark mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            For businesses, teams, or special projects with unique requirements, we offer customized enterprise solutions.
          </p>
          <a href="mailto:enterprise@grokghibli.com" className="inline-block bg-ghibli-dark text-white py-3 px-6 rounded-md hover:bg-ghibli-dark/90 transition-colors">
            Contact us for Enterprise
          </a>
        </div>
      </section>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b pb-6">
      <h3 className="text-lg font-medium text-ghibli-dark mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  )
} 