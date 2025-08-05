@@ .. @@
-require('dotenv').config();
-const express  = require('express');
-const cors     = require('cors');
-const mongoose = require('mongoose');
-const Food     = require('./models/Food');
-const Order    = require('./models/Order');
-const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
-
-const app = express();
-
-// CORS configuration
-const corsOptions = {
-  origin: process.env.CLIENT_URL || 'http://localhost:3000',
-  credentials: true,
-  optionsSuccessStatus: 200
-};
-
-app.use(cors(corsOptions));
-app.use(express.json());
-
-const { MONGO_URI, PORT = 5000 } = process.env;
-
-// Validate required environment variables
-if (!MONGO_URI) {
-  console.error('❌ MONGO_URI environment variable is required');
-  process.exit(1);
-}
-
-// Health check
-app.get('/', (_req, res) => {
-  res.json({ 
-    message: 'Food App API is running',
-    timestamp: new Date().toISOString(),
-    environment: process.env.NODE_ENV || 'development'
-  });
-});
-
-// GET /api/foods → returns all food items
-app.get('/api/foods', async (_req, res) => {
+const express = require('express');
+const Food = require('../models/Food');
+const { optionalAuth } = require('../middleware/auth');
+const { validate, schemas } = require('../middleware/validation');
+const { getRedisClient } = require('../config/redis');
+const logger = require('../utils/logger');
+
+const router = express.Router();
+
+/**
+ * @swagger
+ * /api/foods:
+ *   get:
+ *     summary: Get all food items
+ *     tags: [Foods]
+ *     parameters:
+ *       - in: query
+ *         name: page
+ *         schema:
+ *           type: integer
+ *         description: Page number
+ *       - in: query
+ *         name: limit
+ *         schema:
+ *           type: integer
+ *         description: Number of items per page
+ *       - in: query
+ *         name: category
+ *         schema:
+ *           type: string
+ *         description: Filter by category
+ *       - in: query
+ *         name: sort
+ *         schema:
+ *           type: string
+ *         description: Sort order
+ *     responses:
+ *       200:
+ *         description: List of food items
+ */
+router.get('/', optionalAuth, validate(schemas.paginationQuery, 'query'), async (req, res) => {
   try {
-    const foods = await Food.find().sort({ createdAt: -1 });
-    res.json(foods);
-  } catch (err) {
-    console.error('Error fetching foods:', err);
-    res.status(500).json({ message: 'Server Error while fetching foods' });
+    const { page, limit, sort, category } = req.query;
+    
+    // Build query
+    const query = { isAvailable: true };
+    if (category) {
+      query.category = new RegExp(category, 'i');
+    }
+
+    // Check Redis cache
+    const redis = getRedisClient();
+    const cacheKey = `foods:${JSON.stringify({ query, page, limit, sort })}`;
+    
+    if (redis) {
+      try {
+        const cached = await redis.get(cacheKey);
+        if (cached) {
+          return res.json(JSON.parse(cached));
+        }
+      } catch (error) {
+        logger.warn('Redis get error:', error);
+      }
+    }
+
+    // Calculate pagination
+    const skip = (page - 1) * limit;
+    
+    // Execute query
+    const [foods, total] = await Promise.all([
+      Food.find(query)
+        .sort(sort || { createdAt: -1 })
+        .skip(skip)
+        .limit(limit)
+        .lean(),
+      Food.countDocuments(query),
+    ]);
+
+    const result = {
+      foods,
+      pagination: {
+        page,
+        limit,
+        total,
+        pages: Math.ceil(total / limit),
+      },
+    };
+
+    // Cache result
+    if (redis) {
+      try {
+        await redis.setex(cacheKey, 300, JSON.stringify(result)); // Cache for 5 minutes
+      } catch (error) {
+        logger.warn('Redis set error:', error);
+      }
+    }
+
+    res.json(result);
+  } catch (error) {
+    logger.error('Error fetching foods:', error);
+    res.status(500).json({ message: 'Server error while fetching foods' });
   }
 });

-// GET /api/foods/:id → returns single food item
-app.get('/api/foods/:id', async (req, res) => {
+/**
+ * @swagger
+ * /api/foods/search:
+ *   get:
+ *     summary: Search food items
+ *     tags: [Foods]
+ *     parameters:
+ *       - in: query
+ *         name: q
+ *         schema:
+ *           type: string
+ *         description: Search query
+ *       - in: query
+ *         name: category
+ *         schema:
+ *           type: string
+ *         description: Filter by category
+ *       - in: query
+ *         name: minPrice
+ *         schema:
+ *           type: number
+ *         description: Minimum price
+ *       - in: query
+ *         name: maxPrice
+ *         schema:
+ *           type: number
+ *         description: Maximum price
+ *     responses:
+ *       200:
+ *         description: Search results
+ */
+router.get('/search', validate(schemas.searchQuery, 'query'), async (req, res) => {
   try {
-    const food = await Food.findById(req.params.id);
-    if (!food) {
-      return res.status(404).json({ message: 'Food item not found' });
+    const { q, category, minPrice, maxPrice, tags } = req.query;
+    
+    // Build search query
+    const query = { isAvailable: true };
+    
+    if (q) {
+      query.$text = { $search: q };
+    }
+    
+    if (category) {
+      query.category = new RegExp(category, 'i');
+    }
+    
+    if (minPrice || maxPrice) {
+      query.price = {};
+      if (minPrice) query.price.$gte = minPrice;
+      if (maxPrice) query.price.$lte = maxPrice;
+    }
+    
+    if (tags) {
+      const tagArray = Array.isArray(tags) ? tags : [tags];
+      query.tags = { $in: tagArray };
+    }
+
+    const foods = await Food.find(query)
+      .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
+      .limit(50)
+      .lean();
+
+    res.json({ foods, count: foods.length });
+  } catch (error) {
+    logger.error('Error searching foods:', error);
+    res.status(500).json({ message: 'Server error while searching foods' });
+  }
+});
+
+/**
+ * @swagger
+ * /api/foods/categories:
+ *   get:
+ *     summary: Get all food categories
+ *     tags: [Foods]
+ *     responses:
+ *       200:
+ *         description: List of categories
+ */
+router.get('/categories', async (req, res) => {
+  try {
+    const categories = await Food.distinct('category', { isAvailable: true });
+    res.json({ categories: categories.filter(Boolean) });
+  } catch (error) {
+    logger.error('Error fetching categories:', error);
+    res.status(500).json({ message: 'Server error while fetching categories' });
+  }
+});
+
+/**
+ * @swagger
+ * /api/foods/{id}:
+ *   get:
+ *     summary: Get single food item
+ *     tags: [Foods]
+ *     parameters:
+ *       - in: path
+ *         name: id
+ *         required: true
+ *         schema:
+ *           type: string
+ *         description: Food ID
+ *     responses:
+ *       200:
+ *         description: Food item details
+ *       404:
+ *         description: Food item not found
+ */
+router.get('/:id', validate(schemas.mongoId, 'params'), async (req, res) => {
+  try {
+    const food = await Food.findById(req.params.id).lean();
+    
+    if (!food || !food.isAvailable) {
+      return res.status(404).json({ message: 'Food item not found' });
     }
+    
     res.json(food);
-  } catch (err) {
-    console.error('Error fetching food:', err);
-    res.status(500).json({ message: 'Server Error while fetching food item' });
+  } catch (error) {
+    logger.error('Error fetching food:', error);
+    res.status(500).json({ message: 'Server error while fetching food item' });
   }
 });

-// GET /api/admin/orders → all orders (admin only)
-app.get('/api/admin/orders', async (_req, res) => {
+/**
+ * @swagger
+ * /api/foods/category/{category}:
+ *   get:
+ *     summary: Get foods by category
+ *     tags: [Foods]
+ *     parameters:
+ *       - in: path
+ *         name: category
+ *         required: true
+ *         schema:
+ *           type: string
+ *         description: Category name
+ *     responses:
+ *       200:
+ *         description: Foods in category
+ */
+router.get('/category/:category', async (req, res) => {
   try {
-    const orders = await Order.find().sort({ createdAt: -1 });
-    res.json(orders);
-  } catch (err) {
-    console.error('Error fetching orders:', err);
-    res.status(500).json({ message: 'Could not fetch orders' });
+    const { category } = req.params;
+    
+    const foods = await Food.find({
+      category: new RegExp(category, 'i'),
+      isAvailable: true,
+    })
+      .sort({ createdAt: -1 })
+      .lean();
+
+    res.json({ foods, category });
+  } catch (error) {
+    logger.error('Error fetching foods by category:', error);
+    res.status(500).json({ message: 'Server error while fetching foods by category' });
   }
 });

-// POST /api/orders
-app.post('/api/orders', async (req, res) => {
+module.exports = router;
+