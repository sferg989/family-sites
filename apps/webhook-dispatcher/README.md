# Webhook Dispatcher

A Cloudflare Worker that receives webhooks from Hygraph CMS and triggers GitHub repository dispatch events to deploy the appropriate family sites.

## Overview

This webhook dispatcher simplifies the deployment flow by:

1. **Receiving webhooks** from Hygraph when content is updated
2. **Determining which site** to deploy based on the content ID
3. **Dispatching GitHub events** using event types instead of complex payload parsing
4. **Triggering automated deployments** via GitHub Actions

## Flow

```
Hygraph Content Update
        ↓
Webhook Dispatcher (CF Worker)
        ↓  
GitHub Repository Dispatch
        ↓
GitHub Actions (.github/workflows/deploy.yml)
        ↓
Cloudflare Sites Deployment
```

## Event Types

The dispatcher sends the following event types to GitHub:

- `molly` - Deploy mollyferguson.info only
- `micah` - Deploy micah-ferguson only  
- `caleb` - Deploy caleb only
- `all` - Deploy all sites (fallback)

## Configuration

### Environment Variables

Set these in your Cloudflare Worker environment:

- `NPM_GH_TOKEN` - GitHub Personal Access Token with `repo` permissions
- `GITHUB_REPO` - Repository name (e.g., "sferg989/family-sites")
- `GITHUB_API_URL` - GitHub API URL (default: "https://api.github.com")

### Hygraph Configuration

Configure your Hygraph webhook to send to the deployed worker URL:

- **URL**: `https://webhook-dispatcher.your-account.workers.dev`
- **Method**: `POST`
- **Content-Type**: `application/json`

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev:webhook

# Build the worker
npm run build:webhook

# Deploy to Cloudflare
npm run deploy:webhook
```

## Deployment

From the monorepo root:

```bash
# Build and deploy the webhook dispatcher
npm run build-and-deploy:webhook
```

## Security

- The worker validates HTTP methods (only POST allowed)
- CORS headers are properly configured
- Environment variables are validated before processing
- All errors are logged for debugging

## Monitoring

The worker logs all webhook events and GitHub API responses to Cloudflare's logging system. Monitor these logs to troubleshoot any deployment issues. 