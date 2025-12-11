import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import {
  Building2, Plus, Edit, Trash2, Eye, Star, StarOff,
  MessageSquare, Users, BarChart3, Search
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Property, Inquiry } from '@shared/schema';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: properties, isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ['/api/admin/properties'],
    enabled: !!user && (user.role === 'agent' || user.role === 'admin'),
  });

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<Inquiry[]>({
    queryKey: ['/api/admin/inquiries'],
    enabled: !!user && (user.role === 'agent' || user.role === 'admin'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      return apiRequest('DELETE', `/api/properties/${propertyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/properties'] });
      toast({ title: 'Property deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to delete property', variant: 'destructive' });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      return apiRequest('PATCH', `/api/properties/${id}`, { isFeatured });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/properties'] });
      toast({ title: 'Property updated successfully' });
    },
  });

  if (!user || (user.role !== 'agent' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-8">You don't have permission to access this page.</p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredProperties = properties?.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-admin">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
                {user.role === 'admin' ? 'Admin Dashboard' : 'Agent Dashboard'}
              </h1>
              <p className="text-muted-foreground">Manage your property listings and inquiries</p>
            </div>
            <Link href="/admin/properties/new">
              <Button className="bg-primary" data-testid="button-add-property">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{properties?.length || 0}</p>
                  <p className="text-muted-foreground text-sm">Total Listings</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center">
                  <Star className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {properties?.filter((p) => p.isFeatured).length || 0}
                  </p>
                  <p className="text-muted-foreground text-sm">Featured</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inquiries?.length || 0}</p>
                  <p className="text-muted-foreground text-sm">Inquiries</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {properties?.reduce((sum, p) => sum + (p.viewCount || 0), 0) || 0}
                  </p>
                  <p className="text-muted-foreground text-sm">Total Views</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="properties" className="space-y-6">
            <TabsList>
              <TabsTrigger value="properties" data-testid="tab-properties">
                <Building2 className="h-4 w-4 mr-2" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="inquiries" data-testid="tab-inquiries">
                <MessageSquare className="h-4 w-4 mr-2" />
                Inquiries
              </TabsTrigger>
            </TabsList>

            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <CardTitle>Property Listings</CardTitle>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search properties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        data-testid="input-search-properties"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {propertiesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : filteredProperties && filteredProperties.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Property</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProperties.map((property) => (
                            <TableRow key={property.id} data-testid={`row-property-${property.id}`}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <img
                                    src={(property.images as string[])?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&q=80'}
                                    alt={property.title}
                                    className="w-16 h-12 object-cover rounded"
                                  />
                                  <div>
                                    <p className="font-medium line-clamp-1">{property.title}</p>
                                    <p className="text-sm text-muted-foreground">{property.location}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{formatPrice(property.price)}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={property.status === 'available' ? 'default' : 'secondary'}
                                  className={property.status === 'available' ? 'bg-green-500' : ''}
                                >
                                  {property.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{property.viewCount || 0}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleFeaturedMutation.mutate({
                                    id: property.id,
                                    isFeatured: !property.isFeatured,
                                  })}
                                  data-testid={`button-toggle-featured-${property.id}`}
                                >
                                  {property.isFeatured ? (
                                    <Star className="h-4 w-4 text-gold fill-gold" />
                                  ) : (
                                    <StarOff className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </Button>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-end gap-2">
                                  <Link href={`/properties/${property.id}`}>
                                    <Button variant="ghost" size="icon" data-testid={`button-view-${property.id}`}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  <Link href={`/admin/properties/${property.id}/edit`}>
                                    <Button variant="ghost" size="icon" data-testid={`button-edit-${property.id}`}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" data-testid={`button-delete-${property.id}`}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Property</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{property.title}"? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => deleteMutation.mutate(property.id)}
                                          className="bg-destructive text-destructive-foreground"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No properties found.</p>
                      <Link href="/admin/properties/new">
                        <Button>Add Your First Property</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inquiries">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  {inquiriesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : inquiries && inquiries.length > 0 ? (
                    <div className="space-y-4">
                      {inquiries.map((inquiry) => (
                        <Card key={inquiry.id} data-testid={`card-inquiry-${inquiry.id}`}>
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="font-medium">{inquiry.name}</p>
                                  <Badge
                                    variant={inquiry.status === 'pending' ? 'secondary' : 'default'}
                                    className={inquiry.status === 'responded' ? 'bg-green-500' : ''}
                                  >
                                    {inquiry.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">{inquiry.email}</p>
                                <p className="text-sm line-clamp-2">{inquiry.message}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link href={`/properties/${inquiry.propertyId}`}>
                                  <Button variant="outline" size="sm">View Property</Button>
                                </Link>
                                <Button size="sm" asChild>
                                  <a href={`mailto:${inquiry.email}`}>Reply</a>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No inquiries yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
