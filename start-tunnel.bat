@echo off
title Cloudflare Quick Tunnel
echo Starting Cloudflare Quick Tunnel for http://localhost:8080...
cd /d "D:\Ann\tunnel"
"D:\Ann\tunnel\cloudflared.exe" tunnel --url http://localhost:8080
pause
