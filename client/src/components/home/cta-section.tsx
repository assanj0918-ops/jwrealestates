import { Link } from 'wouter';
import { Building2, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-primary relative overflow-hidden" data-testid="section-cta">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" data-testid="text-cta-title">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl">
              Whether you're looking to buy, sell, or rent, our team of expert agents is here to guide you every step of the way.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link href="/properties">
                <Button
                  size="lg"
                  className="bg-gold hover:bg-gold/90 text-white px-8"
                  data-testid="button-cta-list-property"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  List Your Property
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8"
                  data-testid="button-cta-contact"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Contact an Agent
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center" data-testid="stat-properties">
              <p className="text-4xl lg:text-5xl font-bold text-white mb-2">500+</p>
              <p className="text-white/70">Properties Listed</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center" data-testid="stat-clients">
              <p className="text-4xl lg:text-5xl font-bold text-white mb-2">2000+</p>
              <p className="text-white/70">Happy Clients</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center" data-testid="stat-agents">
              <p className="text-4xl lg:text-5xl font-bold text-white mb-2">50+</p>
              <p className="text-white/70">Expert Agents</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center" data-testid="stat-experience">
              <p className="text-4xl lg:text-5xl font-bold text-white mb-2">15+</p>
              <p className="text-white/70">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
