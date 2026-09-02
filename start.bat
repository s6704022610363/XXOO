@echo off
title เกม XO (Tic-Tac-Toe 3x3)
echo ======================================================
echo   [RUN] เริ่มต้นรันเว็บแอป เกม XO (Tic-Tac-Toe 3x3)
echo ======================================================

if not exist "node_modules\" (
    echo [INFO] กำลังติดตั้ง dependencies (npm install)... กรุณารอสักครู่
    call npm install
)

echo [INFO] กำลังเปิด Dev Server...
call npm run dev
pause
