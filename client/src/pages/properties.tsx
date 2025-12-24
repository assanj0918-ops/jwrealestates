import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useSearch } from 'wouter';
import { Grid3X3, List, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PropertyCard } from '@/components/property/property-card';
import { FilterSidebar, defaultFilters, type FilterState } from '@/components/property/filter-sidebar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase'; // make sure to import supabase at the top

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import type { Property } from '@shared/schema';

const ITEMS_PER_PAGE = 9;

export default function PropertiesPage() {
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    setFilters({
      ...defaultFilters,
      location: params.get('location') || '',
      propertyType: params.get('type') || '',
      minPrice: parseInt(params.get('minPrice') || '0'),
      maxPrice: parseInt(params.get('maxPrice') || '10000000'),
      minArea: parseInt(params.get('minArea') || '0'),
      maxArea: parseInt(params.get('maxArea') || '20000'),
      bedrooms: params.get('bedrooms') || '',
      bathrooms: params.get('bathrooms') || '',
    });
  }, [searchString]);

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.propertyType && filters.propertyType !== 'any') params.set('type', filters.propertyType);
    if (filters.minPrice > 0) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice < 10000000) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.minArea > 0) params.set('minArea', filters.minArea.toString());
    if (filters.maxArea < 20000) params.set('maxArea', filters.maxArea.toString());
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms);
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms);
    if (filters.amenities.length > 0) params.set('amenities', filters.amenities.join(','));
    params.set('sort', sortBy);
    params.set('page', currentPage.toString());
    return params.toString();
  };
const fetchProperties = async () => {
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' }) // needed for total count
    .range(from, to);

  // Filters
  if (filters.location) query = query.ilike('location', `%${filters.location}%`);
  if (filters.propertyType && filters.propertyType !== 'any')
    query = query.eq('property_type', filters.propertyType);
  if (filters.minPrice) query = query.gte('price', filters.minPrice);
  if (filters.maxPrice && filters.maxPrice < 10000000) query = query.lte('price', filters.maxPrice);
  if (filters.minArea) query = query.gte('area', filters.minArea);
  if (filters.maxArea && filters.maxArea < 20000) query = query.lte('area', filters.maxArea);
  if (filters.bedrooms) query = query.eq('bedrooms', filters.bedrooms);
  if (filters.bathrooms) query = query.eq('bathrooms', filters.bathrooms);

  // Sorting
  switch (sortBy) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'price-low':
      query = query.order('price', { ascending: true });
      break;
    case 'price-high':
      query = query.order('price', { ascending: false });
      break;
    case 'popular':
      query = query.order('view_count', { ascending: false });
      break;
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return { properties: data || [], total: count || 0 };
};
const { data, isLoading } = useQuery({
  queryKey: ['properties', filters, sortBy, currentPage],
  queryFn: fetchProperties,
  keepPreviousData: true,
});


  const properties = data?.properties || [];
  const totalPages = Math.ceil((data?.total || 0) / ITEMS_PER_PAGE);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

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

  return (
    <div className="min-h-screen bg-background" data-testid="page-properties">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Properties</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2" data-testid="text-page-title">
              Properties for Sale
            </h1>
            <p className="text-muted-foreground">
              {data?.total || 0} properties found
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-72 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </aside>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-card rounded-lg border">
                <div className="flex items-center gap-2">
                  <FilterSidebar
                    filters={filters}
                    onChange={handleFilterChange}
                    onReset={handleResetFilters}
                    className="lg:hidden"
                  />
                  
                  <div className="hidden sm:flex items-center gap-1 border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                      data-testid="button-view-grid"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                      data-testid="button-view-list"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-44" data-testid="select-sort">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
                }>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : properties.length > 0 ? (
                <>
                  <div className={viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                  }>
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isFavorite={favorites.has(property.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12" data-testid="pagination">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        data-testid="button-prev-page"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setCurrentPage(pageNum)}
                            data-testid={`button-page-${pageNum}`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        data-testid="button-next-page"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground text-lg mb-4">No properties found matching your criteria.</p>
                  <Button variant="outline" onClick={handleResetFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
