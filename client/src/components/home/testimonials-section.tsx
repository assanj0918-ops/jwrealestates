import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Homeowner',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    rating: 5,
    quote: 'LuxeEstates made finding our dream home an absolute pleasure. Their attention to detail and understanding of our needs was remarkable. We couldn\'t be happier with our new penthouse.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Property Investor',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    rating: 5,
    quote: 'As an investor, I value professionalism and market expertise. LuxeEstates delivered on both fronts, helping me build a remarkable portfolio of luxury properties.',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'First-time Buyer',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    rating: 5,
    quote: 'The team at LuxeEstates guided us through every step of buying our first home. Their patience and expertise made what seemed daunting feel effortless.',
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'CEO, Thompson Industries',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    rating: 5,
    quote: 'When it comes to luxury real estate, LuxeEstates is simply the best. They found us a property that exceeded all our expectations.',
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 lg:py-28 bg-muted/30" data-testid="section-testimonials">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider mb-2 block">
            Testimonials
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-testimonials-title">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Hear from satisfied clients who found their perfect property with LuxeEstates.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-background rounded-lg shadow-xl p-8 lg:p-12" data-testid="testimonial-card">
            <Quote className="absolute top-6 left-6 h-12 w-12 text-gold/20" />
            
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-6 ring-4 ring-gold/20">
                <AvatarImage src={currentTestimonial.image} alt={currentTestimonial.name} />
                <AvatarFallback className="bg-gold text-white text-xl">
                  {currentTestimonial.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      i < currentTestimonial.rating
                        ? 'text-gold fill-gold'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>

              <blockquote
                className="text-lg lg:text-xl text-foreground italic leading-relaxed mb-6"
                data-testid="text-testimonial-quote"
              >
                "{currentTestimonial.quote}"
              </blockquote>

              <div>
                <p className="font-semibold text-foreground" data-testid="text-testimonial-name">
                  {currentTestimonial.name}
                </p>
                <p className="text-muted-foreground text-sm" data-testid="text-testimonial-role">
                  {currentTestimonial.role}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-full"
                data-testid="button-testimonial-prev"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all',
                      index === currentIndex
                        ? 'bg-gold w-6'
                        : 'bg-gray-300 hover:bg-gray-400'
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                    data-testid={`button-testimonial-dot-${index}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-full"
                data-testid="button-testimonial-next"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
