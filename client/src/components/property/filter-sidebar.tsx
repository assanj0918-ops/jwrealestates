import { useState, useEffect } from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface FilterState {
  location: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  className?: string;
}

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'condo', label: 'Condo' },
  { value: 'house', label: 'House' },
];

const bedroomOptions = ['1', '2', '3', '4', '5+'];
const bathroomOptions = ['1', '2', '3', '4+'];

const amenities = [
  'Swimming Pool',
  'Gym',
  'Parking',
  'Garden',
  'Security',
  'Elevator',
  'Balcony',
  'Terrace',
  'Smart Home',
  'Concierge',
  'Pet Friendly',
  'Furnished',
];

const formatPrice = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
};

function FilterContent({ filters, onChange, onReset }: FilterSidebarProps) {
  const activeFiltersCount = [
    filters.location,
    filters.propertyType,
    filters.minPrice > 0 || filters.maxPrice < 10000000,
    filters.minArea > 0 || filters.maxArea < 20000,
    filters.bedrooms,
    filters.bathrooms,
    filters.amenities.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
          data-testid="button-reset-filters"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['location', 'type', 'price', 'area', 'rooms', 'amenities']}>
        <AccordionItem value="location">
          <AccordionTrigger className="text-sm font-medium">Location</AccordionTrigger>
          <AccordionContent>
            <Input
              placeholder="Enter city or neighborhood"
              value={filters.location}
              onChange={(e) => onChange({ ...filters, location: e.target.value })}
              data-testid="input-filter-location"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type">
          <AccordionTrigger className="text-sm font-medium">Property Type</AccordionTrigger>
          <AccordionContent>
            <Select
              value={filters.propertyType}
              onValueChange={(value) => onChange({ ...filters, propertyType: value })}
            >
              <SelectTrigger data-testid="select-filter-type">
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any type</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
          <AccordionContent className="pt-4">
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={([min, max]) => onChange({ ...filters, minPrice: min, maxPrice: max })}
              max={10000000}
              step={50000}
              className="mb-4"
              data-testid="slider-filter-price"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatPrice(filters.minPrice)}</span>
              <span>{formatPrice(filters.maxPrice)}</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="area">
          <AccordionTrigger className="text-sm font-medium">Area (sq ft)</AccordionTrigger>
          <AccordionContent className="pt-4">
            <Slider
              value={[filters.minArea, filters.maxArea]}
              onValueChange={([min, max]) => onChange({ ...filters, minArea: min, maxArea: max })}
              max={20000}
              step={100}
              className="mb-4"
              data-testid="slider-filter-area"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{filters.minArea.toLocaleString()} sqft</span>
              <span>{filters.maxArea.toLocaleString()} sqft</span>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rooms">
          <AccordionTrigger className="text-sm font-medium">Bedrooms & Bathrooms</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Bedrooms</Label>
              <div className="flex gap-2">
                {bedroomOptions.map((option) => (
                  <Button
                    key={option}
                    variant={filters.bedrooms === option ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onChange({ ...filters, bedrooms: filters.bedrooms === option ? '' : option })
                    }
                    className="flex-1"
                    data-testid={`button-bedrooms-${option}`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Bathrooms</Label>
              <div className="flex gap-2">
                {bathroomOptions.map((option) => (
                  <Button
                    key={option}
                    variant={filters.bathrooms === option ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      onChange({ ...filters, bathrooms: filters.bathrooms === option ? '' : option })
                    }
                    className="flex-1"
                    data-testid={`button-bathrooms-${option}`}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="amenities">
          <AccordionTrigger className="text-sm font-medium">Amenities</AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-48">
              <div className="space-y-3">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        const newAmenities = checked
                          ? [...filters.amenities, amenity]
                          : filters.amenities.filter((a) => a !== amenity);
                        onChange({ ...filters, amenities: newAmenities });
                      }}
                      data-testid={`checkbox-amenity-${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    <label
                      htmlFor={amenity}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function FilterSidebar({ filters, onChange, onReset, className }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={cn('hidden lg:block', className)} data-testid="filter-sidebar-desktop">
        <FilterContent filters={filters} onChange={onChange} onReset={onReset} />
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="outline" className="gap-2" data-testid="button-open-filters">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-6">
          <SheetHeader className="mb-6">
            <SheetTitle>Filter Properties</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)]">
            <FilterContent filters={filters} onChange={onChange} onReset={onReset} />
          </ScrollArea>
          <div className="mt-4">
            <Button
              className="w-full bg-primary"
              onClick={() => setIsOpen(false)}
              data-testid="button-apply-filters"
            >
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export const defaultFilters: FilterState = {
  location: '',
  propertyType: '',
  minPrice: 0,
  maxPrice: 10000000,
  minArea: 0,
  maxArea: 20000,
  bedrooms: '',
  bathrooms: '',
  amenities: [],
};
