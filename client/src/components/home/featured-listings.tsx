import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/property-card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import type { Property } from '@shared/schema';
import { useRef, useState } from 'react';

export function FeaturedListings() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const fetchFeaturedProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) throw error;
    return data || [];
  };

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['properties', 'featured'],
    queryFn: fetchFeaturedProperties,
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-background" data-testid="section-featured-listings">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-gold text-sm font-semibold uppercase tracking-wider mb-2 block">
              Featured Properties
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-featured-title">
              Discover Our Exclusive Listings
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Handpicked luxury properties that represent the pinnacle of modern living and architectural excellence.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('left')}
                className="rounded-full"
                data-testid="button-scroll-left"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('right')}
                className="rounded-full"
                data-testid="button-scroll-right"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <Link href="/properties">
              <Button variant="default" className="bg-primary" data-testid="button-view-all">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : properties && properties.length > 0 ? (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {properties.map((property) => (
              <div key={property.id} className="flex-shrink-0 w-[350px] snap-start">
                <PropertyCard
                  property={property}
                  isFavorite={favorites.has(property.id)}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No featured properties available at the moment.</p>
            <Link href="/properties">
              <Button variant="outline" className="mt-4">
                Browse All Properties
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}