import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie Policy for Grok Ghibli - AI Photo to Studio Ghibli Art Transformer',
};

export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-ghibli-primary">Cookie Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <div className="prose prose-lg max-w-none">
          <h2>1. Introduction</h2>
          <p>
            This Cookie Policy explains how Grok Ghibli ("we", "us", or "our") uses cookies and similar technologies 
            on our website at grokghibli.com. By using our site, you consent to the use of cookies as described in this policy.
          </p>

          <h2>2. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites 
            work more efficiently and provide information to the website owners. Cookies can be "persistent" or "session" cookies, 
            depending on how long they last before they expire.
          </p>

          <h2>3. How We Use Cookies</h2>
          <p>
            We use cookies for various purposes, including:
          </p>
          <ul>
            <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.</li>
            <li><strong>Preference Cookies:</strong> These cookies allow our website to remember choices you have made in the past, like what language you prefer or what your user name and password are so you can automatically log in.</li>
            <li><strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the way our website works.</li>
            <li><strong>Authentication Cookies:</strong> These cookies help us identify users who are logged into our service, enabling features like user profiles and credits management.</li>
            <li><strong>Session Cookies:</strong> These cookies maintain your session while you're using our image transformation services, ensuring your transformations are linked to your account.</li>
          </ul>

          <h2>4. Specific Cookies We Use</h2>
          <p>
            Our website uses the following categories of cookies:
          </p>
          <h3>4.1 NextAuth.js Authentication Cookies</h3>
          <p>
            We use NextAuth.js for user authentication, which sets the following cookies:
          </p>
          <ul>
            <li><strong>next-auth.session-token:</strong> Used to keep you signed in and to recognize you when you return to our site.</li>
            <li><strong>next-auth.csrf-token:</strong> Helps protect your session from certain types of attacks.</li>
            <li><strong>next-auth.callback-url:</strong> Temporarily stores the URL to redirect to after signing in or out.</li>
          </ul>

          <h3>4.2 Analytics Cookies</h3>
          <p>
            We use anonymized analytics to improve our service, which may set cookies to track:
          </p>
          <ul>
            <li>How you arrived at our site</li>
            <li>Which pages you visit</li>
            <li>How long you spend on each page</li>
            <li>What features you use</li>
          </ul>

          <h3>4.3 Functional Cookies</h3>
          <p>
            These cookies help us:
          </p>
          <ul>
            <li>Remember your preferences, such as language or region</li>
            <li>Store user interface settings</li>
            <li>Remember your image transformation history</li>
          </ul>

          <h2>5. Third-Party Cookies</h2>
          <p>
            Some cookies on our website are placed by third parties, such as:
          </p>
          <ul>
            <li><strong>Google:</strong> For authentication via Google OAuth</li>
            <li><strong>Hosting and Infrastructure Services:</strong> For monitoring site performance</li>
          </ul>
          <p>
            These third parties may process your personal information. We recommend reviewing the privacy policies of these providers as well.
          </p>

          <h2>6. Managing Cookies</h2>
          <p>
            Most web browsers allow you to manage your cookie preferences. You can:
          </p>
          <ul>
            <li>Delete cookies from your device</li>
            <li>Block cookies by activating the setting on your browser that allows you to refuse all or some cookies</li>
            <li>Set your browser to notify you when you receive a cookie</li>
          </ul>
          <p>
            Please note that if you choose to block or delete cookies, you may not be able to access certain areas or features of our website, 
            and some services may not function properly.
          </p>

          <h3>Instructions for Managing Cookies in Common Browsers</h3>
          <ul>
            <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
            <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
            <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
          </ul>

          <h2>7. Cookies and Your Privacy</h2>
          <p>
            Our use of cookies may involve the processing of your personal data. For more information on how we handle your personal data, 
            please refer to our <Link href="/privacy-policy" className="text-ghibli-primary hover:underline">Privacy Policy</Link>.
          </p>

          <h2>8. Changes to Our Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date. 
            We encourage you to review this page periodically to stay informed about our use of cookies.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about our Cookie Policy, please contact us at:
          </p>
          <p>
            Email: privacy@grokghibli.com<br />
            Or visit our <Link href="/contact" className="text-ghibli-primary hover:underline">Contact Page</Link>
          </p>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            By continuing to use our website, you are agreeing to our use of cookies as described in this Cookie Policy.
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