# LPI Abata Web Application

A modern web application for LPI Abata built with React, Node.js, and PostgreSQL.

## 🚀 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Deployment**: Docker + Docker Compose
- **Proxy**: Nginx Proxy Manager

## 📁 Project Structure

lpi-abata-webapp/
├── frontend/ # React application
├── backend/ # Node.js API server
├── database/ # PostgreSQL init scripts
├── nginx/ # Nginx configuration
├── docker-compose.yml # Docker orchestration
└── README.md

## 🛠️ Quick Start

### Prerequisites
- Docker
- Docker Compose

### Development
```bash
# Clone repository
git clone https://github.com/khidir-jkt48/lpi-abata-webapp.git
cd lpi-abata-webapp

# Copy environment file
cp .env.example .env

# Start services
docker-compose up -d

# Access application
# Frontend: http://localhost
# Backend API: http://localhost:5001
# NPM Admin: http://localhost:81
🌐 Production Deployment
Setup domain in Nginx Proxy Manager

Configure SSL certificates

Set environment variables

Run docker-compose up -d

📝 Environment Variables
Copy .env.example to .env and configure:
# Database
DB_HOST=database
DB_PORT=5432
DB_NAME=menu_app
DB_USER=lpi_user
DB_PASSWORD=your_secure_password

# Backend
BACKEND_PORT=5001
NODE_ENV=production
🔧 API Endpoints
GET /api/health - Health check

GET /api/menu - Get menu items

GET /health - Backend health

GET /menu - Direct menu endpoint

📄 License
MIT License - see LICENSE file for details
