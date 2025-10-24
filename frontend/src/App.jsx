import React, { useState, useEffect } from 'react';
import { menuAPI } from './services/api';

// Komponen Card untuk menampilkan menu
const MenuCard = ({ menu }) => {
  const placeholderSvg = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700">
      <rect width="100%" height="100%" fill="#dcdcdc"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            fill="#b0b0b0" font-family="Arial" font-size="20">&lt;Image Holder&gt;</text>
    </svg>
  `)}`;

  const bannerSrc = menu.banner || placeholderSvg;
  const hasLink = menu.link && menu.link.trim() !== '';
  const hasIcon = menu.icon && menu.icon.trim() !== '';

  const CardContent = () => (
    <div className="card">
      <div className="image-wrapper">
        <img 
          className="card-img" 
          src={bannerSrc} 
          alt={`Banner ${menu.nama}`}
          onError={(e) => {
            e.target.src = placeholderSvg;
          }}
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </div>
      <div className="card-footer">
        {hasIcon && (
          <div className="footer-icon-wrap">
            <img 
              className="footer-icon" 
              src={menu.icon} 
              alt={`Icon ${menu.nama}`}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="footer-title">{menu.nama}</div>
      </div>
    </div>
  );

  if (hasLink) {
    return (
      <a 
        className="card-link" 
        href={menu.link} 
        target="_blank" 
        rel="noopener noreferrer"
      >
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
};

// Loading Component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="text-white text-center py-8">Loading...</div>
  </div>
);

// Error Component dengan fallback option
const ErrorMessage = ({ message, onRetry, onUseDemo }) => (
  <div className="error-container text-center py-8">
    <div className="text-red-400 mb-4 text-lg">{message}</div>
    <div className="flex flex-col gap-3 justify-center items-center">
      <button
        onClick={onRetry}
        className="retry-button bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
      >
        🔄 Coba Lagi
      </button>
      <button
        onClick={onUseDemo}
        className="demo-button bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors font-medium text-sm"
      >
        🎯 Gunakan Data Demo
      </button>
      <div className="text-gray-400 text-xs mt-2">
        Pastikan backend berjalan di port 5001
      </div>
    </div>
  </div>
);

// Data demo untuk fallback
const demoData = [
  {
    id: 1,
    nama: 'Book a Driver',
    link: 'https://script.google.com/a/macros/abata.sch.id/s/AKfycbwd0Zrt7UBoy8qpiBNoDscCZ9YCKnbuzusx5FPCyyLcfNk44DJA9CV1LeGHyEPLmS50tg/exec',
    banner: 'https://imgur.com/gvv6T20.png',
    icon: ''
  },
  {
    id: 2,
    nama: 'Book a Room',
    link: 'https://script.google.com/macros/s/AKfycbwx0qq4oqO8QSxDxWAJ0HMPIq6US4ZVRFuniCXNIo8hy1QsBawzIl5euyxXSPVE-Ckg8g/exec',
    banner: 'https://i.imgur.com/SiZi6hm.png',
    icon: ''
  },
];

// Komponen utama App
function App() {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingDemo, setUsingDemo] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching data from backend...');
      
      // Test koneksi backend dulu
      try {
        await menuAPI.healthCheck();
        console.log('✅ Backend is reachable');
      } catch (healthError) {
        console.error('❌ Backend health check failed:', healthError);
        throw new Error(`Backend tidak dapat diakses di http://localhost:5001`);
      }
      
      // Fetch menu data
      const menuResponse = await menuAPI.getMenu();
      setMenuData(menuResponse.data);
      setUsingDemo(false);
      console.log(`✅ Loaded ${menuResponse.data.length} menu items from backend`);
      
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setError(err.message || 'Gagal memuat data dari server');
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const useDemoData = () => {
    setMenuData(demoData);
    setUsingDemo(true);
    setError(null);
    setLoading(false);
    console.log('🎯 Using demo data');
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <img 
          className="logo" 
          src="https://i.imgur.com/q0lH38R.png" 
          alt="LPI Abata Logo"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iNTAiIGZpbGw9IiMzMzMiLz4KPHN2ZyB4PSIyNSIgeT0iMjUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NjYiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Ik0xMiAxMk0xMiAxNk0xMiAyME0xMiA4TTEyIDRaIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=';
          }}
        />
        <h1>LPI Abata Leaders</h1>
        <h2>Division of Operations — We serve you better.</h2>
        
        {/* Status Indicator */}
        {usingDemo && (
          <div className="demo-indicator">
            <span className="demo-badge">Demo Mode</span>
          </div>
        )}
      </div>

      {/* Menu Container */}
      <div className="menu">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage 
            message={error} 
            onRetry={fetchData}
            onUseDemo={useDemoData}
          />
        ) : menuData.length > 0 ? (
          <>
            {usingDemo && (
              <div className="demo-warning">
                <div className="warning-icon">⚠️</div>
                <div className="warning-text">
                  Menggunakan data demo. Pastikan backend berjalan untuk data real.
                </div>
              </div>
            )}
            {menuData.map((menu) => (
              <MenuCard key={menu.id} menu={menu} />
            ))}
          </>
        ) : (
          <p className="no-menu-text">Belum ada menu.</p>
        )}
      </div>

      {/* Footer */}
      <div className="footer">
        Copyright © 2025 LPI Abata
        {usingDemo && <span className="demo-footer"> • Demo Mode</span>}
      </div>
    </div>
  );
}

export default App;
