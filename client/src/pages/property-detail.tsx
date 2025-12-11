import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import {
  Heart, Share2, Bed, Bath, Maximize, Building2, Calendar, MapPin,
  Phone, Mail, ChevronLeft, ChevronRight, Check, X, ZoomIn
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PropertyCard } from '@/components/property/property-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { PropertyWithAgent, Property } from '@shared/schema';
import { cn } from '@/lib/utils';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const { data: property, isLoading } = useQuery<PropertyWithAgent>({
    queryKey: ['/api/properties', id],
  });

  const { data: similarProperties } = useQuery<Property[]>({
    queryKey: ['/api/properties', 'similar', id],
    enabled: !!property,
  });

  const inquiryMutation = useMutation({
    mutationFn: async (data: typeof inquiryForm) => {
      return apiRequest('POST', '/api/inquiries', {
        ...data,
        propertyId: id,
        agentId: property?.agentId,
        userId: user?.id,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Inquiry Sent!',
        description: 'The agent will contact you shortly.',
      });
      setInquiryForm({ name: '', email: '', phone: '', message: '' });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send inquiry. Please try again.',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <Skeleton className="h-[60vh] w-full rounded-lg mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-40 w-full" />
              </div>
              <Skeleton className="h-96" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8 text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-8">The property you're looking for doesn't exist.</p>
            <Link href="/properties">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = (property.images as string[]) || [];
  const currentImage = images[currentImageIndex] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80';
  const amenities = (property.amenities as string[]) || [];
  const features = (property.features as string[]) || [];
  const agent = property.agent;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inquiryMutation.mutate(inquiryForm);
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-property-detail">
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
                <BreadcrumbLink href="/properties">Properties</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{property.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="relative rounded-lg overflow-hidden mb-8" data-testid="property-gallery">
            <div className="aspect-[16/9] lg:aspect-[21/9] relative group">
              <img
                src={currentImage}
                alt={property.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              />
              <button
                className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsLightboxOpen(true)}
              >
                <ZoomIn className="h-12 w-12 text-white" />
              </button>

              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)}
                    data-testid="button-prev-image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setCurrentImageIndex((i) => (i + 1) % images.length)}
                    data-testid="button-next-image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}

              <div className="absolute top-4 left-4 flex gap-2">
                {property.isFeatured && (
                  <Badge className="bg-gold text-white border-0">Featured</Badge>
                )}
                <Badge
                  className={cn(
                    property.status === 'available'
                      ? 'bg-green-500 text-white border-0'
                      : 'bg-secondary'
                  )}
                >
                  {property.status === 'available' ? 'For Sale' : property.status}
                </Badge>
              </div>

              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsFavorite(!isFavorite)}
                  data-testid="button-favorite"
                >
                  <Heart className={cn('h-5 w-5', isFavorite && 'fill-red-500 text-red-500')} />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                  data-testid="button-share"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      'flex-shrink-0 w-24 h-16 rounded-md overflow-hidden border-2 transition-all',
                      idx === currentImageIndex ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                    )}
                    data-testid={`button-thumbnail-${idx}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2" data-testid="text-property-title">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span data-testid="text-property-location">
                        {property.address}, {property.city}, {property.state}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gold" data-testid="text-property-price">
                      {formatPrice(property.price)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${(property.price / property.area).toFixed(0)}/sqft
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 p-4 bg-muted/30 rounded-lg" data-testid="property-specs">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{property.bedrooms}</p>
                      <p className="text-xs text-muted-foreground">Bedrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{property.bathrooms}</p>
                      <p className="text-xs text-muted-foreground">Bathrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">{property.area.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Sq Ft</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold capitalize">{property.propertyType}</p>
                      <p className="text-xs text-muted-foreground">Type</p>
                    </div>
                  </div>
                  {property.yearBuilt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold">{property.yearBuilt}</p>
                        <p className="text-xs text-muted-foreground">Built</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed" data-testid="text-property-description">
                    {property.description}
                  </p>
                </CardContent>
              </Card>

              {amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3" data-testid="property-amenities">
                      {amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {features.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3" data-testid="property-features">
                      {features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {agent && (
                <Card className="shadow-lg" data-testid="agent-card">
                  <CardHeader className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4 ring-4 ring-gold/20">
                      <AvatarImage src={agent.user?.avatarUrl || ''} />
                      <AvatarFallback className="bg-primary text-white text-xl">
                        {agent.user?.fullName?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle>{agent.user?.fullName}</CardTitle>
                    <p className="text-muted-foreground text-sm">{agent.specialization}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {agent.user?.phone && (
                      <a
                        href={`tel:${agent.user.phone}`}
                        className="flex items-center gap-3 p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <Phone className="h-5 w-5 text-primary" />
                        <span>{agent.user.phone}</span>
                      </a>
                    )}
                    {agent.user?.email && (
                      <a
                        href={`mailto:${agent.user.email}`}
                        className="flex items-center gap-3 p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="truncate">{agent.user.email}</span>
                      </a>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-lg" data-testid="inquiry-form">
                <CardHeader>
                  <CardTitle>Schedule a Viewing</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <Input
                      placeholder="Your Name"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      required
                      data-testid="input-inquiry-name"
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      required
                      data-testid="input-inquiry-email"
                    />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      data-testid="input-inquiry-phone"
                    />
                    <Textarea
                      placeholder="I'm interested in this property..."
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      rows={4}
                      required
                      data-testid="input-inquiry-message"
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gold hover:bg-gold/90"
                      disabled={inquiryMutation.isPending}
                      data-testid="button-submit-inquiry"
                    >
                      {inquiryMutation.isPending ? 'Sending...' : 'Send Inquiry'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {similarProperties && similarProperties.length > 0 && (
            <section className="mt-16" data-testid="similar-properties">
              <h2 className="text-2xl font-bold text-foreground mb-8">Similar Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarProperties.slice(0, 3).map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black">
          <div className="relative">
            <img
              src={currentImage}
              alt={property.title}
              className="w-full h-auto max-h-[90vh] object-contain"
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => setCurrentImageIndex((i) => (i + 1) % images.length)}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
