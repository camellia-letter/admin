#!/bin/bash
# Setup .npmrc for GitHub Package Registry authentication

if [ -n "$NPM_TOKEN" ]; then
  echo "Setting up .npmrc with NPM_TOKEN..."
  cat > .npmrc << EOF
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
@camellia-letter:registry=https://npm.pkg.github.com
EOF
  echo ".npmrc created successfully"
else
  echo "Warning: NPM_TOKEN environment variable is not set"
  exit 1
fi
