# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
## Core Principles

1. **Zero Duplication**: Always reuse or extend existing utilities instead of reimplementing
2. **Code Discovery First**: Search the codebase thoroughly before writing new functions
3. **Scope Discipline**: Edit only files required for the specific ticket
4. **Single Responsibility**: One purpose per function

- DO NOT ADD 3rd party libraries that can be easily built.  LIKE AXIOS!
- DO NOT COMMIT EVER Without my direction
- never use claude code as commit attribution.  always use the current user.

## What NOT to Do

- **Build for imaginary future requirements** - Only implement what the current ticket requires
- **Add complex error handling for unlikely scenarios** - Simple error handling for expected cases only
- **Suggest design patterns unless actually required** - Use existing patterns, don't introduce new ones
- **Optimize prematurely** - Focus on correctness first, optimize only when performance issues are proven
- **Add configuration for rarely changing values** - Hard-code values that don't need to be configurable
- **Create duplicate functionality** - Always search for and reuse existing utilities
## Project Structure

This is a family sites monorepo containing multiple Astro websites and shared utilities:

```
family-sites/
├── apps/
│   ├── mollyferguson.info/    # Molly's blog/portfolio (Astro site)
│   ├── micah-ferguson/        # Micah's personal site (Astro site)
│   ├── caleb/                 # Caleb's site (Astro site)
│   └── webhook-dispatcher/    # Cloudflare Worker (TypeScript)
├── packages/
│   └── astro-utils/           # Shared utilities package (@sferg989/astro-utils)
└── [root config files]
```

## Common Commands

### Development
```bash
# Install all dependencies
npm install

# Start development servers (default: mollyferguson.info)
npm run dev
npm run dev:molly    # mollyferguson.info
npm run dev:micah    # micah-ferguson
npm run dev:caleb    # caleb
npm run dev:webhook  # webhook-dispatcher (Cloudflare Worker)
```

### Building & Type Checking
```bash
# Build all projects
npm run build

# Build specific projects
npm run build:molly
npm run build:micah
npm run build:caleb
npm run build:webhook
npm run build:utils

# Run linting across all workspaces
npm run lint

# Run Astro type checking across all workspaces
npm run astro:check
```

### Deployment
```bash
# Deploy to Cloudflare (uses wrangler)
npm run deploy:molly
npm run deploy:micah
npm run deploy:caleb
npm run deploy:webhook

# Build and deploy in one step
npm run build-and-deploy:molly
npm run build-and-deploy:micah
npm run build-and-deploy:caleb
npm run build-and-deploy:webhook
```

### Publishing (astro-utils package)
```bash
npm run publish:utils
```

## Architecture Notes

### Workspace Configuration
- Uses npm workspaces for monorepo management
- Shared ESLint config in `.eslintrc.cjs` with TypeScript and Astro support
- Shared TypeScript config in `tsconfig.base.json` extending `astro/tsconfigs/strict`
- Node.js 22.15+ required (see `.nvmrc`)

### Astro Sites (mollyferguson.info, micah-ferguson, caleb)
- All extend shared TypeScript config
- Use `@sferg989/astro-utils` package for shared functionality
- Include GraphQL integration via `graphql-request` for Hygraph CMS
- Standard build process: `astro check && astro build`
- All deployed to Cloudflare Pages

### Webhook Dispatcher
- TypeScript Cloudflare Worker (not Astro)
- Uses `wrangler` for development and deployment
- TypeScript compilation via `tsc`
- Build command: `tsc`

### astro-utils Package
- Private shared package published to GitHub Packages
- Provides utilities for all Astro sites
- Uses Jest for testing
- Exports: main (index.ts) and image-optimization module

## Environment Variables

Each site uses environment-specific Hygraph endpoints:
- `ASTRO_HYGRAPH_ENDPOINT` - Site-specific Hygraph Content API endpoint

For publishing: `NPM_GH_TOKEN` (GitHub Personal Access Token)

## Hygraph CMS Configuration

**IMPORTANT**: Each site has its own separate Hygraph project. Schema changes must be applied to ALL THREE projects.

### Molly (mollyferguson.info)
- **Region**: us-east-1-shared-usea1-02
- **Project ID**: cm048oo3l01gz07wf7rrq84lg
- **Content API**: https://us-east-1-shared-usea1-02.cdn.hygraph.com/content/cm048oo3l01gz07wf7rrq84lg/master
- **Management API**: https://management-us-east-1-shared-usea1-02.hygraph.com/graphql
- **MCP Endpoint**: https://mcp-us-east-1-shared-usea1-02.hygraph.com/cm048oo3l01gz07wf7rrq84lg/master/mcp

### Micah (micah-ferguson)
- **Region**: us-west-2
- **Project ID**: cm4ah46tx01ol07lnfafy43gg
- **Content API**: https://us-west-2.cdn.hygraph.com/content/cm4ah46tx01ol07lnfafy43gg/master
- **Management API**: https://management-us-west-2.hygraph.com/graphql
- **MCP Endpoint**: https://mcp-us-west-2.hygraph.com/cm4ah46tx01ol07lnfafy43gg/master/mcp

### Caleb (caleb)
- **Region**: us-west-2
- **Project ID**: cmd3k49mt1tr907mybbem3cyg
- **Content API**: https://us-west-2.cdn.hygraph.com/content/cmd3k49mt1tr907mybbem3cyg/master
- **Management API**: https://management-us-west-2.hygraph.com/graphql
- **MCP Endpoint**: https://mcp-us-west-2.hygraph.com/cmd3k49mt1tr907mybbem3cyg/master/mcp

## CI/CD
- Smart change detection for conditional builds/deploys
- Runs linting and type checking on all changes
- Builds only affected workspaces
- Auto-deploys webhook-dispatcher on main branch pushes
- Auto-publishes astro-utils to GitHub Packages when version changes
- Cloudflare Pages auto-deploys Astro sites from main branch

## Testing
Use Jest for the astro-utils package. Individual Astro sites may have their own testing setups.


### MCP addingclaude mcp add --transport http hygraph-caleb "https://mcp-us-west-2.hygraph.com/cmd3k49mt1tr907mybbem3cyg/master/mcp" --header "Authorization: Bearer <YOUR_TOKEN>"