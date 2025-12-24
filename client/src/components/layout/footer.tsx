import { Link } from 'wouter';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const quickLinks = [
  { href: '/properties', label: 'Browse Properties' },
  { href: '/agents', label: 'Our Agents' },
  { href: '/blog', label: 'Insights & News' },
  { href: '/contact', label: 'Contact Us' },
];

const propertyTypes = [
  { href: '/properties?type=apartment', label: 'Apartments' },
  { href: '/properties?type=villa', label: 'Villas' },
  { href: '/properties?type=penthouse', label: 'Penthouses' },
  { href: '/properties?type=townhouse', label: 'Townhouses' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: 'Subscribed!',
        description: 'Thank you for subscribing to our newsletter.',
      });
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#111111] text-white" data-testid="footer">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight mb-6 inline-block"
              data-testid="link-footer-logo"
            >
              JW<span className="text-gold">REALTY</span>
            </Link>
            <p className="text-white/70 mb-6 leading-relaxed">
              Building bespoke residences with ultimate attention to detail and luxury. 
              Your trusted partner in finding the perfect property.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="Facebook"
                data-testid="link-social-facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="Twitter"
                data-testid="link-social-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="Instagram"
                data-testid="link-social-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="LinkedIn"
                data-testid="link-social-linkedin"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Property Types</h4>
            <ul className="space-y-3">
              {propertyTypes.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/70">
                  123 Luxury Avenue<br />
                  Manhattan, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold flex-shrink-0" />
                <a href="tel:+1234567890" className="text-white/70 hover:text-gold transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold flex-shrink-0" />
                <a href="mailto:info@jwrealty.com" className="text-white/70 hover:text-gold transition-colors">
                  info@jwrealty.com
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <h5 className="text-sm font-semibold mb-3">Subscribe to Newsletter</h5>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  data-testid="input-newsletter-email"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-gold hover:bg-gold/90 flex-shrink-0"
                  data-testid="button-newsletter-submit"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} JWREALTY. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
