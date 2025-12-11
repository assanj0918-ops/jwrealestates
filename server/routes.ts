import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { randomUUID } from "crypto";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Users
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Agents
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  app.get("/api/agents/:id", async (req, res) => {
    try {
      const agent = await storage.getAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agent" });
    }
  });

  // Featured properties - specific route before general properties route
  app.get("/api/properties/featured", async (req, res) => {
    try {
      const properties = await storage.getFeaturedProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured properties" });
    }
  });

  // Properties
  app.get("/api/properties", async (req, res) => {
    try {
      const filters = {
        location: req.query.location as string,
        type: req.query.type as string,
        minPrice: req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined,
        minArea: req.query.minArea ? parseInt(req.query.minArea as string) : undefined,
        maxArea: req.query.maxArea ? parseInt(req.query.maxArea as string) : undefined,
        bedrooms: req.query.bedrooms as string,
        bathrooms: req.query.bathrooms as string,
        sort: req.query.sort as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: 9,
      };

      const result = await storage.getProperties(filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      // Handle similar properties
      if (req.query['1'] === 'similar') {
        const propertyId = req.query['2'] as string;
        const similar = await storage.getSimilarProperties(propertyId);
        return res.json(similar);
      }

      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      // Increment view count
      await storage.updateProperty(req.params.id, {
        viewCount: (property.viewCount || 0) + 1,
      });

      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const property = await storage.createProperty({
        id: randomUUID(),
        ...req.body,
      });
      res.status(201).json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to create property" });
    }
  });

  app.patch("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.updateProperty(req.params.id, req.body);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to update property" });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const success = await storage.deleteProperty(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete property" });
    }
  });

  // Admin routes
  app.get("/api/admin/properties", async (req, res) => {
    try {
      const result = await storage.getProperties({ limit: 100 });
      res.json(result.properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/admin/inquiries", async (req, res) => {
    try {
      // In a real app, this would filter by the authenticated agent/admin
      const allInquiries = await storage.getAgentInquiries("agent-1");
      res.json(allInquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  // User favorites
  app.get("/api/users/:userId/favorites", async (req, res) => {
    try {
      const favorites = await storage.getUserFavorites(req.params.userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const favorite = await storage.addFavorite({
        id: randomUUID(),
        ...req.body,
      });
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites", async (req, res) => {
    try {
      const { userId, propertyId } = req.body;
      const success = await storage.removeFavorite(userId, propertyId);
      if (!success) {
        return res.status(404).json({ error: "Favorite not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  // User inquiries
  app.get("/api/users/:userId/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getUserInquiries(req.params.userId);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inquiries" });
    }
  });

  // Inquiries
  app.post("/api/inquiries", async (req, res) => {
    try {
      const inquiry = await storage.createInquiry({
        id: randomUUID(),
        ...req.body,
      });
      res.status(201).json(inquiry);
    } catch (error) {
      res.status(500).json({ error: "Failed to create inquiry" });
    }
  });

  // Blog
  app.get("/api/blog", async (req, res) => {
    try {
      const category = req.query.category as string;
      const posts = await storage.getBlogPosts({ category });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      // Handle preview request
      if (req.params.slug === 'preview') {
        const posts = await storage.getBlogPosts();
        return res.json(posts.slice(0, 3));
      }

      const post = await storage.getBlogPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Contact
  app.post("/api/contact", async (req, res) => {
    try {
      const message = await storage.createContactMessage({
        id: randomUUID(),
        ...req.body,
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  return httpServer;
}
