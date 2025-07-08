# Family Sites Monorepo

A consolidated monorepo containing the Ferguson family's Astro websites and shared utilities.

## Structure

```
family-sites/
├── apps/                      # Astro applications
│   ├── micah-ferguson/        # Micah's personal site
│   └── mollyferguson.info/    # Molly's blog/portfolio site
├── packages/                  # Shared packages
│   └── astro-utils/           # Private utility package
├── .github/workflows/         # CI/CD pipelines
├── .eslintrc.js              # Shared ESLint configuration
├── tsconfig.base.json        # Shared TypeScript configuration
├── .nvmrc                    # Node.js version (22.15)
└── package.json              # Monorepo workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 22.15 (use `nvm use` to automatically set the correct version)
- npm (comes with Node.js)

### Installation

```bash
# Install all dependencies for all workspaces
npm install
```

### Development

```bash
# Start Molly's site in development mode
npm run dev:molly

# Start Micah's site in development mode
npm run dev:micah

# Start the default site (mollyferguson.info)
npm run dev
```

### Building

```bash
# Build all projects
npm run build

# Build specific projects
npm run build:molly
npm run build:micah
npm run build:utils
```

### Linting & Type Checking

```bash
# Run linting across all workspaces
npm run lint

# Run Astro type checking across all workspaces
npm run astro:check
```

## Environment Variables

The following environment variables are used:

### For mollyferguson.info
- `MOLLY_ASTRO_HYGRAPH_ENDPOINT` or `ASTRO_HYGRAPH_ENDPOINT`

### For micah-ferguson
- `MICAH_ASTRO_HYGRAPH_ENDPOINT` or `ASTRO_HYGRAPH_ENDPOINT`

### For publishing astro-utils
- `NPM_GH_TOKEN` - GitHub Personal Access Token for publishing to GitHub Packages

## Deployment

Both applications are deployed to Cloudflare Pages:

- **mollyferguson.info**: Automatically deployed from `main` branch
- **micah-ferguson**: Automatically deployed from `main` branch

The `astro-utils` package is automatically published to GitHub Packages when changes are pushed to `main`.

## Workspace Commands

Each workspace can be targeted individually:

```bash
# Run command in specific workspace
npm run <script> --workspace=apps/mollyferguson.info
npm run <script> --workspace=apps/micah-ferguson
npm run <script> --workspace=packages/astro-utils

# Run command across all workspaces (if script exists)
npm run <script> --workspaces
```

## Publishing astro-utils

The `astro-utils` package is automatically published to GitHub Packages on every push to `main`. To manually publish:

```bash
npm run publish:utils
```

## TypeScript Configuration

The monorepo uses a shared TypeScript configuration (`tsconfig.base.json`) that enforces strict type checking. Each workspace extends this base configuration and can add project-specific options.

## Linting

Shared ESLint configuration is defined in `.eslintrc.js` at the root, with rules optimized for TypeScript and Astro development.

## CI/CD

GitHub Actions automatically:
- Runs linting and type checking on all PRs
- Builds all projects to verify they compile
- Deploys to Cloudflare Pages on main branch pushes
- Publishes astro-utils to GitHub Packages on main branch pushes 