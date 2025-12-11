import { 
  type User, type InsertUser, 
  type Agent, type InsertAgent,
  type Property, type InsertProperty, type PropertyWithAgent,
  type Inquiry, type InsertInquiry,
  type Favorite, type InsertFavorite,
  type BlogPost, type InsertBlogPost,
  type ContactMessage, type InsertContactMessage,
  type AgentWithUser
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser & { id: string }): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;

  // Agents
  getAgents(): Promise<AgentWithUser[]>;
  getAgent(id: string): Promise<AgentWithUser | undefined>;
  createAgent(agent: InsertAgent & { id: string }): Promise<Agent>;
  
  // Properties
  getProperties(filters?: PropertyFilters): Promise<{ properties: Property[]; total: number }>;
  getFeaturedProperties(): Promise<Property[]>;
  getProperty(id: string): Promise<PropertyWithAgent | undefined>;
  getSimilarProperties(propertyId: string): Promise<Property[]>;
  createProperty(property: InsertProperty & { id: string }): Promise<Property>;
  updateProperty(id: string, data: Partial<Property>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;
  getAgentProperties(agentId: string): Promise<Property[]>;
  
  // Favorites
  getUserFavorites(userId: string): Promise<Property[]>;
  addFavorite(favorite: InsertFavorite & { id: string }): Promise<Favorite>;
  removeFavorite(userId: string, propertyId: string): Promise<boolean>;
  
  // Inquiries
  createInquiry(inquiry: InsertInquiry & { id: string }): Promise<Inquiry>;
  getUserInquiries(userId: string): Promise<Inquiry[]>;
  getAgentInquiries(agentId: string): Promise<Inquiry[]>;
  updateInquiryStatus(id: string, status: string): Promise<Inquiry | undefined>;
  
  // Blog
  getBlogPosts(filters?: { category?: string }): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost & { id: string }): Promise<BlogPost>;
  
  // Contact
  createContactMessage(message: InsertContactMessage & { id: string }): Promise<ContactMessage>;
}

export interface PropertyFilters {
  location?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: string;
  bathrooms?: string;
  amenities?: string[];
  sort?: string;
  page?: number;
  limit?: number;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private agents: Map<string, Agent>;
  private properties: Map<string, Property>;
  private favorites: Map<string, Favorite>;
  private inquiries: Map<string, Inquiry>;
  private blogPosts: Map<string, BlogPost>;
  private contactMessages: Map<string, ContactMessage>;

  constructor() {
    this.users = new Map();
    this.agents = new Map();
    this.properties = new Map();
    this.favorites = new Map();
    this.inquiries = new Map();
    this.blogPosts = new Map();
    this.contactMessages = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed users
    const users: (InsertUser & { id: string })[] = [
      { id: 'user-1', email: 'john@luxeestates.com', fullName: 'John Anderson', phone: '+1 234 567 8901', role: 'agent' },
      { id: 'user-2', email: 'sarah@luxeestates.com', fullName: 'Sarah Mitchell', phone: '+1 234 567 8902', role: 'agent' },
      { id: 'user-3', email: 'michael@luxeestates.com', fullName: 'Michael Chen', phone: '+1 234 567 8903', role: 'agent' },
      { id: 'user-4', email: 'emily@luxeestates.com', fullName: 'Emily Rodriguez', phone: '+1 234 567 8904', role: 'agent' },
      { id: 'user-5', email: 'admin@luxeestates.com', fullName: 'Admin User', role: 'admin' },
    ];
    users.forEach(u => this.users.set(u.id, { ...u, createdAt: new Date() }));

    // Seed agents
    const agents: (InsertAgent & { id: string })[] = [
      { id: 'agent-1', userId: 'user-1', bio: 'Specializing in luxury penthouses and high-rise properties with over 15 years of experience in Manhattan real estate.', specialization: 'Luxury Penthouses', yearsExperience: 15, location: 'Manhattan', propertiesCount: 24, rating: '4.9', isActive: true },
      { id: 'agent-2', userId: 'user-2', bio: 'Expert in waterfront properties and vacation homes. Passionate about helping families find their dream homes.', specialization: 'Waterfront Homes', yearsExperience: 12, location: 'Brooklyn', propertiesCount: 18, rating: '4.8', isActive: true },
      { id: 'agent-3', userId: 'user-3', bio: 'Commercial and investment property specialist with a background in finance and real estate development.', specialization: 'Investment Properties', yearsExperience: 10, location: 'Queens', propertiesCount: 32, rating: '4.7', isActive: true },
      { id: 'agent-4', userId: 'user-4', bio: 'First-time buyer specialist who makes the home buying process simple and stress-free.', specialization: 'First-time Buyers', yearsExperience: 8, location: 'Manhattan', propertiesCount: 15, rating: '5.0', isActive: true },
    ];
    agents.forEach(a => this.agents.set(a.id, a as Agent));

    // Seed properties
    const properties: (InsertProperty & { id: string })[] = [
      {
        id: 'prop-1',
        title: 'Luxurious Penthouse with Panoramic City Views',
        description: 'Experience the pinnacle of urban luxury in this breathtaking penthouse offering 360-degree views of the Manhattan skyline. Features include a private rooftop terrace, chef\'s kitchen with premium appliances, floor-to-ceiling windows, and smart home automation throughout.',
        price: 4500000,
        propertyType: 'penthouse',
        status: 'available',
        location: 'Upper East Side',
        address: '432 Park Avenue, PH-A',
        city: 'New York',
        state: 'NY',
        zipCode: '10022',
        area: 4500,
        bedrooms: 4,
        bathrooms: 5,
        floorNumber: 85,
        yearBuilt: 2020,
        amenities: ['Swimming Pool', 'Gym', 'Concierge', 'Parking', 'Smart Home', 'Terrace', 'Security'],
        features: ['Floor-to-ceiling windows', 'Private elevator', 'Wine cellar', 'Home theater'],
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
        ],
        agentId: 'agent-1',
        isFeatured: true,
      },
      {
        id: 'prop-2',
        title: 'Modern Waterfront Villa with Private Dock',
        description: 'Stunning contemporary villa set on the waterfront with a private dock. This architectural masterpiece features an open floor plan, infinity pool overlooking the water, and state-of-the-art amenities.',
        price: 3200000,
        propertyType: 'villa',
        status: 'available',
        location: 'Brooklyn Heights',
        address: '15 Columbia Heights',
        city: 'New York',
        state: 'NY',
        zipCode: '11201',
        area: 5200,
        bedrooms: 5,
        bathrooms: 6,
        yearBuilt: 2019,
        amenities: ['Swimming Pool', 'Garden', 'Parking', 'Security', 'Smart Home', 'Pet Friendly'],
        features: ['Private dock', 'Infinity pool', 'Home office', 'Guest house'],
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
          'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80',
        ],
        agentId: 'agent-2',
        isFeatured: true,
      },
      {
        id: 'prop-3',
        title: 'Elegant Brownstone in Historic District',
        description: 'Beautifully restored brownstone townhouse in a prestigious historic neighborhood. Original architectural details blend seamlessly with modern updates including a gourmet kitchen and spa-like bathrooms.',
        price: 2800000,
        propertyType: 'townhouse',
        status: 'available',
        location: 'Park Slope',
        address: '342 President Street',
        city: 'New York',
        state: 'NY',
        zipCode: '11215',
        area: 3800,
        bedrooms: 4,
        bathrooms: 3,
        yearBuilt: 1890,
        amenities: ['Garden', 'Parking', 'Furnished'],
        features: ['Original moldings', 'Fireplace', 'Private garden', 'Chef\'s kitchen'],
        images: [
          'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=80',
          'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&q=80',
        ],
        agentId: 'agent-4',
        isFeatured: true,
      },
      {
        id: 'prop-4',
        title: 'Contemporary Loft in SoHo',
        description: 'Stunning sun-drenched loft in the heart of SoHo featuring 14-foot ceilings, exposed brick, and oversized windows. The open layout is perfect for entertaining.',
        price: 1950000,
        propertyType: 'apartment',
        status: 'available',
        location: 'SoHo',
        address: '101 Wooster Street, 4F',
        city: 'New York',
        state: 'NY',
        zipCode: '10012',
        area: 2200,
        bedrooms: 2,
        bathrooms: 2,
        floorNumber: 4,
        yearBuilt: 2015,
        amenities: ['Gym', 'Elevator', 'Concierge'],
        features: ['Exposed brick', 'High ceilings', 'Cast-iron columns', 'Custom closets'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
        ],
        agentId: 'agent-3',
        isFeatured: true,
      },
      {
        id: 'prop-5',
        title: 'Sleek High-Rise Apartment with City Views',
        description: 'Modern high-rise apartment with stunning city views from every room. Features include a gourmet kitchen, marble bathrooms, and access to world-class amenities.',
        price: 1450000,
        propertyType: 'apartment',
        status: 'available',
        location: 'Midtown',
        address: '157 West 57th Street, 42B',
        city: 'New York',
        state: 'NY',
        zipCode: '10019',
        area: 1800,
        bedrooms: 2,
        bathrooms: 2,
        floorNumber: 42,
        yearBuilt: 2018,
        amenities: ['Swimming Pool', 'Gym', 'Concierge', 'Security', 'Parking'],
        features: ['City views', 'Marble bathrooms', 'Custom cabinetry'],
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
        ],
        agentId: 'agent-1',
        isFeatured: false,
      },
      {
        id: 'prop-6',
        title: 'Charming Garden Apartment in Greenwich Village',
        description: 'Rare garden apartment in a prime Greenwich Village location. Private outdoor space, wood-burning fireplace, and classic pre-war details.',
        price: 1250000,
        propertyType: 'apartment',
        status: 'available',
        location: 'Greenwich Village',
        address: '45 Jane Street, 1A',
        city: 'New York',
        state: 'NY',
        zipCode: '10014',
        area: 1400,
        bedrooms: 1,
        bathrooms: 1,
        floorNumber: 1,
        yearBuilt: 1925,
        amenities: ['Garden', 'Pet Friendly'],
        features: ['Private garden', 'Fireplace', 'Pre-war details'],
        images: [
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
        ],
        agentId: 'agent-4',
        isFeatured: false,
      },
    ];
    properties.forEach(p => this.properties.set(p.id, { ...p, viewCount: Math.floor(Math.random() * 500), createdAt: new Date(), updatedAt: new Date() } as Property));

    // Seed blog posts
    const blogPosts: (InsertBlogPost & { id: string })[] = [
      {
        id: 'blog-1',
        title: 'Top 10 Luxury Real Estate Trends for 2024',
        slug: 'luxury-real-estate-trends-2024',
        excerpt: 'Discover the latest trends shaping the luxury real estate market this year, from smart home technology to sustainable design.',
        content: '<p>The luxury real estate market continues to evolve with exciting new trends...</p><h2>1. Smart Home Integration</h2><p>Modern luxury buyers expect seamless smart home technology...</p>',
        featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        category: 'Market Trends',
        tags: ['luxury', 'trends', '2024', 'smart home'],
        authorId: 'user-1',
        isPublished: true,
        publishedAt: new Date('2024-01-15'),
      },
      {
        id: 'blog-2',
        title: 'First-Time Home Buyer\'s Guide to NYC',
        slug: 'first-time-buyer-guide-nyc',
        excerpt: 'Everything you need to know about purchasing your first home in New York City, from financing to closing.',
        content: '<p>Buying your first home in NYC can feel overwhelming...</p>',
        featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
        category: 'Buying Tips',
        tags: ['first-time buyer', 'NYC', 'guide'],
        authorId: 'user-4',
        isPublished: true,
        publishedAt: new Date('2024-02-01'),
      },
      {
        id: 'blog-3',
        title: 'Investment Properties: Maximizing Your Returns',
        slug: 'investment-properties-maximizing-returns',
        excerpt: 'Expert strategies for identifying and managing profitable investment properties in today\'s market.',
        content: '<p>Real estate investment remains one of the most reliable paths to wealth building...</p>',
        featuredImage: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80',
        category: 'Investment',
        tags: ['investment', 'ROI', 'passive income'],
        authorId: 'user-3',
        isPublished: true,
        publishedAt: new Date('2024-02-15'),
      },
    ];
    blogPosts.forEach(p => this.blogPosts.set(p.id, { ...p, createdAt: new Date() } as BlogPost));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async createUser(user: InsertUser & { id: string }): Promise<User> {
    const newUser: User = { ...user, createdAt: new Date() };
    this.users.set(user.id, newUser);
    return newUser;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  // Agents
  async getAgents(): Promise<AgentWithUser[]> {
    return Array.from(this.agents.values()).map(agent => ({
      ...agent,
      user: this.users.get(agent.userId || ''),
    }));
  }

  async getAgent(id: string): Promise<AgentWithUser | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;
    return { ...agent, user: this.users.get(agent.userId || '') };
  }

  async createAgent(agent: InsertAgent & { id: string }): Promise<Agent> {
    this.agents.set(agent.id, agent as Agent);
    return agent as Agent;
  }

  // Properties
  async getProperties(filters?: PropertyFilters): Promise<{ properties: Property[]; total: number }> {
    let results = Array.from(this.properties.values());

    if (filters) {
      if (filters.location) {
        results = results.filter(p => 
          p.location.toLowerCase().includes(filters.location!.toLowerCase()) ||
          p.city.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      if (filters.type && filters.type !== 'any') {
        results = results.filter(p => p.propertyType === filters.type);
      }
      if (filters.minPrice) {
        results = results.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        results = results.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.minArea) {
        results = results.filter(p => p.area >= filters.minArea!);
      }
      if (filters.maxArea) {
        results = results.filter(p => p.area <= filters.maxArea!);
      }
      if (filters.bedrooms) {
        const beds = parseInt(filters.bedrooms);
        results = results.filter(p => filters.bedrooms?.includes('+') ? p.bedrooms >= beds : p.bedrooms === beds);
      }
      if (filters.bathrooms) {
        const baths = parseInt(filters.bathrooms);
        results = results.filter(p => filters.bathrooms?.includes('+') ? p.bathrooms >= baths : p.bathrooms === baths);
      }

      // Sort
      switch (filters.sort) {
        case 'price-low':
          results.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          results.sort((a, b) => b.price - a.price);
          break;
        case 'popular':
          results.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
          break;
        default:
          results.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
      }
    }

    const total = results.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 9;
    const start = (page - 1) * limit;
    const paged = results.slice(start, start + limit);

    return { properties: paged, total };
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => p.isFeatured);
  }

  async getProperty(id: string): Promise<PropertyWithAgent | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const agent = property.agentId ? this.agents.get(property.agentId) : undefined;
    const agentUser = agent?.userId ? this.users.get(agent.userId) : undefined;

    return {
      ...property,
      agent: agent ? { ...agent, user: agentUser } : undefined,
    };
  }

  async getSimilarProperties(propertyId: string): Promise<Property[]> {
    const property = this.properties.get(propertyId);
    if (!property) return [];
    
    return Array.from(this.properties.values())
      .filter(p => p.id !== propertyId && (p.propertyType === property.propertyType || p.city === property.city))
      .slice(0, 3);
  }

  async createProperty(property: InsertProperty & { id: string }): Promise<Property> {
    const newProperty: Property = {
      ...property,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.properties.set(property.id, newProperty);
    return newProperty;
  }

  async updateProperty(id: string, data: Partial<Property>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    const updated = { ...property, ...data, updatedAt: new Date() };
    this.properties.set(id, updated);
    return updated;
  }

  async deleteProperty(id: string): Promise<boolean> {
    return this.properties.delete(id);
  }

  async getAgentProperties(agentId: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => p.agentId === agentId);
  }

  // Favorites
  async getUserFavorites(userId: string): Promise<Property[]> {
    const favPropertyIds = Array.from(this.favorites.values())
      .filter(f => f.userId === userId)
      .map(f => f.propertyId);
    return Array.from(this.properties.values()).filter(p => favPropertyIds.includes(p.id));
  }

  async addFavorite(favorite: InsertFavorite & { id: string }): Promise<Favorite> {
    const newFav: Favorite = { ...favorite, createdAt: new Date() };
    this.favorites.set(favorite.id, newFav);
    return newFav;
  }

  async removeFavorite(userId: string, propertyId: string): Promise<boolean> {
    const fav = Array.from(this.favorites.entries()).find(
      ([_, f]) => f.userId === userId && f.propertyId === propertyId
    );
    if (fav) {
      return this.favorites.delete(fav[0]);
    }
    return false;
  }

  // Inquiries
  async createInquiry(inquiry: InsertInquiry & { id: string }): Promise<Inquiry> {
    const newInquiry: Inquiry = { ...inquiry, status: 'pending', createdAt: new Date() };
    this.inquiries.set(inquiry.id, newInquiry);
    return newInquiry;
  }

  async getUserInquiries(userId: string): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).filter(i => i.userId === userId);
  }

  async getAgentInquiries(agentId: string): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values()).filter(i => i.agentId === agentId);
  }

  async updateInquiryStatus(id: string, status: string): Promise<Inquiry | undefined> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) return undefined;
    const updated = { ...inquiry, status };
    this.inquiries.set(id, updated);
    return updated;
  }

  // Blog
  async getBlogPosts(filters?: { category?: string }): Promise<BlogPost[]> {
    let results = Array.from(this.blogPosts.values()).filter(p => p.isPublished);
    
    if (filters?.category && filters.category !== 'all') {
      results = results.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === filters.category);
    }

    return results.map(post => ({
      ...post,
      author: this.users.get(post.authorId || ''),
    })) as BlogPost[];
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const post = Array.from(this.blogPosts.values()).find(p => p.slug === slug);
    if (!post) return undefined;
    return { ...post, author: this.users.get(post.authorId || '') } as BlogPost;
  }

  async createBlogPost(post: InsertBlogPost & { id: string }): Promise<BlogPost> {
    const newPost: BlogPost = { ...post, createdAt: new Date() };
    this.blogPosts.set(post.id, newPost);
    return newPost;
  }

  // Contact
  async createContactMessage(message: InsertContactMessage & { id: string }): Promise<ContactMessage> {
    const newMessage: ContactMessage = { ...message, status: 'unread', createdAt: new Date() };
    this.contactMessages.set(message.id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
