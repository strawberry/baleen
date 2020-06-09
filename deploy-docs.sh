#!/usr/bin/env sh

# set -e

yarn docs:build

cd docs/.vuepress/dist

git init
git add -A
git commit -m 'Deploy docs.'

git push -f git@github.com:strawberry/baleen master:gh-pages

cd -
