require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import configurations
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/foods');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
} else {
  app.use(morgan('dev'));
}

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions));
// Body parsing middleware
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FoodApp API',
      version: '1.0.0',
      description: 'A comprehensive food ordering platform API',
      contact: {
        name: 'FoodApp Team',
        email: 'support@foodapp.com',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Environment validation
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  logger.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

// Health check
app.get('/health', (req, res) => {
  res.json({
    message: 'Food App API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  });
});

// Liveness probe
app.get('/health/liveness', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

// Readiness probe
app.get('/health/readiness', async (req, res) => {
  // Check database connection
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ status: 'not ready', reason: 'database not connected' });
  }
  
  res.status(200).json({ status: 'ready' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message;
    
  res.status(err.status || 500).json({ message });
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn('Route not found:', { url: req.originalUrl, method: req.method, ip: req.ip });
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Initialize connections and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Connect to Redis (optional)
    await connectRedis();
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`🚀 Server listening on port ${PORT}`);
      logger.info(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`📚 API Documentation: http://localhost:${PORT}/docs`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);
  
  const mongoose = require('mongoose');
  const { closeRedis } = require('./config/redis');
  
  Promise.all([
    mongoose.connection.close(),
    closeRedis(),
  ]).then(() => {
    logger.info('All connections closed');
    process.exit(0);
  }).catch((error) => {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});