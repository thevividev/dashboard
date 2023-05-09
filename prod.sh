#!/bin/bash

if [ -d "dist" ]; then
  sudo rm -rf dist
fi

npm install
npm run build

sudo rm -rf /var/www/html/thevivi-dashboard/
sudo mv dist/dashboard dist/thevivi-dashboard
sudo cp -r dist/thevivi-dashboard/ /var/www/html/
