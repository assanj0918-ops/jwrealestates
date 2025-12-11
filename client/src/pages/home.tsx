import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedListings } from '@/components/home/featured-listings';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { CTASection } from '@/components/home/cta-section';
import { BlogPreview } from '@/components/home/blog-preview';

export default function HomePage() {
  return (
    <div className="min-h-screen" data-testid="page-home">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedListings />
        <CTASection />
        <TestimonialsSection />
        <BlogPreview />
      </main>
      <Footer />
    </div>
  );
}
