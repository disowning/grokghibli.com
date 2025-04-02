'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function Pricing() {
  return (
    <section className="py-16">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-ghibli-dark">
          Pricing
        </h2>
        <p className="text-lg text-ghibli-dark/80 max-w-3xl mx-auto">
          Experience the full magic of GrokGhibli. Choose the plan that's right for your creative journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <PricingCard 
          title="Free"
          price="$0"
          description="Start your Ghibli artistic journey for free."
          features={[
            '10 transformations',
            'Standard resolution',
            'Basic Ghibli style',
            'Email support'
          ]}
          buttonText="Try for Free"
          buttonVariant="outline"
          popular={false}
          footer="Perfect for trying out Ghibli transformations!"
        />

        <PricingCard 
          title="Totoro"
          price="$9.99"
          originalPrice="$19.99"
          description="$0.5 / transformation"
          features={[
            'Everything in Free, plus',
            '20 transformations',
            'One time purchase',
            'Advanced Ghibli styles',
            'Access to all film aesthetics',
            'Custom settings',
            'High-resolution output',
            'Priority support'
          ]}
          buttonText="Get Totoro"
          buttonVariant="default"
          popular={true}
          footer="Best value for Ghibli enthusiasts!"
        />

        <PricingCard 
          title="Spirited"
          price="$29"
          originalPrice="$59"
          description="$0.29 / transformation"
          features={[
            'Everything in Totoro, plus',
            '100 transformations',
            'One time purchase',
            '24/7 support',
            'Exclusive styles'
          ]}
          buttonText="Get Spirited"
          buttonVariant="secondary"
          popular={false}
          footer="Best value for serious Ghibli fans!"
        />
      </div>
    </section>
  );
}

interface PricingCardProps {
  title: string;
  price: string;
  originalPrice?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: 'default' | 'secondary' | 'outline';
  popular: boolean;
  footer: string;
}

function PricingCard({ 
  title, 
  price, 
  originalPrice, 
  description, 
  features, 
  buttonText, 
  buttonVariant, 
  popular,
  footer 
}: PricingCardProps) {
  return (
    <Card className={`relative overflow-hidden ${popular ? 'ring-2 ring-ghibli-secondary shadow-lg' : ''}`}>
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-ghibli-secondary text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
            Popular
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
        <div className="text-center mt-2">
          <div className="flex items-center justify-center">
            {originalPrice && (
              <span className="text-gray-400 line-through mr-2">{originalPrice}</span>
            )}
            <span className="text-3xl font-bold text-ghibli-dark">{price}</span>
            <span className="text-gray-500 ml-1">USD</span>
          </div>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="font-medium">Includes</p>
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <Check className="h-5 w-5 text-ghibli-secondary shrink-0 mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-4">
        <Button variant={buttonVariant} className="w-full">
          {buttonText}
        </Button>
        <p className="text-sm text-center text-gray-500">{footer}</p>
      </CardFooter>
    </Card>
  );
} 