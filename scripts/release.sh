#!/usr/bin/env sh
# Usage: yarn release <version>   (e.g. yarn release 3.0.0-rc17)
# Bumps client/package.json, commits, tags v<version> and pushes both.
set -e

version="$1"
tag="v${version}"
package_file="client/package.json"

cd "$(git rev-parse --show-toplevel)"

if ! echo "$version" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+(-rc[0-9]+)?$'; then
  echo "Usage: yarn release <version>  (e.g. 3.0.0 or 3.0.0-rc17)" >&2
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is not clean, commit or stash your changes first." >&2
  exit 1
fi

if git rev-parse -q --verify "refs/tags/${tag}" >/dev/null; then
  echo "Tag ${tag} already exists." >&2
  exit 1
fi

branch=$(git rev-parse --abbrev-ref HEAD)
current_version=$(grep '"version"' "$package_file" | head -1 | sed 's/.*: *"//;s/".*//')

printf "Release %s from branch '%s' (current version: %s)? [y/N] " "$tag" "$branch" "$current_version"
read -r answer
if [ "$answer" != "y" ] && [ "$answer" != "Y" ]; then
  echo "Aborted."
  exit 1
fi

if [ "$current_version" != "$version" ]; then
  node -e '
    const fs = require("fs")
    const [file, version] = process.argv.slice(1)
    const content = fs.readFileSync(file, "utf8")
    fs.writeFileSync(file, content.replace(/"version": *"[^"]*"/, `"version": "${version}"`))
  ' "$package_file" "$version"
  git add "$package_file"
  git commit -m "chore: bump version to ${version}"
fi

git tag "$tag"
git push --atomic origin "$branch" "refs/tags/${tag}"

echo "Released ${tag}."
