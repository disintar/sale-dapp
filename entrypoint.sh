#!/bin/sh -l

echo "node_modules" >> .gitignore

git config --global --add safe.directory /github/workspace
git config --global user.name "dApp builder"
git config --global user.email "username@users.noreply.github.com"
git config --global init.defaultBranch gh-pages

git init
git remote add origin https://tvorogme:${1}@github.com/disintar/sale-dapp.git
git add .
git commit -a -m "Update dApp"
git push --force origin gh-pages
