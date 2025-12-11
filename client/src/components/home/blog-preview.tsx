import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { BlogPost, User as UserType } from '@shared/schema';

type BlogPostWithAuthor = BlogPost & { author?: UserType };

export function BlogPreview() {
  const { data: posts, isLoading } = useQuery<BlogPostWithAuthor[]>({
    queryKey: ['/api/blog', 'preview'],
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section className="py-20 lg:py-28 bg-background" data-testid="section-blog-preview">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-gold text-sm font-semibold uppercase tracking-wider mb-2 block">
              Insights & News
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground" data-testid="text-blog-title">
              Latest From Our Blog
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Stay informed with market trends, property tips, and expert insights from our team.
            </p>
          </div>
          <Link href="/blog">
            <Button variant="outline" className="border-primary text-primary" data-testid="button-view-all-blog">
              View All Articles
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post) => (
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
                      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </a>
                  </Link>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
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
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No blog posts available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
