#!/usr/bin/env bash
set -e

# ── Build ─────────────────────────────────────────────────────────────────────
echo "🔨  Building..."
npm run build

# ── Deploy ────────────────────────────────────────────────────────────────────
DEPLOY_DIR=$(mktemp -d)

cleanup() {
  git worktree remove --force "$DEPLOY_DIR" 2>/dev/null || true
}
trap cleanup EXIT

echo "🚀  Preparing gh-pages branch..."
git worktree prune

if git ls-remote --exit-code origin gh-pages &>/dev/null; then
  # Branch already exists on remote — fetch it into a local ref and add worktree
  git fetch origin gh-pages:gh-pages --force 2>/dev/null || true
  git worktree add "$DEPLOY_DIR" gh-pages
else
  # First deploy — create a clean orphan branch (no history, unrelated to main)
  git branch -D gh-pages 2>/dev/null || true
  git worktree add --no-checkout "$DEPLOY_DIR" HEAD
  (cd "$DEPLOY_DIR" && git checkout --orphan gh-pages && git rm -rf . &>/dev/null || true)
fi

# Sync dist/ contents into the worktree (--delete removes stale files)
rsync -a --delete --exclude='.git' dist/ "$DEPLOY_DIR/"

# Commit and push entirely from inside the worktree
(
  cd "$DEPLOY_DIR"
  git add -A
  if git diff --cached --quiet; then
    echo "Nothing changed — skipping deploy."
  else
    git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    git push origin gh-pages --force
    echo ""
    echo "✅  Live at: https://dhawal-pandya.github.io/hisab/"
  fi
)
