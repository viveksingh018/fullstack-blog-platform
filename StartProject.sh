#!/bin/bash

# --- 1. Install Dependencies ---
echo "Installing Backend Dependencies..."
cd server
npm install &> /dev/null

echo "Starting Backend Server..."
npm start &

cd ../client
echo "Installing Frontend Dependencies..."
npm install &> /dev/null

echo "Starting Frontend Development Server..."
npm run dev &

cd ..
echo "Waiting for servers to start..."
sleep 10

echo "Opening Project in Web Browser..."
xdg-open http://localhost:5173

echo "Setup Complete. Press Ctrl+C to stop the servers later."