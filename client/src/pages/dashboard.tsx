import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Heart, Eye, MessageSquare, User, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { PropertyCard } from '@/components/property/property-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import type { Property, Inquiry } from '@shared/schema';

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: favorites, isLoading: favoritesLoading } = useQuery<Property[]>({
    queryKey: ['/api/users', user?.id, 'favorites'],
    enabled: !!user,
  });

  const { data: recentlyViewed, isLoading: viewedLoading } = useQuery<Property[]>({
    queryKey: ['/api/users', user?.id, 'recently-viewed'],
    enabled: !!user,
  });

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<Inquiry[]>({
    queryKey: ['/api/users', user?.id, 'inquiries'],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p className="text-muted-foreground mb-8">You need to be signed in to view your dashboard.</p>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="page-dashboard">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-4 ring-gold/20">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="bg-primary text-white text-xl">
                  {user.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground" data-testid="text-welcome">
                  Welcome back, {user.fullName?.split(' ')[0]}!
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Link href="/dashboard/profile">
              <Button variant="outline">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card data-testid="stat-favorites">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{favorites?.length || 0}</p>
                  <p className="text-muted-foreground text-sm">Saved Properties</p>
                </div>
              </CardContent>
            </Card>
            <Card data-testid="stat-viewed">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{recentlyViewed?.length || 0}</p>
                  <p className="text-muted-foreground text-sm">Recently Viewed</p>
                </div>
              </CardContent>
            </Card>
            <Card data-testid="stat-inquiries">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inquiries?.length || 0}</p>
                  <p className="text-muted-foreground text-sm">Inquiries Sent</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="favorites" className="space-y-6">
            <TabsList>
              <TabsTrigger value="favorites" data-testid="tab-favorites">
                Saved Properties
              </TabsTrigger>
              <TabsTrigger value="viewed" data-testid="tab-viewed">
                Recently Viewed
              </TabsTrigger>
              <TabsTrigger value="inquiries" data-testid="tab-inquiries">
                Inquiries
              </TabsTrigger>
            </TabsList>

            <TabsContent value="favorites">
              {favoritesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
                  ))}
                </div>
              ) : favorites && favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((property) => (
                    <PropertyCard key={property.id} property={property} isFavorite />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-lg">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't saved any properties yet.</p>
                  <Link href="/properties">
                    <Button>Browse Properties</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="viewed">
              {viewedLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
                  ))}
                </div>
              ) : recentlyViewed && recentlyViewed.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentlyViewed.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-lg">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No recently viewed properties.</p>
                  <Link href="/properties">
                    <Button>Browse Properties</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="inquiries">
              {inquiriesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-lg" />
                  ))}
                </div>
              ) : inquiries && inquiries.length > 0 ? (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <Card key={inquiry.id} data-testid={`card-inquiry-${inquiry.id}`}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <p className="font-medium line-clamp-1">{inquiry.message}</p>
                          <p className="text-sm text-muted-foreground">
                            Sent on {new Date(inquiry.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge
                            variant={inquiry.status === 'pending' ? 'secondary' : 'default'}
                            className={inquiry.status === 'responded' ? 'bg-green-500' : ''}
                          >
                            {inquiry.status}
                          </Badge>
                          <Link href={`/properties/${inquiry.propertyId}`}>
                            <Button variant="ghost" size="icon">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-lg">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't sent any inquiries yet.</p>
                  <Link href="/properties">
                    <Button>Browse Properties</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
