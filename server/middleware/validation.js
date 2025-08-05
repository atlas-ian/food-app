const Joi = require('joi');
const logger = require('../utils/logger');

/**
 * Validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'params', 'query')
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      logger.warn('Validation error:', { error: errorMessage, property, data: req[property] });
      
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }

    // Replace the request property with the validated and sanitized value
    req[property] = value;
    next();
  };
};

// Common validation schemas
const schemas = {
  // Auth schemas
  register: Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(128).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(128).required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().lowercase().required(),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).max(128).required(),
  }),

  // User schemas
  updateProfile: Joi.object({
    name: Joi.string().trim().min(2).max(50),
    email: Joi.string().email().lowercase(),
    phone: Joi.string().pattern(/^[+]?[\d\s-()]+$/).min(10).max(20),
    address: Joi.object({
      street: Joi.string().trim().max(200),
      city: Joi.string().trim().max(100),
      state: Joi.string().trim().max(100),
      zipCode: Joi.string().trim().max(20),
      country: Joi.string().trim().max(100),
    }),
  }),

  // Food schemas
  createFood: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().max(500),
    price: Joi.number().positive().precision(2).required(),
    category: Joi.string().trim().max(50),
    imageUrl: Joi.string().uri(),
    isAvailable: Joi.boolean().default(true),
    tags: Joi.array().items(Joi.string().trim().max(30)),
  }),

  updateFood: Joi.object({
    name: Joi.string().trim().min(2).max(100),
    description: Joi.string().trim().max(500),
    price: Joi.number().positive().precision(2),
    category: Joi.string().trim().max(50),
    imageUrl: Joi.string().uri(),
    isAvailable: Joi.boolean(),
    tags: Joi.array().items(Joi.string().trim().max(30)),
  }),

  // Order schemas
  createOrder: Joi.object({
    items: Joi.array().items(
      Joi.object({
        _id: Joi.string().required(),
        name: Joi.string().required(),
        price: Joi.number().positive().required(),
        quantity: Joi.number().integer().positive().required(),
        imageUrl: Joi.string().uri(),
      })
    ).min(1).required(),
    deliveryAddress: Joi.object({
      street: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      state: Joi.string().trim().required(),
      zipCode: Joi.string().trim().required(),
      country: Joi.string().trim().required(),
    }).required(),
    notes: Joi.string().trim().max(500),
  }),

  updateOrderStatus: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled').required(),
  }),

  // Query parameter schemas
  paginationQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('createdAt', '-createdAt', 'name', '-name', 'price', '-price'),
  }),

  searchQuery: Joi.object({
    q: Joi.string().trim().min(1).max(100),
    category: Joi.string().trim().max(50),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    tags: Joi.alternatives().try(
      Joi.string(),
      Joi.array().items(Joi.string())
    ),
  }),

  // MongoDB ObjectId validation
  mongoId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
};

module.exports = {
  validate,
  schemas,
};