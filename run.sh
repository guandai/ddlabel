#!/bin/bash

git stash
git pull
npx pm2 delete all
cd frontend
yarn prod
cd ..
cd backend
yarn prod
