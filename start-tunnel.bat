@echo off
title Cloudflare Tunnel Connector
echo Connecting Cloudflare Tunnel to Zero Trust...
cd /d "D:\Ann\tunnel"
"D:\Ann\tunnel\cloudflared.exe" tunnel run --token eyJhIjoiMzBiOGIwMTVmYjc5ZmFkM2E4YWE0ZWE1MGQ4YWViZjIiLCJ0IjoiZGJjMmE2YWItZDc4OS00YjE5LTk3NmMtNmMwMmE3YTNkNWY3IiwicyI6IlptRmtZV0V5TURJdFltRmpaUzAwTlRsbExXSm1PR0l0TURFNU5USTBZVFkxTmpRNSJ9
pause
