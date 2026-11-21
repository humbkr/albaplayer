#!/usr/bin/env sh
# Usage: check-tag-version.sh <tag> [<commit-ish>]
# Fails if the version in client/package.json at <commit-ish> (default: HEAD)
# does not match <tag> (with its leading "v" removed).

tag="$1"
rev="${2:-HEAD}"

if [ -z "$tag" ]; then
  echo "Usage: $0 <tag> [<commit-ish>]" >&2
  exit 2
fi

tag_version="${tag#v}"
package_version=$(git show "${rev}:client/package.json" | grep '"version"' | head -1 | sed 's/.*: *"//;s/".*//')

if [ "$package_version" != "$tag_version" ]; then
  echo "Tag ${tag} does not match client/package.json version (${package_version})." >&2
  echo "Bump the version before tagging, or use: yarn release ${tag_version}" >&2
  exit 1
fi
