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
   - Generate an SSH key pair (without a passphrase):
     ```bash
     ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f github-actions-deploy
     ```
   - Add the public key (`github-actions-deploy.pub`) to your server's `~/.ssh/authorized_keys`
   - Copy the private key content to use in the next step

2. Add required secrets to your GitHub repository:
   - Go to your repository on GitHub
   - Navigate to Settings > Secrets and variables > Actions
   - Click "New repository secret" and add the following secrets:

   **For Production (main branch):**
   - `SSH_PRIVATE_KEY`: The entire content of the private key file generated in step 1
   - `REMOTE_HOST`: Your production server hostname or IP address
   - `REMOTE_USER`: SSH username for your production server
   - `REMOTE_PATH`: Absolute path to your web directory on the production server (e.g., `/var/www/html/portfolio`)

   **For Staging (dev branch):**
   - `REMOTE_HOST_STAGING`: Your staging server hostname or IP address
   - `REMOTE_USER_STAGING`: SSH username for your staging server
   - `REMOTE_PATH_STAGING`: Absolute path to your web directory on the staging server

3. The workflow will automatically:
   - Build your project when you push to the main or dev branch
   - Run the Three.js build fixes
   - Deploy to the appropriate environment based on the branch

4. You can also manually trigger a deployment:
   - Go to the "Actions" tab in your repository
   - Select the "Deploy React Portfolio" workflow
   - Click "Run workflow"
   - Choose the branch and environment to deploy

### Troubleshooting GitHub Actions Deployment

If your GitHub Actions deployment fails, check the following:

1. **SSH Key Issues:**
   - Ensure the private key is correctly formatted in the GitHub secret
   - Verify the public key is properly added to `authorized_keys` on your server
   - Check server SSH configuration allows key-based authentication

2. **Permission Issues:**
   - Ensure the user specified in `REMOTE_USER` has write permissions to the target directory
   - You may need to run `chmod -R 755 /path/to/web/directory` on your server

3. **Path Issues:**
   - Double-check that `REMOTE_PATH` points to a valid directory on your server
   - Ensure the path is absolute (starts with `/`)

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
