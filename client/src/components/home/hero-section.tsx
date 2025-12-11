import { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, MapPin, Home, DollarSign, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'condo', label: 'Condo' },
  { value: 'house', label: 'House' },
];

export function HeroSection() {
  const [, setLocation] = useLocation();
  const [searchLocation, setSearchLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [areaRange, setAreaRange] = useState([0, 10000]);

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.set('location', searchLocation);
    if (propertyType) params.set('type', propertyType);
    if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 5000000) params.set('maxPrice', priceRange[1].toString());
    if (areaRange[0] > 0) params.set('minArea', areaRange[0].toString());
    if (areaRange[1] < 10000) params.set('maxArea', areaRange[1].toString());
    
    setLocation(`/properties${params.toString() ? '?' + params.toString() : ''}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        data-testid="hero-video"
      >
        <source
          src="https://videos.pexels.com/video-files/7578551/7578551-hd_1920_1080_30fps.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-32">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white uppercase tracking-wide mb-6 drop-shadow-lg"
            data-testid="text-hero-title"
          >
            Building Bespoke Residences With Ultimate Detail To{' '}
            <span className="text-gold">Luxury</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 drop-shadow-md" data-testid="text-hero-subtitle">
            Discover extraordinary properties that redefine modern living. 
            Your dream home awaits.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-gold hover:bg-gold/90 text-white px-8 py-6 text-lg font-semibold shadow-xl"
              onClick={() => setLocation('/properties')}
              data-testid="button-explore-properties"
            >
              Explore Properties
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold backdrop-blur-sm"
              onClick={() => setLocation('/contact')}
              data-testid="button-contact-agent"
            >
              Contact an Agent
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl p-6 lg:p-8" data-testid="search-form">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Location
                </label>
                <Input
                  placeholder="Enter city or area"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="h-12"
                  data-testid="input-search-location"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  Property Type
                </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-12" data-testid="select-property-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Price Range
                </label>
                <div className="pt-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={5000000}
                    step={50000}
                    className="mb-2"
                    data-testid="slider-price-range"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Maximize className="h-4 w-4 text-primary" />
                  Area (sq ft)
                </label>
                <div className="pt-2">
                  <Slider
                    value={areaRange}
                    onValueChange={setAreaRange}
                    max={10000}
                    step={100}
                    className="mb-2"
                    data-testid="slider-area-range"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{areaRange[0].toLocaleString()} sqft</span>
                    <span>{areaRange[1].toLocaleString()} sqft</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 text-white px-12 h-12 text-base font-semibold shadow-lg"
                data-testid="button-search"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Properties
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
