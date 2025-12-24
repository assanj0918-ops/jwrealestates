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
  {
    id: 5,
    name: 'Jessica Adams',
    role: 'Interior Designer',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
    rating: 5,
    quote: 'Working with LuxeEstates was a game-changer. They understood my vision and found the perfect space for my design studio.',
  },
  {
    id: 6,
    name: 'Robert Martinez',
    role: 'Entrepreneur',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    rating: 5,
    quote: 'Professional, reliable, and incredibly knowledgeable. LuxeEstates helped me secure an investment property that has exceeded my ROI expectations.',
  },
];

export function TestimonialsSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const next = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const startIndex = currentPage * itemsPerPage;
  const visibleTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-muted/30 via-muted/50 to-muted/30 relative overflow-hidden" data-testid="section-testimonials">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-wider mb-2 block">
            Testimonials
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-testimonials-title">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from satisfied clients who found their perfect property with us. Their success stories inspire us every day.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Testimonial Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-background rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-border relative group"
                data-testid="testimonial-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Quote icon */}
                <Quote className="absolute top-4 right-4 h-8 w-8 text-gold/20 group-hover:text-gold/40 transition-colors" />
                
                <div className="flex flex-col h-full">
                  {/* Avatar and Rating */}
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16 ring-2 ring-gold/20 group-hover:ring-gold/40 transition-all">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback className="bg-gold text-white text-lg">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <p className="font-semibold text-foreground" data-testid="text-testimonial-name">
                        {testimonial.name}
                      </p>
                      <p className="text-muted-foreground text-sm" data-testid="text-testimonial-role">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < testimonial.rating
                            ? 'text-gold fill-gold'
                            : 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote
                    className="text-muted-foreground leading-relaxed flex-1 text-sm lg:text-base"
                    data-testid="text-testimonial-quote"
                  >
                    "{testimonial.quote}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full hover:bg-primary/10 hover:border-primary transition-all"
              data-testid="button-testimonial-prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={cn(
                    'h-2.5 rounded-full transition-all duration-300',
                    index === currentPage
                      ? 'bg-gold w-8'
                      : 'bg-gray-300 w-2.5 hover:bg-gray-400'
                  )}
                  aria-label={`Go to page ${index + 1}`}
                  data-testid={`button-testimonial-dot-${index}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full hover:bg-primary/10 hover:border-primary transition-all"
              data-testid="button-testimonial-next"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}