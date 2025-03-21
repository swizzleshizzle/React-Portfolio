#!/bin/bash

# Default values
BRANCH="main"
COMMIT_MSG="Update portfolio"

# Display script usage
display_usage() {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  -b, --branch <branch>     Specify the branch to push to (default: main)"
  echo "  -m, --message <message>   Specify the commit message (default: \"Update portfolio\")"
  echo "  -h, --help                Display this help message"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -b|--branch)
      BRANCH="$2"
      shift
      shift
      ;;
    -m|--message)
      COMMIT_MSG="$2"
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

echo "🔍 Checking Git status..."
git status

echo
read -p "📝 Do you want to add all changes? (Y/N) " ADD_ALL

if [[ $ADD_ALL =~ ^[Yy]$ ]]; then
  echo "➕ Adding all changes..."
  git add .
else
  echo "🔄 Please add your changes manually and then run 'git commit' and 'git push'."
  exit 0
fi

echo
echo "💾 Committing changes with message: \"$COMMIT_MSG\""
git commit -m "$COMMIT_MSG"

if [ $? -ne 0 ]; then
  echo "❌ Commit failed!"
  exit 1
fi

echo
echo "🚀 Pushing to branch: $BRANCH"
git push origin $BRANCH

if [ $? -ne 0 ]; then
  echo "❌ Push failed!"
  exit 1
fi

echo
echo "✅ Changes successfully pushed to $BRANCH!"
echo "🌐 Your changes will be deployed according to your server configuration."
