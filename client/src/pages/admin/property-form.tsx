import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useLocation, Link } from 'wouter';
import { ArrowLeft, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { uploadImage } from '@/lib/supabase';
import type { Property } from '@shared/schema';

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'condo', label: 'Condo' },
  { value: 'house', label: 'House' },
];

const amenitiesList = [
  'Swimming Pool', 'Gym', 'Parking', 'Garden', 'Security', 'Elevator',
  'Balcony', 'Terrace', 'Smart Home', 'Concierge', 'Pet Friendly', 'Furnished',
];

export default function PropertyFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    propertyType: '',
    status: 'available',
    location: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    floorNumber: '',
    yearBuilt: '',
    amenities: [] as string[],
    features: [] as string[],
    images: [] as string[],
    isFeatured: false,
  });

  const { isLoading: loadingProperty } = useQuery<Property>({
    queryKey: ['/api/properties', id],
    enabled: isEdit,
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        price: parseInt(data.price),
        area: parseInt(data.area),
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
        floorNumber: data.floorNumber ? parseInt(data.floorNumber) : null,
        yearBuilt: data.yearBuilt ? parseInt(data.yearBuilt) : null,
      };

      if (isEdit) {
        return apiRequest('PATCH', `/api/properties/${id}`, payload);
      }
      return apiRequest('POST', '/api/properties', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/properties'] });
      toast({
        title: isEdit ? 'Property Updated' : 'Property Created',
        description: isEdit ? 'Your changes have been saved.' : 'Your property has been listed.',
      });
      setLocation('/admin');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: `Failed to ${isEdit ? 'update' : 'create'} property.`,
        variant: 'destructive',
      });
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      await handleImageUpload(files);
    }
  }, []);

  const handleImageUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      const uploadPromises = files.map((file) => uploadImage(file));
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url): url is string => url !== null);
      
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validUrls],
      }));
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload images. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await handleImageUpload(files);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (!user || (user.role !== 'agent' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <p className="text-muted-foreground">Access denied</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="page-property-form">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="mb-8">
            <Link href="/admin">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">
              {isEdit ? 'Edit Property' : 'Add New Property'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? 'Update your property listing' : 'Create a new property listing'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Luxury Penthouse with Ocean View"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    data-testid="input-title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={5}
                    required
                    data-testid="input-description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                    >
                      <SelectTrigger data-testid="select-property-type">
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
                    <Label htmlFor="price">Price (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g., 500000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      data-testid="input-price"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Neighborhood/Area *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Upper East Side"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      data-testid="input-location"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="e.g., New York"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      data-testid="input-city"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    placeholder="e.g., 123 Park Avenue, Apt 4A"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    data-testid="input-address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="e.g., NY"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      data-testid="input-state"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="e.g., 10021"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      data-testid="input-zipcode"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Area (sq ft) *</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="e.g., 2500"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                      data-testid="input-area"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms *</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      placeholder="e.g., 3"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      required
                      data-testid="input-bedrooms"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      placeholder="e.g., 2"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      required
                      data-testid="input-bathrooms"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearBuilt">Year Built</Label>
                    <Input
                      id="yearBuilt"
                      type="number"
                      placeholder="e.g., 2020"
                      value={formData.yearBuilt}
                      onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                      data-testid="input-year-built"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                        data-testid={`checkbox-${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <label htmlFor={amenity} className="text-sm cursor-pointer">
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  data-testid="dropzone-images"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-10 w-10 text-primary animate-spin" />
                      <p className="text-muted-foreground">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">
                        Drag and drop images here, or click to browse
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        data-testid="button-upload-images"
                      >
                        Select Images
                      </Button>
                    </>
                  )}
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Property image ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-remove-image-${index}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isFeatured: checked as boolean })
                    }
                    data-testid="checkbox-featured"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-medium cursor-pointer">
                    Mark as Featured Property
                  </label>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Link href="/admin">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-primary"
                disabled={mutation.isPending}
                data-testid="button-submit"
              >
                {mutation.isPending
                  ? isEdit
                    ? 'Saving...'
                    : 'Creating...'
                  : isEdit
                  ? 'Save Changes'
                  : 'Create Property'}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
