#!/bin/bash

# Exit on error
set -e

# Display script usage
display_usage() {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  -b, --branch <branch>   Specify the branch to deploy (default: main)"
  echo "  -h, --help              Display this help message"
}

# Default values
BRANCH="main"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -b|--branch)
      BRANCH="$2"
      shift
      shift
      ;;
    -h|--help)
      display_usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      display_usage
      exit 1
      ;;
  esac
done

echo "🚀 Deploying branch: $BRANCH"

# Check if git is installed
if ! command -v git &> /dev/null; then
  echo "❌ Git is not installed. Please install git and try again."
  exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "❌ npm is not installed. Please install Node.js and npm, then try again."
  exit 1
fi

# Ensure we're on the correct branch
echo "📋 Checking out branch: $BRANCH"
git checkout $BRANCH

# Pull latest changes
echo "⬇️ Pulling latest changes"
git pull origin $BRANCH

# Install dependencies
echo "📦 Installing dependencies"
npm install --legacy-peer-deps

# Build the project
echo "🔨 Building the project"
npm run build

echo "✅ Build completed successfully!"
echo "📂 The build files are in the 'dist' directory"
echo ""
echo "To deploy to your web server, you can use:"
echo "  - Copy the 'dist' directory to your web server"
echo "  - Set up a CI/CD pipeline to automate deployment"
echo ""
echo "For a simple deployment to a directory on your server:"
echo "  rsync -avz --delete dist/ user@your-server:/path/to/webroot/"
echo ""
echo "Remember to configure your web server to handle client-side routing:"
echo "  - For Apache, ensure .htaccess is properly configured"
echo "  - For Nginx, configure try_files to redirect to index.html"
