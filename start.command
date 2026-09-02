#!/bin/bash
cd "$(dirname "$0")"

echo "======================================================"
echo "  🚀 เริ่มต้นรันเว็บแอป เกม XO (Tic-Tac-Toe 3x3)"
echo "======================================================"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 กำลังติดตั้ง dependencies (npm install)... กรุณารอสักครู่"
    npm install
fi

echo "🌐 กำลังเริ่ม Dev Server..."
npm run dev
