@echo off
title Start Hotel Case System
echo ===================================================
echo   Launching Hotel Case: MySQL, Web Server, Tunnel
echo ===================================================
echo.
cd /d "%~dp0"
start "Hotel Case MySQL" cmd /c "scripts\start-mysql.bat"
timeout /t 3 /nobreak >nul
start "Hotel Case Server" cmd /c "scripts\start-server.bat"
timeout /t 2 /nobreak >nul
start "Cloudflare Tunnel" cmd /c "scripts\start-tunnel.bat"
echo.
echo All 3 services (MySQL, Web Server, Cloudflare Tunnel) are now running!
