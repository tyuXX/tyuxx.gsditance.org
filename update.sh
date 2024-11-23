#!/bin/bash
# Pull updates for all submodules
git submodule foreach git pull origin main

# Stage and commit changes
git add .
git commit -m "Updated all submodules to latest versions"
git push origin main
