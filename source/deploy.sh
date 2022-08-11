#!/bin/sh
quasar build -m pwa
cd ..
cp -r source/dist/pwa/* public_html/
cd public_html
git add -A
git commit -m "update"
git push
