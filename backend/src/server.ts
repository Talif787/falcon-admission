// backend/src/server.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { connectDatabase } from './config/database';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import adminRoutes from './routes/adminRoutes';
import chatRoutes from './routes/chatRoutes';

class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = config.port;
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.ensureUploadDirectory();
  }

  private initializeMiddleware(): void {
    // CORS configuration
    this.app.use(
      cors({
        origin: config.frontendUrl,
        credentials: true
      })
    );

    // Body parser
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });
      next();
    });

    // Static files
    this.app.use('/uploads', express.static(config.uploadDir));
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
      });
    });

    // API routes
    this.app.use('/api/admin', adminRoutes);
    this.app.use('/api/chat', chatRoutes);

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  private ensureUploadDirectory(): void {
    if (!fs.existsSync(config.uploadDir)) {
      fs.mkdirSync(config.uploadDir, { recursive: true });
      logger.info(`Created upload directory: ${config.uploadDir}`);
    }

    // Create logs directory
    if (!fs.existsSync('./logs')) {
      fs.mkdirSync('./logs');
    }
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase();

      // Start server
      this.app.listen(this.port, () => {
        logger.info(`Server running on port ${this.port} in ${config.nodeEnv} mode`);
        logger.info(`API available at http://localhost:${this.port}`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }
}

// Start server
const server = new Server();
server.start();

export default server;