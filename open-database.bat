@echo off
chcp 65001 >nul
title Hotel Database (MariaDB / MySQL) - hotel_case_db
echo ============================================================
echo   Hotel Case Reporting System - Database Console
echo   Database: hotel_case_db  ^|  Port: 3306  ^|  User: root
echo ============================================================
echo.
echo [คำสั่งตัวอย่างที่ใช้บ่อย]
echo - SHOW TABLES;                     (ดูตารางทั้งหมด)
echo - DESCRIBE users;                  (ดูโครงสร้างตาราง users)
echo - SELECT * FROM users;             (ดูข้อมูลผู้ใช้งาน)
echo - SELECT * FROM rooms;             (ดูข้อมูลห้องพัก)
echo - SELECT * FROM cases;             (ดูข้อมูลเคส)
echo - exit                             (ออกจากโปรแกรม)
echo ------------------------------------------------------------
echo.
"D:\Ann\mysql\bin\mysql.exe" --default-character-set=utf8mb4 -u root hotel_case_db