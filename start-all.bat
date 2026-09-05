@echo off
title Start Hotel Case System
echo Launching Web Server and Cloudflare Tunnel...
start "Hotel Case Server" cmd /c "D:\Ann\start-server.bat"
timeout /t 2 /nobreak >nul
start "Cloudflare Tunnel" cmd /c "D:\Ann\start-tunnel.bat"
echo Done! Both services have been started in separate windows.
