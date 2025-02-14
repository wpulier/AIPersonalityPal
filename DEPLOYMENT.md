# Deployment Guide for AI Personality Pal

## Current Setup Overview

### 1. Database (Already Configured)
- **Neon PostgreSQL**
  - Database URL: Already configured in `.env`
  - Connection: Using `@neondatabase/serverless`
  - ORM: Drizzle
  - Schema: Already initialized
  
### 2. External Services (Already Configured)
- **OpenAI Integration**
  - API Key: Set in `.env`
  - Ready for production use

- **Spotify Integration**
  - Client ID and Secret: Set in `.env`
  - Local callback URL configured
  - ⚠️ Needs update for production callback URL

## Deployment Steps

### 1. Choose a Hosting Platform

#### Option A: Vercel (Recommended)
Advantages for our setup:
- Native support for Node.js and TypeScript
- Seamless integration with Neon PostgreSQL
- Built-in environment variable management
- Automatic HTTPS and SSL
- Zero-config serverless functions

#### Option B: Railway
Advantages:
- Simple deployment process
- Good PostgreSQL support
- Automatic deployments from GitHub

#### Option C: Heroku
Traditional option with:
- Proven track record
- Good for long-running processes
- Extensive logging

### 2. Pre-Deployment Tasks

1. **Update Production Environment Variables**
   Your existing `.env` variables need to be transferred to your hosting platform:
   ```env
   # Database (Already have this)
   DATABASE_URL="${YOUR_EXISTING_NEON_URL}"
   PGDATABASE="neondb"
   PGHOST="${YOUR_EXISTING_NEON_HOST}"
   PGPORT="5432"
   PGUSER="${YOUR_EXISTING_NEON_USER}"
   PGPASSWORD="${YOUR_EXISTING_NEON_PASSWORD}"
   
   # OpenAI (Already have this)
   OPENAI_API_KEY="${YOUR_EXISTING_OPENAI_KEY}"
   
   # Spotify (Update callback URL)
   SPOTIFY_CLIENT_ID="${YOUR_EXISTING_CLIENT_ID}"
   SPOTIFY_CLIENT_SECRET="${YOUR_EXISTING_CLIENT_SECRET}"
   SPOTIFY_REDIRECT_URI="https://your-production-domain.com/callback"
   
   # Session (Generate new for production)
   SESSION_SECRET="generate-new-secret-for-production"
   
   # Server
   NODE_ENV="production"
   ```

2. **Update Spotify Configuration**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Add your production callback URL
   - Format: `https://your-production-domain.com/callback`

### 3. Deployment Process

#### Using Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   # Initial deployment
   vercel
   
   # Follow prompts and:
   # 1. Import your environment variables
   # 2. Set build command to 'npm run build'
   # 3. Set output directory to 'dist'
   
   # Deploy to production
   vercel --prod
   ```

### 4. Post-Deployment Verification

1. **Database Connection**
   - Your Neon database is already set up
   - Verify connection in production:
   ```bash
   # Run this after deployment
   npm run db:push
   ```

2. **API Integrations**
   - Test OpenAI endpoint
   - Verify Spotify authentication flow
   - Check database queries

3. **Security Checks**
   - Verify SSL/HTTPS is enabled
   - Test session management
   - Confirm environment variables are set

## Maintenance

1. **Database**
   - Neon handles most maintenance
   - Monitor query performance
   - Set up regular backups

2. **Application Updates**
   ```bash
   npm update
   npm audit fix
   ```

3. **Monitoring**
   - Set up uptime monitoring
   - Configure error tracking
   - Monitor API rate limits

## Troubleshooting

1. **Database Issues**
   ```bash
   # Verify Neon connection
   curl ${YOUR_NEON_DB_URL}
   
   # Check schema sync
   npm run db:push
   ```

2. **Spotify Auth Issues**
   - Verify callback URL matches exactly
   - Check network requests
   - Verify scopes

3. **Build Problems**
   ```bash
   # Clear build cache
   rm -rf .next
   rm -rf dist
   
   # Fresh install
   rm -rf node_modules
   npm install
   ```

## Resources

- [Neon Serverless Documentation](https://neon.tech/docs/serverless)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api) 