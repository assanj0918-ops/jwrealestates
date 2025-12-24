import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";

const app = express();
const httpServer = createServer(app);

/**
 * Trust proxy (REQUIRED for Railway / Render)
 * Fixes cookies, sessions, and secure headers
 */
app.set("trust proxy", 1);

/**
 * Extend IncomingMessage to store rawBody
 */
declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

/**
 * Body parsers
 */
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

/**
 * Logger helper
 */
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * Request logging middleware
 */
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;

    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;

      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

/**
 * App bootstrap
 */
(async () => {
  // Register API routes & WebSockets
  await registerRoutes(httpServer, app);

  /**
   * Global error handler
   * IMPORTANT: Do NOT throw after sending response
   */
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });

  /**
   * Serve frontend
   */
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  /**
   * Start server
   * MUST use process.env.PORT on Railway
   */
  const port = parseInt(process.env.PORT || "5000", 10);

  const host =
    process.platform === "win32" ? "127.0.0.1" : "0.0.0.0";

  httpServer.listen(
    {
      port,
      host,
      reusePort: process.platform !== "win32",
    },
    () => {
      log(`🚀 Server running on http://${host}:${port}`);
    },
  );
})();
