import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { BlogPost, User as UserType } from '@shared/schema';

type BlogPostWithAuthor = BlogPost & { author?: UserType };

const categories = [
  { value: 'all', label: 'All Posts' },
  { value: 'market-trends', label: 'Market Trends' },
  { value: 'buying-tips', label: 'Buying Tips' },
  { value: 'selling-guide', label: 'Selling Guide' },
  { value: 'investment', label: 'Investment' },
  { value: 'lifestyle', label: 'Lifestyle' },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: posts, isLoading } = useQuery<BlogPostWithAuthor[]>({
    queryKey: ['/api/blog'],
  });

  const filteredPosts = posts?.filter((post) => {
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === 'all' ||
      post.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="page-blog">
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
                <BreadcrumbPage>Blog</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="text-center mb-12">
            <span className="text-gold text-sm font-semibold uppercase tracking-wider mb-2 block">
              Insights & News
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-page-title">
              Real Estate Blog
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed with the latest market trends, buying tips, and expert insights from our team.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-blog"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                  data-testid={`button-category-${cat.value}`}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group overflow-visible rounded-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  data-testid={`card-blog-${post.id}`}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <a>
                      <div className="relative aspect-[16/10] overflow-hidden rounded-t-md">
                        <img
                          src={post.featuredImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80'}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-gold text-white border-0">{post.category}</Badge>
                        </div>
                      </div>
                    </a>
                  </Link>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                      {post.author && (
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author.fullName}
                        </span>
                      )}
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <a>
                        <h2 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                      </a>
                    </Link>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    {post.tags && (post.tags as string[]).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(post.tags as string[]).slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Link href={`/blog/${post.slug}`}>
                      <a className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground text-lg">
                {searchQuery || selectedCategory !== 'all'
                  ? 'No articles found matching your criteria.'
                  : 'No blog posts available yet.'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
