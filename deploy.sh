#!/bin/bash

latest_commit=$(git rev-parse HEAD)

yarn build
git add .
git commit -m "deploy ${latest_commit}"

# npx pm2 delete all
# yarn prod
