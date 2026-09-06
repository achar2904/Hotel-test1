@echo off
title Hotel Case MySQL Server
echo ===================================================
echo   Starting Hotel Case MySQL Server (Port 3306)
echo ===================================================
echo.
cd /d "%~dp0..\mysql"
if not exist "bin\mysqld.exe" (
    echo Error: mysqld.exe not found in D:\Ann\mysql\bin\
    pause
    exit /b 1
)
"bin\mysqld.exe" --defaults-file="%~dp0..\mysql\my.ini" --console
pause
