# Deployment Guide for React Portfolio

This guide provides instructions for deploying your React Portfolio to a web server using Git integration.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Build Process](#build-process)
3. [Deployment Options](#deployment-options)
   - [Manual Deployment](#manual-deployment)
   - [Automated Deployment with GitHub Actions](#automated-deployment-with-github-actions)
   - [Server Configuration](#server-configuration)
4. [Troubleshooting](#troubleshooting)

## Prerequisites

- Git installed on your local machine and server
- Node.js (v18 or higher) installed on your local machine and server
- Access to your web server via SSH or FTP
- A domain name pointing to your server (optional)

## Build Process

The build process compiles your React application into static files that can be served by any web server.

### Local Build

1. Run the deployment script:

   **Windows:**
   ```
   deploy.bat -b main
   ```

   **Unix/Linux/macOS:**
   ```
   ./deploy.sh -b main
   ```

   This will:
   - Check out the specified branch (default: main)
   - Pull the latest changes
   - Install dependencies
   - Build the project

2. The build output will be in the `dist/` directory.

## Deployment Options

### Manual Deployment

#### Using SCP/SFTP

Copy the build files to your server:

```bash
scp -r dist/* user@your-server:/path/to/webroot/
```

Or use an SFTP client like FileZilla to upload the files.

#### Using Rsync

Rsync is more efficient for incremental updates:

```bash
rsync -avz --delete dist/ user@your-server:/path/to/webroot/
```

### Automated Deployment with GitHub Actions

This repository includes a GitHub Actions workflow file (`.github/workflows/deploy.yml`) that can automate the deployment process.

To set it up:

1. Configure your server for SSH access from GitHub Actions:
   - Generate an SSH key pair
   - Add the public key to your server's `~/.ssh/authorized_keys`
   - Add the private key as a GitHub secret named `SSH_PRIVATE_KEY`

2. Add other required secrets to your GitHub repository:
   - `REMOTE_HOST`: Your server's hostname or IP
   - `REMOTE_USER`: SSH username
   - `REMOTE_PATH`: Path to your web directory on the server

3. Uncomment and customize the deployment section in the workflow file.

4. Push to the configured branch (main or dev) to trigger deployment.

### Server Configuration

#### Apache

The repository includes an `.htaccess` file in the `public/` directory that will be copied to the build output. This file:

- Redirects all requests to `index.html` for client-side routing
- Sets security headers
- Configures caching
- Enables compression

Make sure Apache has `mod_rewrite` enabled:

```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

#### Nginx

A sample Nginx configuration is provided in `nginx.conf`. To use it:

1. Copy the configuration to your server:
   ```bash
   scp nginx.conf user@your-server:/etc/nginx/sites-available/portfolio
   ```

2. Create a symbolic link to enable the site:
   ```bash
   ssh user@your-server "sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/"
   ```

3. Test the configuration:
   ```bash
   ssh user@your-server "sudo nginx -t"
   ```

4. Reload Nginx:
   ```bash
   ssh user@your-server "sudo systemctl reload nginx"
   ```

## Git Integration on the Server

To set up automatic updates from Git on your server:

1. SSH into your server:
   ```bash
   ssh user@your-server
   ```

2. Navigate to your web directory:
   ```bash
   cd /path/to/webroot
   ```

3. Clone your repository:
   ```bash
   git clone https://github.com/yourusername/React-Portfolio.git .
   ```

4. Set up a post-receive hook for automatic updates:
   ```bash
   mkdir -p .git/hooks
   touch .git/hooks/post-receive
   chmod +x .git/hooks/post-receive
   ```

5. Edit the post-receive hook:
   ```bash
   nano .git/hooks/post-receive
   ```

   Add the following content:
   ```bash
   #!/bin/bash
   git --git-dir=/path/to/webroot/.git --work-tree=/path/to/webroot checkout -f
   cd /path/to/webroot
   npm install --legacy-peer-deps
   npm run build
   cp -r dist/* /path/to/webroot/public_html/
   ```

6. Save and exit.

## Troubleshooting

### 404 Errors on Page Refresh

If you're getting 404 errors when refreshing pages, check that your server is properly configured to redirect all requests to `index.html`.

### Build Failures

If the build process fails:

1. Check the error messages in the console
2. Ensure all dependencies are installed: `npm install --legacy-peer-deps`
3. Verify that your Node.js version is compatible (v18+)

### Deployment Failures

If deployment fails:

1. Check server logs: `ssh user@your-server "tail -f /var/log/nginx/error.log"`
2. Verify SSH access and permissions
3. Ensure the target directory exists and is writable

### Missing Assets

If assets like images or fonts are missing:

1. Check that the paths in your code are correct
2. Verify that the assets were included in the build
3. Check for CORS issues if loading assets from a different domain
