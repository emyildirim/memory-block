# Memory Blocks - Production Deployment Guide

This guide covers multiple deployment options for the Memory Blocks application, from cloud platforms to containerized deployments.

## 🚀 Quick Production Checklist

Before deploying to production, ensure you have:

- [ ] Set up MongoDB database (Atlas recommended)
- [ ] Configured environment variables
- [ ] Generated strong JWT secret
- [ ] Set up domain and SSL certificates
- [ ] Configured CORS origins
- [ ] Set up monitoring and logging
- [ ] Tested the build process locally

## 📋 Environment Variables

### Backend (.env in server directory)
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/memory-blocks?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-change-this
JWT_EXPIRE=7d
CORS_ORIGIN=https://yourdomain.com
PORT=5001
```

### Frontend (Environment variables in Vercel/Netlify)
```bash
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=Memory Blocks
VITE_APP_VERSION=1.0.0
VITE_ENABLE_PWA=true
```

## 🌐 Vercel Deployment (Recommended)

### Backend Deployment

1. **Create MongoDB Atlas Database**
   ```bash
   # Sign up at https://www.mongodb.com/cloud/atlas
   # Create a new cluster
   # Get your connection string
   ```

2. **Deploy Backend to Vercel**
   ```bash
   cd server
   vercel --prod
   ```
   
   Set environment variables in Vercel dashboard:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a strong secret (use: `openssl rand -base64 64`)
   - `JWT_EXPIRE`: `7d`
   - `CORS_ORIGIN`: Your frontend domain

3. **Deploy Frontend to Vercel**
   ```bash
   cd client
   vercel --prod
   ```
   
   Set environment variables:
   - `VITE_API_URL`: Your backend API URL

### Automated Deployment with GitHub

1. Connect your GitHub repository to Vercel
2. Create two projects: one for `client/` and one for `server/`
3. Set up automatic deployments on push to main branch

## 🐳 Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- Domain with SSL certificate (for production)

### Local Development with Docker
```bash
# Build and start all services
npm run docker:build
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### Production Docker Deployment

1. **Update docker-compose.yml for production**
   ```yaml
   # Update environment variables
   # Use production MongoDB URI
   # Set secure passwords
   # Configure reverse proxy (nginx/traefik)
   ```

2. **Deploy with SSL**
   ```bash
   # Use docker-compose.prod.yml with SSL configuration
   docker-compose -f docker-compose.prod.yml up -d
   ```

## ☁️ Alternative Cloud Platforms

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Render
1. Connect GitHub repository
2. Create web service for backend
3. Create static site for frontend
4. Configure environment variables

### Heroku
```bash
# Install Heroku CLI
# Create apps
heroku create memory-blocks-api
heroku create memory-blocks-client

# Deploy backend
cd server
git push heroku main

# Deploy frontend
cd client
git push heroku main
```

## 🔧 Performance Optimizations

### Frontend Optimizations
- ✅ Code splitting with manual chunks
- ✅ Asset optimization and compression
- ✅ PWA with service worker
- ✅ Lazy loading components
- ✅ Image optimization
- ✅ Bundle analysis

### Backend Optimizations
- ✅ Compression middleware
- ✅ Rate limiting
- ✅ MongoDB connection pooling
- ✅ Request/response caching
- ✅ Security headers
- ✅ Input sanitization

### Database Optimizations
- Create indexes on frequently queried fields
- Use MongoDB Atlas auto-scaling
- Set up database monitoring
- Configure backup strategies

## 🔐 Security Checklist

- ✅ HTTPS enforced
- ✅ CORS properly configured
- ✅ Rate limiting implemented
- ✅ Input validation and sanitization
- ✅ Security headers configured
- ✅ JWT secrets are strong and secure
- ✅ Environment variables secured
- ✅ Database connection encrypted
- ✅ CSP headers configured
- ✅ XSS protection enabled

## 📊 Monitoring & Analytics

### Application Monitoring
```bash
# Add monitoring services
# - Vercel Analytics (built-in)
# - Sentry for error tracking
# - LogRocket for user sessions
# - New Relic for performance
```

### Database Monitoring
- MongoDB Atlas monitoring
- Set up alerts for connection issues
- Monitor query performance
- Track database size and growth

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   ```bash
   # Check CORS_ORIGIN environment variable
   # Ensure frontend domain is whitelisted
   # Verify protocol (http vs https)
   ```

2. **Database Connection Issues**
   ```bash
   # Check MongoDB URI format
   # Verify network access in Atlas
   # Test connection with MongoDB Compass
   ```

3. **Build Failures**
   ```bash
   # Clear node_modules and reinstall
   npm run clean
   npm run install-all
   
   # Check Node.js version compatibility
   node --version
   ```

4. **Authentication Issues**
   ```bash
   # Verify JWT_SECRET is set
   # Check token expiration
   # Clear localStorage in browser
   ```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use MongoDB sharding for large datasets
- Implement Redis for session storage
- Set up load balancing
- Use CDN for static assets

### Vertical Scaling
- Upgrade server resources
- Optimize database queries
- Implement caching strategies
- Monitor resource usage

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm run install-all
      
      - name: Build frontend
        run: npm run build:client
      
      - name: Deploy to Vercel
        run: |
          cd client && vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
          cd ../server && vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 📞 Support & Maintenance

### Regular Maintenance
- Update dependencies monthly
- Monitor security vulnerabilities
- Backup database regularly
- Review logs for errors
- Performance monitoring

### Emergency Procedures
- Database backup and restore procedures
- Rollback deployment process
- Emergency contact information
- Incident response plan

---

For additional help or questions, please refer to the main README.md or create an issue in the repository.
