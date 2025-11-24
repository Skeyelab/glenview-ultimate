# Deployment Guide

This guide covers deploying the Glenview Ultimate website to production.

## Prerequisites

- Node.js >=22.14.0 <23.0.0
- Directus instance configured (see [DIRECTUS_SETUP.md](./DIRECTUS_SETUP.md))
- Environment variables configured
- Production build passes locally

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass (`yarn test`)
- [ ] Build succeeds (`yarn build`)
- [ ] Linter passes (`yarn standard:check`)
- [ ] Environment variables are configured
- [ ] Directus collections are set up
- [ ] Analytics (Umami) is configured (if used)

## Environment Variables

Set the following environment variables in your production environment:

```bash
DIRECTUS_URL=https://your-directus.example.com
DIRECTUS_STATIC_TOKEN=your_production_static_token
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus.example.com
NEXT_PUBLIC_SITE_NAME=Glenview Ultimate
```

**Security Notes:**
- Never commit `.env.local` or production secrets to version control
- Use secure environment variable management in your hosting platform
- Rotate static tokens regularly
- Use different tokens for staging and production

## Build Process

### Local Build Test

Test the production build locally:

```bash
yarn build
yarn start
```

Visit `http://localhost:3000` to verify the build works correctly.

### Production Build

The build process:
1. Compiles TypeScript
2. Optimizes React components
3. Generates static pages where possible
4. Bundles JavaScript and CSS
5. Optimizes images

## Deployment Platforms

### Vercel (Recommended)

Vercel is optimized for Next.js deployments:

1. Connect your GitHub repository
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

**Vercel Configuration:**
- Framework Preset: Next.js
- Build Command: `yarn build`
- Output Directory: `.next`
- Install Command: `yarn install`

### Other Platforms

The application can be deployed to any Node.js hosting platform:

#### Node.js Server

```bash
# Build the application
yarn build

# Start the production server
yarn start
```

The server runs on port 3000 by default (configurable via `PORT` environment variable).

#### Docker

Example Dockerfile:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
```

#### Static Export (Not Recommended)

This application uses server-side features (API routes, Directus integration) and cannot be statically exported.

## Post-Deployment

After deployment:

1. **Verify Site Functionality**
   - Test homepage loads
   - Test registration form submission
   - Test news pages
   - Test schedule page
   - Verify images load correctly

2. **Check Analytics**
   - Verify Umami tracking is working
   - Test custom event tracking

3. **Monitor Errors**
   - Check application logs
   - Monitor Directus connection
   - Watch for API errors

4. **Performance**
   - Test page load times
   - Verify image optimization
   - Check caching headers

## CI/CD

The project includes GitHub Actions for continuous integration:

- Tests run on every push
- Linter checks on every push
- Build verification on pull requests

See `.github/workflows/ci.yml` for configuration.

## Rollback

If issues occur after deployment:

1. Revert to previous deployment (platform-specific)
2. Check environment variables
3. Verify Directus connectivity
4. Review application logs

## Monitoring

Recommended monitoring:

- **Application Errors**: Use platform error tracking (Vercel, Sentry, etc.)
- **Performance**: Monitor Core Web Vitals
- **Analytics**: Track via Umami dashboard
- **Directus**: Monitor Directus instance health

## Security Considerations

- Keep dependencies updated (`yarn upgrade`)
- Use HTTPS in production
- Secure Directus static token
- Enable rate limiting on API routes (if needed)
- Regular security audits

## Performance Optimization

- Images are optimized via Directus asset transforms
- Static pages are cached appropriately
- API routes use appropriate caching headers
- Consider CDN for static assets

## Troubleshooting

### Build Fails

- Check Node.js version matches requirements
- Verify all dependencies are installed
- Check for TypeScript errors
- Review build logs

### Runtime Errors

- Verify environment variables are set
- Check Directus connectivity
- Review application logs
- Test API endpoints directly

### Image Loading Issues

- Verify Directus asset proxy route works
- Check file permissions in Directus
- Verify static token has file read permissions

