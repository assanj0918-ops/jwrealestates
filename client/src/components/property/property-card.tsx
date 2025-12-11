import { Link } from 'wouter';
import { Heart, Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Property } from '@shared/schema';
import { useState } from 'react';

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  className?: string;
}

export function PropertyCard({ property, isFavorite = false, onToggleFavorite, className }: PropertyCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const images = property.images as string[] || [];
  const currentImage = images[imageIndex] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80';

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${(price / 1000).toFixed(0)}K`;
  };

  return (
    <Card
      className={cn(
        'group overflow-visible rounded-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        className
      )}
      data-testid={`card-property-${property.id}`}
    >
      <div className="relative overflow-hidden rounded-t-md">
        <Link href={`/properties/${property.id}`}>
          <a>
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={currentImage}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                data-testid={`img-property-${property.id}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </a>
        </Link>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setImageIndex(idx)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  idx === imageIndex ? 'bg-white w-4' : 'bg-white/60 hover:bg-white/80'
                )}
                aria-label={`View image ${idx + 1}`}
                data-testid={`button-image-dot-${idx}`}
              />
            ))}
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          {property.isFeatured && (
            <Badge className="bg-gold text-white border-0" data-testid={`badge-featured-${property.id}`}>
              Featured
            </Badge>
          )}
          <Badge
            variant={property.status === 'available' ? 'default' : 'secondary'}
            className={cn(
              property.status === 'available' && 'bg-green-500 text-white border-0'
            )}
            data-testid={`badge-status-${property.id}`}
          >
            {property.status === 'available' ? 'For Sale' : property.status}
          </Badge>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite?.(property.id);
          }}
          className={cn(
            'absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center transition-all',
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
          )}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          data-testid={`button-favorite-${property.id}`}
        >
          <Heart className={cn('h-5 w-5', isFavorite && 'fill-current')} />
        </button>

        <div className="absolute bottom-3 right-3">
          <Badge className="bg-gold text-white text-lg font-bold border-0 px-3 py-1" data-testid={`badge-price-${property.id}`}>
            {formatPrice(property.price)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        <Link href={`/properties/${property.id}`}>
          <a className="block">
            <h3
              className="text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors"
              data-testid={`text-title-${property.id}`}
            >
              {property.title}
            </h3>
          </a>
        </Link>

        <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm line-clamp-1" data-testid={`text-location-${property.id}`}>
            {property.location}, {property.city}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5" data-testid={`text-beds-${property.id}`}>
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1.5" data-testid={`text-baths-${property.id}`}>
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1.5" data-testid={`text-area-${property.id}`}>
              <Maximize className="h-4 w-4" />
              <span>{property.area.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>

        <Link href={`/properties/${property.id}`}>
          <Button
            variant="outline"
            className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-white"
            data-testid={`button-view-details-${property.id}`}
          >
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
