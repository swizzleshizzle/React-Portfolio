@echo off
setlocal enabledelayedexpansion

:: Default values
set BRANCH=main
set COMMIT_MSG=Update portfolio

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
if "%~1"=="-m" (
    set COMMIT_MSG=%~2
    shift
    shift
    goto :parse_args
)
if "%~1"=="--message" (
    set COMMIT_MSG=%~2
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

echo 🔍 Checking Git status...
git status

echo.
echo 📝 Do you want to add all changes? (Y/N)
set /p ADD_ALL=

if /i "%ADD_ALL%"=="Y" (
    echo ➕ Adding all changes...
    git add .
) else (
    echo 🔄 Please add your changes manually and then run 'git commit' and 'git push'.
    exit /b 0
)

echo.
echo 💾 Committing changes with message: "%COMMIT_MSG%"
git commit -m "%COMMIT_MSG%"

if %ERRORLEVEL% neq 0 (
    echo ❌ Commit failed!
    exit /b 1
)

echo.
echo 🚀 Pushing to branch: %BRANCH%
git push origin %BRANCH%

if %ERRORLEVEL% neq 0 (
    echo ❌ Push failed!
    exit /b 1
)

echo.
echo ✅ Changes successfully pushed to %BRANCH%!
echo 🌐 Your changes will be deployed according to your server configuration.

exit /b 0

:display_usage
echo Usage: %~nx0 [options]
echo Options:
echo   -b, --branch ^<branch^>     Specify the branch to push to (default: main)
echo   -m, --message ^<message^>   Specify the commit message (default: "Update portfolio")
echo   -h, --help                Display this help message
exit /b 0
