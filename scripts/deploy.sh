#!/usr/bin/env bash
set -euo pipefail

# Simple deploy helper for GitHub Pages
# Usage:
#  ./scripts/deploy.sh gh-pages    # publish to gh-pages branch (force)
#  ./scripts/deploy.sh docs       # copy publish/wwwroot -> docs/ and commit to current branch

REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)
PUBLISH_DIR="$REPO_ROOT/publish/wwwroot"

if [ ! -d "$PUBLISH_DIR" ]; then
  echo "Publish directory not found. Run: dotnet publish -c Release -o publish"
  exit 1
fi

cmd=${1:-}
case "$cmd" in
  gh-pages)
    WORKTREE_DIR="$REPO_ROOT/.gh-pages-worktree"
    git worktree remove "$WORKTREE_DIR" 2>/dev/null || true
    git worktree add "$WORKTREE_DIR" gh-pages || git worktree add --checkout --detach "$WORKTREE_DIR" gh-pages
    rm -rf "$WORKTREE_DIR"/*
    cp -r "$PUBLISH_DIR"/* "$WORKTREE_DIR"/
    # Create SPA fallback 404.html from index.html if present
    if [ -f "$WORKTREE_DIR/index.html" ]; then
      cp "$WORKTREE_DIR/index.html" "$WORKTREE_DIR/404.html" || true
    fi
    pushd "$WORKTREE_DIR"
    git add --all
    git commit -m "Deploy site: $(date -Iseconds)" || echo "No changes to commit"
    git push origin gh-pages --force
    popd
    git worktree remove "$WORKTREE_DIR"
    ;;
  docs)
    rm -rf "$REPO_ROOT/docs"
    mkdir -p "$REPO_ROOT/docs"
    cp -r "$PUBLISH_DIR"/* "$REPO_ROOT/docs/"
    # Create SPA fallback 404.html from index.html if present
    if [ -f "$REPO_ROOT/docs/index.html" ]; then
      cp "$REPO_ROOT/docs/index.html" "$REPO_ROOT/docs/404.html" || true
    fi
    git add docs
    git commit -m "Publish site to docs/ (deploy)" || echo "No changes to commit"
    ;;
  *)
    echo "Usage: $0 {gh-pages|docs}"
    exit 2
    ;;
esac

echo "Done."

