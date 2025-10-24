const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'database',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'menu_app',
  user: process.env.DB_USER || 'lpi_user',
  password: process.env.DB_PASSWORD || 'AbataSecure123!',
};

console.log('🚀 Starting LPI Abata Backend...');
console.log('📍 Database Config:', {
  host: dbConfig.host,
  database: dbConfig.database,
  user: dbConfig.user
});

let pool;
let dbConnected = false;

// Initialize database connection
const initializeDatabase = async () => {
  try {
    pool = new Pool(dbConfig);
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    client.release();
    dbConnected = true;
    
    // Test query
    const result = await pool.query('SELECT COUNT(*) as count FROM menu');
    console.log(`📊 Database has ${result.rows[0].count} menu items`);
    
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('🔄 Continuing with static data mode...');
    dbConnected = false;
  }
};

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    if (dbConnected) {
      await pool.query('SELECT 1');
      res.json({
        status: 'OK',
        message: 'Backend and database are healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({
        status: 'OK',
        message: 'Backend is running (database not connected)',
        database: 'disconnected', 
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.json({
      status: 'OK',
      message: 'Backend running in fallback mode',
      database: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API health endpoint - FIXED: Hapus app.request yang error
app.get('/api/health', async (req, res) => {
  try {
    if (dbConnected) {
      await pool.query('SELECT 1');
      res.json({
        status: 'OK',
        message: 'Backend and database are healthy - API Endpoint',
        database: 'connected',
        timestamp: new Date().toISOString()
      });
    } else {
      res.json({
        status: 'OK', 
        message: 'Backend is running (database not connected) - API Endpoint',
        database: 'disconnected',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    res.json({
      status: 'OK',
      message: 'Backend running in fallback mode - API Endpoint',
      database: 'error',
      timestamp: new Date().toISOString()
    });
  }
});

// Menu endpoint
app.get('/api/menu', async (req, res) => {
  try {
    if (dbConnected) {
      const result = await pool.query(`
        SELECT id, nama, link, banner, icon 
        FROM menu 
        ORDER BY id
      `);
      
      return res.json({
        success: true,
        data: result.rows,
        count: result.rows.length,
        source: 'database'
      });
    }
  } catch (error) {
    console.log('Database query failed, using static data:', error.message);
  }

  // Static fallback data
  const staticData = [
    {
      id: 1,
      nama: 'Jadwalkan Perjalanan',
      link: '#',
      banner: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80',
      icon: ''
    },
    {
      id: 2,
      nama: 'Ustadz/ah Disini',
      link: '#',
      banner: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80',
      icon: ''
    },
    {
      id: 3,
      nama: 'Book a Driver',
      link: '#',
      banner: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80',
      icon: ''
    }
  ];

  res.json({
    success: true,
    data: staticData,
    count: staticData.length,
    source: 'static'
  });
});

// Direct menu endpoint (without /api)
app.get('/menu', async (req, res) => {
  try {
    if (dbConnected) {
      const result = await pool.query(`
        SELECT id, nama, link, banner, icon 
        FROM menu 
        ORDER BY id
      `);
      
      return res.json({
        success: true,
        data: result.rows,
        count: result.rows.length,
        source: 'database'
      });
    }
  } catch (error) {
    console.log('Database query failed, using static data:', error.message);
  }

  // Static fallback data
  const staticData = [
    {
      id: 1,
      nama: 'Jadwalkan Perjalanan',
      link: '#',
      banner: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80',
      icon: ''
    }
  ];

  res.json({
    success: true,
    data: staticData,
    count: staticData.length,
    source: 'static'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'LPI Abata Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      menu: '/menu',
      api_health: '/api/health',
      api_menu: '/api/menu'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Initialize and start server
const startServer = async () => {
  await initializeDatabase();
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`✅ LPI Abata Backend running on port ${port}`);
    console.log(`📍 Health: http://localhost:${port}/health`);
    console.log(`📍 API Health: http://localhost:${port}/api/health`);
    console.log(`📍 Menu: http://localhost:${port}/menu`);
    console.log(`📍 API Menu: http://localhost:${port}/api/menu`);
    console.log(`📊 Database: ${dbConnected ? 'Connected ✅' : 'Disconnected 🔄'}`);
  });
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer().catch(console.error);
