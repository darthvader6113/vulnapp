#!/usr/bin/env bash
echo "=============================================="
echo "  Building and Starting VulnLMS Containers"
echo "=============================================="
npm run build
docker compose up --build
