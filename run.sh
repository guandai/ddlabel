#!/bin/bash

git stash
git pull
npx pm2 delete all
yarn prod
