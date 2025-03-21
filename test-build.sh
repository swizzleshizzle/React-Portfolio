#!/bin/bash

# Exit on error
set -e

echo "🔨 Building the project..."
npm run build

echo "✅ Build completed successfully!"
echo "🚀 Starting preview server..."
npm run preview

echo "🌐 Preview server is running. Press Ctrl+C to stop."
