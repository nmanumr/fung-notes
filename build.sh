#!/bin/sh
if [ -z "$1" ]
then
  echo "Please enter commit string"
  exit 1
fi

# push docs changes
git add --all
git commit -m "$1"
git push

# build and push gh-pages changes
pipenv run python -m mkdocs build

ls | grep -v .git | xargs rm -r
cp -r ./site/ ../gh-pages/
cd ../gh-pages

git add --all
git commit -m "$1 - build"
git push