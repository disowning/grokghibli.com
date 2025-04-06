import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Grok Ghibli - AI Photo to Studio Ghibli Art Transformer',
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-ghibli-primary">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <div className="prose prose-lg max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Grok Ghibli ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <p>We may collect information that you provide directly to us, including:</p>
          <ul>
            <li>Account information: When you register for an account, we collect your name, email address, and profile picture through Google OAuth.</li>
            <li>User content: Images you upload for transformation using our service.</li>
            <li>Communications: Information you provide when contacting us.</li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <p>When you use our service, we may automatically collect certain information, including:</p>
          <ul>
            <li>Usage data: How you interact with our service, features you use, and time spent on the platform.</li>
            <li>Device information: IP address, browser type, operating system, and device identifiers.</li>
            <li>Cookies and similar technologies: Information collected through cookies and similar tracking technologies.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including:</p>
          <ul>
            <li>Providing and improving our services</li>
            <li>Processing your image transformations</li>
            <li>Managing your account and tracking credits usage</li>
            <li>Communicating with you about our services</li>
            <li>Ensuring security and preventing fraud</li>
            <li>Complying with legal obligations</li>
          </ul>

          <h2>4. Image Processing and Storage</h2>
          <p>
            When you upload images to our platform for transformation:
          </p>
          <ul>
            <li>Your original and transformed images are temporarily stored to process your request.</li>
            <li>Images are stored for a limited time (maximum 1 hour) and then automatically deleted.</li>
            <li>We do not use your images for training AI models or for purposes other than providing our transformation service to you.</li>
            <li>Your images are processed using secure servers and encrypted during transmission.</li>
          </ul>

          <h2>5. Data Sharing and Disclosure</h2>
          <p>We may share your information in the following circumstances:</p>
          <ul>
            <li>Service providers: We share information with third-party service providers who help us operate our business (e.g., hosting providers, payment processors).</li>
            <li>Legal requirements: We may disclose information if required by law or if we believe it's necessary to protect our rights or the safety of users.</li>
            <li>Business transfers: If we're involved in a merger, acquisition, or sale of assets, your information may be transferred.</li>
          </ul>

          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, 
            alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 
            100% secure, so we cannot guarantee absolute security.
          </p>

          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
          <ul>
            <li>Access: Request access to your personal data</li>
            <li>Correction: Request correction of inaccurate data</li>
            <li>Deletion: Request deletion of your data under certain circumstances</li>
            <li>Restriction: Request restriction of processing</li>
            <li>Portability: Request transfer of your data to another service</li>
            <li>Objection: Object to the processing of your data</li>
          </ul>
          <p>To exercise these rights, please contact us using the information provided below.</p>

          <h2>8. Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
            unless a longer retention period is required or permitted by law. User accounts and associated data will be retained 
            as long as the account is active or as needed to provide services.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information 
            from children under 13. If we discover that a child under 13 has provided us with personal information, 
            we will delete it immediately.
          </p>

          <h2>10. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. 
            These countries may have different data protection laws. We will take appropriate safeguards to ensure 
            your information remains protected.
          </p>

          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
            new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this 
            Privacy Policy periodically for any changes.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data practices, 
            please contact us at:
          </p>
          <p>
            Email: privacy@grokghibli.com<br />
            Or visit our <Link href="/contact" className="text-ghibli-primary hover:underline">Contact Page</Link>
          </p>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            By using our service, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <div className="mt-4">
            <Link 
              href="/" 
              className="inline-block bg-ghibli-primary text-white px-6 py-2 rounded-md hover:bg-ghibli-primary-dark transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 