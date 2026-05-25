#!/usr/bin/env bash
#
# post-commit.sh — auto-deploy to gh-pages after every commit on main
#
# This file is the *source* for .git/hooks/post-commit. It lives in scripts/
# so it's tracked by git and survives fresh clones.
#
# Activate on any machine with:
#   npm run setup
#
# HOW IT WORKS
# ─────────────────────────────────────────────────────────────────────────────
# Git runs .git/hooks/post-commit automatically after every successful commit.
# This script:
#   1. Exits silently if not on the main branch (feature branches, etc.)
#   2. Checks GitHub SSH access — deploys are a no-op without it, so we fail
#      fast with a clear fix guide rather than a cryptic git error mid-build.
#   3. Calls `npm run deploy`, which builds the project and pushes dist/ to
#      the gh-pages branch (see scripts/deploy.sh for how that works).
#
# The post-commit hook fires *after* the commit is recorded, so a deploy
# failure never rolls back or blocks your commit.
# ─────────────────────────────────────────────────────────────────────────────

CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)

# Only deploy from main
[ "$CURRENT_BRANCH" = "main" ] || exit 0

echo ""
echo "📦  Commit on main — running deploy..."

# ── SSH check ────────────────────────────────────────────────────────────────
# ssh -T exits with code 1 even on success ("Hi user!"), so we check the
# message, not the exit code.
SSH_RESULT=$(ssh -o ConnectTimeout=5 -T git@github.com 2>&1)

if ! echo "$SSH_RESULT" | grep -q "successfully authenticated"; then
  echo ""
  echo "⚠️   GitHub SSH access not available on this machine."
  echo "     Deploy skipped. Here's how to fix it:"
  echo ""
  echo "  1. Generate a key (skip if you already have one):"
  echo "       ssh-keygen -t ed25519 -C \"you@example.com\""
  echo ""
  echo "  2. Copy your public key to the clipboard:"
  echo "       cat ~/.ssh/id_ed25519.pub | pbcopy"
  echo "       # or if you have an older rsa key:"
  echo "       cat ~/.ssh/id_rsa.pub | pbcopy"
  echo ""
  echo "  3. Add it to GitHub:"
  echo "       https://github.com/settings/ssh/new"
  echo "       → paste the key → Save"
  echo ""
  echo "  4. Verify it works:"
  echo "       ssh -T git@github.com"
  echo "       # should print: Hi <username>! You've successfully authenticated..."
  echo ""
  echo "  Once SSH is set up, deploy manually this time:"
  echo "       npm run deploy"
  echo ""
  exit 0
fi

# ── Deploy ───────────────────────────────────────────────────────────────────
npm run deploy
