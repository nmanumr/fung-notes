#!/bin/sh
if [ -z "$1" ]
then
  echo "Please enter commit string"
  exit 1
fi
sed -i "s/#  disqus: 'fung-notes'/  disqus: 'fung-notes'/g" mkdocs.yml
python -m mkdocs build
git add site
git commit -m "$1 - build"
git subtree push --prefix site origin gh-pages
sed -i "s/  disqus: 'fung-notes'/#  disqus: 'fung-notes'/g" mkdocs.yml
