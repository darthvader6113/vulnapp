@echo off
echo ==============================================
echo   Building and Starting VulnLMS Containers
echo ==============================================
docker compose build --no-cache
docker compose up
pause

