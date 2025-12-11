import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Calendar, User, Tag, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery<BlogPostWithAuthor>({
    queryKey: ['/api/blog', slug],
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="aspect-[16/9] w-full rounded-lg mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button>Browse Articles</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tags = (post.tags as string[]) || [];

  return (
    <div className="min-h-screen bg-background" data-testid="page-blog-post">
      <Navbar />

      <main className="pt-24 pb-16">
        <article className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <header className="mb-8">
            <Badge className="bg-gold text-white border-0 mb-4">{post.category}</Badge>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-post-title">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              {post.author && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatarUrl || ''} />
                    <AvatarFallback className="bg-primary text-white text-xs">
                      {post.author.fullName?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{post.author.fullName}</span>
                </div>
              )}
            </div>
          </header>

          {post.featuredImage && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-8">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover"
                data-testid="img-featured"
              />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
            data-testid="content-post"
          />

          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8 pt-8 border-t">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-8 border-t">
            <span className="text-muted-foreground">Share this article:</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                data-testid="button-share-facebook"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                data-testid="button-share-twitter"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                data-testid="button-share-linkedin"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
