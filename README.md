# FoodApp - Production-Ready Food Ordering Platform

A comprehensive, full-scale food ordering platform built with modern technologies and production-ready architecture.

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Express API    │    │    MongoDB      │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Stripe      │    │     Redis       │    │   Monitoring    │
│   (Payments)    │    │   (Caching)     │    │ (Logs/Metrics)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Zustand** - State management

### Backend
- **Node.js + Express** - Server runtime and framework
- **MongoDB + Mongoose** - Database and ODM
- **Redis** - Caching and session storage
- **JWT** - Authentication
- **Joi** - Request validation
- **Winston** - Logging

### Infrastructure
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Stripe** - Payment processing
- **SendGrid** - Email service
- **Swagger** - API documentation

## 📋 Features

### User Features
- 🔐 Authentication (JWT + OAuth)
- 🍕 Browse and search food items
- 🛒 Shopping cart management
- 💳 Secure payment processing
- 📱 Responsive design (PWA ready)
- 📧 Order notifications
- ⭐ Reviews and ratings
- 📍 Address management

### Admin Features
- 📊 Admin dashboard
- 🍽️ Food item management
- 📦 Order management
- 👥 User management
- 📈 Analytics and reports
- 🔧 System monitoring

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- MongoDB 6+
- Redis (optional)
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/food-app.git
   cd food-app
   ```

2. **Install dependencies**
   ```bash
   npm run install
   ```

3. **Environment setup**
   ```bash
   # Server environment
   cp server/.env.example server/.env
   
   # Client environment
   cp client/.env.local.example client/.env.local
   ```

4. **Configure environment variables**
   - Update `server/.env` with your MongoDB URI, JWT secret, Stripe keys
   - Update `client/.env.local` with API URLs and public keys

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start development servers**
   ```bash
   # Start backend (port 5000)
   npm run dev
   
   # Start frontend (port 3000) - in another terminal
   npm run client
   ```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:5000/docs
- **Health Check**: http://localhost:5000/health

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy using GitHub Actions**
   - Push to `main` branch triggers automatic deployment
   - Configured for AWS ECS with Terraform

## 📊 Monitoring & Observability

- **Logs**: Structured JSON logging with Winston
- **Metrics**: Prometheus metrics collection
- **Errors**: Sentry error tracking
- **Health Checks**: Kubernetes-ready liveness/readiness probes

## 🔒 Security Features

- JWT authentication with refresh tokens
- Request rate limiting
- Input validation and sanitization
- CORS configuration
- Helmet security headers
- Password hashing with bcrypt
- SQL injection prevention

## 📱 PWA Features

- Service worker for offline functionality
- Web app manifest
- Push notifications
- App-like experience on mobile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@foodapp.com or join our Slack channel.

## 🗺️ Roadmap

- [ ] Multi-restaurant support
- [ ] Real-time order tracking
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**Phase 1 Complete** ✅
- Next.js migration with SSR/SSG
- Modular Express server architecture
- MongoDB with Mongoose ODM
- JWT authentication system
- Basic user flows and cart functionality

**Next: Phase 2** - Cart & Orders API, Stripe Integration, Checkout Pages