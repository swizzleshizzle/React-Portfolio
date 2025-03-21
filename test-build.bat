@echo off
echo 🔨 Building the project...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo ❌ Build failed!
    exit /b 1
)

echo ✅ Build completed successfully!
echo 🚀 Starting preview server...
call npm run preview

if %ERRORLEVEL% neq 0 (
    echo ❌ Preview server failed to start!
    exit /b 1
)

echo 🌐 Preview server is running. Press Ctrl+C to stop.
