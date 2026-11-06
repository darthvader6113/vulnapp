@echo off
echo ==============================================
echo   Building and Starting VulnLMS Containers
echo ==============================================
call npm run build
docker compose up --build
pause
