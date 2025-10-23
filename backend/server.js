const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

console.log('🚀 Starting LPI Abata Backend...');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

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
    dbConnected = false;
  }
};

// Health check endpoint
app.get('/health', async (req, res) => {
  console.log('🏥 Health check requested');
  if (dbConnected) {
    try {
      await pool.query('SELECT 1');
      res.json({
        status: 'OK',
        message: 'Backend and database are healthy',
        database: 'connected',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({
        status: 'ERROR',
        message: 'Database connection lost',
        timestamp: new Date().toISOString()
      });
    }
  } else {
    res.json({
      status: 'OK',
      message: 'Backend is running (database not connected)',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// Menu endpoint
app.get('/menu', async (req, res) => {
  console.log('📝 Menu data requested');
  if (dbConnected) {
    try {
      const result = await pool.query(`
        SELECT id, nama, link, banner, icon 
        FROM menu 
        ORDER BY id
      `);
      
      res.json({
        success: true,
        data: result.rows,
        count: result.rows.length,
        source: 'database'
      });
    } catch (error) {
      console.log('Database query failed:', error.message);
      // Fall through to static data
    }
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
    }
  ];

  res.json({
    success: true,
    data: staticData,
    count: staticData.length,
    source: 'static'
  });
});

// ✅ FIXED: API endpoints untuk nginx proxy
app.get('/api/health', async (req, res) => {
  console.log('🔧 API Health check requested');
  // Panggil health endpoint utama
  const healthResponse = await app._router.handle({ url: '/health', method: 'GET' });
  res.json({
    status: 'OK',
    message: 'API Health check',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

app.get('/api/menu', async (req, res) => {
  console.log('🔧 API Menu requested');
  // Redirect ke menu endpoint utama
  const menuResponse = await app._router.handle({ url: '/menu', method: 'GET' });
  res.json({
    success: true,
    data: menuResponse.data || [],
    count: menuResponse.count || 0,
    source: 'api_proxy'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  console.log('🏠 Root endpoint requested');
  res.json({
    message: 'LPI Abata Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      menu: '/menu',
      api_health: '/api/health',
      api_menu: '/api/menu'
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    requested_url: req.originalUrl,
    available_endpoints: ['/', '/health', '/menu', '/api/health', '/api/menu']
  });
});

// Initialize and start server
const startServer = async () => {
  await initializeDatabase();
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`✅ LPI Abata Backend running on port ${port}`);
    console.log(`📍 Health: http://localhost:${port}/health`);
    console.log(`📍 Menu: http://localhost:${port}/menu`);
    console.log(`📍 API Health: http://localhost:${port}/api/health`);
    console.log(`📍 API Menu: http://localhost:${port}/api/menu`);
    console.log(`📊 Database: ${dbConnected ? 'Connected ✅' : 'Disconnected 🔄'}`);
  });
};

startServer().catch(console.error);
