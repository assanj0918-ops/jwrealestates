import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { 
  Home, 
  Briefcase, 
  Users, 
  Heart,
  Award,
  Shield,
  TrendingUp,
  CheckCircle,
  Building,
  Plane,
  GraduationCap,
  Star,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Integrity',
      description: 'Built on trust and transparency in every transaction'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering exceptional results and service'
    },
    {
      icon: Heart,
      title: 'Community',
      description: 'Dedicated to giving back and mentoring the next generation'
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Embracing modern strategies in house flipping and real estate'
    }
  ];

  const expertise = [
    {
      icon: Home,
      title: 'House Flipping',
      description: 'Transforming distressed properties into beautiful homes with expert renovation and design',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop'
    },
    {
      icon: Briefcase,
      title: 'Real Estate Brokerage',
      description: 'Full-service brokerage helping clients buy, sell, and invest in residential and commercial properties',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'
    },
    {
      icon: Building,
      title: 'Furnished Finder Hosting',
      description: 'Providing quality furnished accommodations for travelers and temporary residents',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
    },
    {
      icon: GraduationCap,
      title: 'Youth Mentorship',
      description: 'Empowering young people through education, guidance, and real-world experience',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop'
    }
  ];

  const achievements = [
    { number: '50+', label: 'Properties Transformed' },
    { number: '100+', label: 'Successful Transactions' },
    { number: '15+', label: 'Years of Experience' },
    { number: '500+', label: 'Happy Clients' }
  ];

  const gallery = [
    'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="page-about">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-gold/5 py-20 lg:py-28 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <Breadcrumb className="mb-8">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>About Us</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <span className="text-gold text-sm font-semibold uppercase tracking-wider mb-4 block flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  About Joshua Walden
                </span>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight" data-testid="text-page-title">
                  Transforming Properties, Building Communities
                </h1>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  From house flipper to real estate broker, I bring a unique perspective to every project. 
                  With a background in the US Air Force Reserve and a passion for youth mentorship, 
                  I believe in building more than just properties—I build lasting relationships and stronger communities.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Whether you're looking to buy your dream home, sell a property, or invest in real estate, 
                  I'm here to guide you every step of the way with integrity, expertise, and dedication.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/properties">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all shadow-lg">
                      View Properties
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="hover:bg-primary/5 transform hover:scale-105 transition-all">
                      Get in Touch
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative animate-fade-in-up">
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gold/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse delay-500"></div>
                
                <div className="relative bg-card border-2 border-border rounded-2xl p-8 shadow-2xl backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-500">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-gold/20 rounded-full blur-xl"></div>
                    <img 
                      src="https://i.ibb.co/skXt93y/Screenshot-2025-12-24-104319.png" 
                      alt="Joshua Walden"
                      className="relative w-40 h-40 rounded-full mx-auto border-4 border-background shadow-xl object-cover"
                    />
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gold rounded-full flex items-center justify-center border-4 border-background shadow-lg">
                      <Star className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">Joshua Walden</h3>
                    <p className="text-gold font-semibold mb-4">Real Estate Broker & House Flipper</p>
                    <div className="flex flex-wrap gap-2 justify-center text-sm">
                      <span className="px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20 hover:bg-primary/20 transition-colors">
                        🏚️ House Flipper
                      </span>
                      <span className="px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20 hover:bg-primary/20 transition-colors">
                        🏘️ Broker
                      </span>
                      <span className="px-4 py-2 bg-gold/10 text-gold rounded-full border border-gold/20 hover:bg-gold/20 transition-colors">
                        🧳 Host
                      </span>
                      <span className="px-4 py-2 bg-gold/10 text-gold rounded-full border border-gold/20 hover:bg-gold/20 transition-colors">
                        👨🏾‍🏫 Mentor
                      </span>
                      <span className="px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20 hover:bg-primary/20 transition-colors">
                        👨🏾‍✈️ USAFR
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-16 border-y bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className="text-center group transform hover:scale-110 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                    {achievement.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold text-sm font-semibold uppercase tracking-wider mb-2 block flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                What I Do
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Areas of Expertise
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A multifaceted approach to real estate, combining hands-on experience with professional service
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {expertise.map((item, index) => (
                <div 
                  key={index} 
                  className="group bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-muted/30 via-muted/50 to-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <span className="text-gold text-sm font-semibold uppercase tracking-wider mb-2 block flex items-center justify-center gap-2">
                <Star className="w-4 h-4" />
                Core Values
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                What Drives Us
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our principles guide every decision and every interaction with our clients
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="bg-background border border-border rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    <value.icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Gallery */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold text-sm font-semibold uppercase tracking-wider mb-2 block flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Our Work
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Transformed Properties
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A glimpse into some of the beautiful properties we've worked on
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {gallery.map((image, index) => (
                <div 
                  key={index}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
                >
                  <img 
                    src={image} 
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Military & Service Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-primary/5 to-gold/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-gold text-sm font-semibold uppercase tracking-wider mb-4 block flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Service & Commitment
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Proud to Serve
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  As a member of the United States Air Force Reserve, I bring military discipline, 
                  attention to detail, and a commitment to excellence to everything I do. These values 
                  translate directly into how I serve my clients and community.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                      <CheckCircle className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Leadership Excellence</p>
                      <p className="text-sm text-muted-foreground">Military training brings unmatched discipline to real estate</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                      <CheckCircle className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Youth Mentorship</p>
                      <p className="text-sm text-muted-foreground">Empowering the next generation through education and guidance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                      <CheckCircle className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Community Impact</p>
                      <p className="text-sm text-muted-foreground">Dedicated to building stronger, more vibrant neighborhoods</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center hover:scale-105 transition-transform duration-300 group">
                    <Plane className="w-16 h-16 text-primary group-hover:rotate-12 transition-transform" />
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=400&fit=crop"
                      alt="Community"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-square rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=400&fit=crop"
                      alt="Mentorship"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/20 flex items-center justify-center hover:scale-105 transition-transform duration-300 group">
                    <Heart className="w-16 h-16 text-gold group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary via-primary/90 to-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
          </div>
          
          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <Sparkles className="w-12 h-12 text-white mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to Start Your Real Estate Journey?
              </h2>
              <p className="text-white/90 text-lg mb-8">
                Whether you're buying, selling, or investing, I'm here to help you achieve your goals with expertise and integrity.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 transform hover:scale-105 transition-all shadow-xl">
                    Contact Me Today
                  </Button>
                </Link>
                <Link href="/properties">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 transform hover:scale-105 transition-all">
                    Browse Properties
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}