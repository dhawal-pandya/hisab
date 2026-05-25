#!/usr/bin/env bash
#
# deploy.sh — build and publish to GitHub Pages without leaving your branch
#
# HOW IT WORKS
# ─────────────────────────────────────────────────────────────────────────────
# The problem: GitHub Pages wants a branch (gh-pages) that contains only the
# built files at its root. But your built files live in dist/, which is
# gitignored on main. Normally you'd have to switch branches, copy files,
# commit, push, then switch back — or use drag-and-drop on the GitHub UI.
#
# The solution uses two ideas:
#
# 1. git worktree
#    Git lets you check out a *different branch* into a *different directory*
#    at the same time, sharing the same .git object store. We mount gh-pages
#    into a temp dir ($DEPLOY_DIR), drop the built files there, commit, and
#    push — all while you stay on main. The temp dir is cleaned up on exit
#    via a bash trap, so a crash or Ctrl-C never leaves a mess behind.
#
#    First deploy: gh-pages doesn't exist yet, so we create it as an orphan
#    branch (no shared history with main — it's a completely separate root
#    commit, just like gh-pages is supposed to be).
#
#    Subsequent deploys: we fetch the existing gh-pages branch from origin,
#    add it as a worktree, rsync the new build over it, commit the diff, and
#    force-push. Only the changed files appear in the commit.
#
# 2. base: './' in vite.config.js
#    Vite's default builds absolute asset paths (/assets/index.js). When your
#    site is hosted at username.github.io/repo-name/, the browser looks for
#    those files at the domain root — wrong subdirectory, instant 404.
#    Setting base: './' makes every path relative (./assets/index.js), so
#    assets resolve correctly regardless of the hosting subdirectory.
#
# REUSING IN OTHER VITE PROJECTS
# ─────────────────────────────────────────────────────────────────────────────
# 1. Copy this file to scripts/deploy.sh in your project.
# 2. Add to package.json scripts: "deploy": "bash scripts/deploy.sh"
# 3. Add to vite.config.js:  base: './'
# 4. Run: npm run deploy
#
# That's it. No extra npm packages needed. Requires: git, rsync (both
# available on macOS and most Linux systems out of the box).
# ─────────────────────────────────────────────────────────────────────────────

set -e

# ── Build ─────────────────────────────────────────────────────────────────────
echo "🔨  Building..."
npm run build

# ── Deploy ────────────────────────────────────────────────────────────────────
DEPLOY_DIR=$(mktemp -d)

# Always clean up the worktree on exit, even if the script crashes
cleanup() {
  git worktree remove --force "$DEPLOY_DIR" 2>/dev/null || true
}
trap cleanup EXIT

echo "🚀  Preparing gh-pages branch..."

# Prune any stale worktree references left by previous interrupted runs
git worktree prune

if git ls-remote --exit-code origin gh-pages &>/dev/null; then
  # Branch exists on remote — fetch it into a local ref and mount as worktree
  git fetch origin gh-pages:gh-pages --force 2>/dev/null || true
  git worktree add "$DEPLOY_DIR" gh-pages
else
  # First deploy — create a clean orphan branch (no shared history with main)
  git branch -D gh-pages 2>/dev/null || true
  git worktree add --no-checkout "$DEPLOY_DIR" HEAD
  (cd "$DEPLOY_DIR" && git checkout --orphan gh-pages && git rm -rf . &>/dev/null || true)
fi

# Sync dist/ into the worktree. --delete removes stale files from previous
# builds. --exclude='.git' protects the worktree pointer file (it's a file,
# not a directory, in a worktree — rsync --delete would wipe it otherwise).
rsync -a --delete --exclude='.git' dist/ "$DEPLOY_DIR/"

# Commit and push from inside the worktree
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
