#!/bin/bash

short_commit=$(git rev-parse --short HEAD)

yarn build
git add .
git commit -m "deploy ${short_commit}"
git push

# USER="ubuntu"
# HOST="34.235.102.89"
# COMMAND="cd /git/ddlabel && ./run.sh"

# # Run the command on the remote host using SSH
# ssh $USER@$HOST "$COMMAND"

