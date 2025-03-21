@echo off
setlocal enabledelayedexpansion

:: Default values
set BRANCH=main

:: Parse command line arguments
:parse_args
if "%~1"=="" goto :end_parse_args
if "%~1"=="-b" (
    set BRANCH=%~2
    shift
    shift
    goto :parse_args
)
if "%~1"=="--branch" (
    set BRANCH=%~2
    shift
    shift
    goto :parse_args
)
if "%~1"=="-h" (
    call :display_usage
    exit /b 0
)
if "%~1"=="--help" (
    call :display_usage
    exit /b 0
)
echo Unknown option: %~1
call :display_usage
exit /b 1

:end_parse_args

echo 🚀 Deploying branch: %BRANCH%

:: Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Git is not installed. Please install git and try again.
    exit /b 1
)

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ npm is not installed. Please install Node.js and npm, then try again.
    exit /b 1
)

:: Ensure we're on the correct branch
echo 📋 Checking out branch: %BRANCH%
git checkout %BRANCH%
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to checkout branch %BRANCH%
    exit /b 1
)

:: Pull latest changes
echo ⬇️ Pulling latest changes
git pull origin %BRANCH%
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to pull latest changes
    exit /b 1
)

:: Install dependencies
echo 📦 Installing dependencies
call npm install --legacy-peer-deps
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

:: Build the project
echo 🔨 Building the project
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ❌ Build failed
    exit /b 1
)

echo ✅ Build completed successfully!
echo 📂 The build files are in the 'dist' directory
echo.
echo To deploy to your web server, you can use:
echo   - Copy the 'dist' directory to your web server
echo   - Set up a CI/CD pipeline to automate deployment
echo.
echo Remember to configure your web server to handle client-side routing:
echo   - For Apache, ensure .htaccess is properly configured
echo   - For Nginx, configure try_files to redirect to index.html

exit /b 0

:display_usage
echo Usage: %~nx0 [options]
echo Options:
echo   -b, --branch ^<branch^>   Specify the branch to deploy (default: main)
echo   -h, --help              Display this help message
exit /b 0
