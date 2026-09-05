@echo off
title Start Hotel Case System
echo ===================================================
echo   Launching Hotel Case Server and Cloudflare Tunnel
echo ===================================================
echo.
cd /d "%~dp0"
start "Hotel Case Server" cmd /c "scripts\start-server.bat"
timeout /t 2 /nobreak >nul
start "Cloudflare Tunnel" cmd /c "scripts\start-tunnel.bat"
echo.
echo Done! Both services are now running in separate windows.
