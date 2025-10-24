import React, { useState, useEffect } from 'react';

const MenuCard = ({ menu }) => {
  const placeholderSvg = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            fill="#999" font-family="Arial" font-size="20">Image Holder</text>
    </svg>
  `)}`;

  const bannerSrc = menu.banner || placeholderSvg;
  const hasLink = menu.link && menu.link.trim() !== '';

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
        />
      </div>
      <div className="card-footer">
        <div className="footer-title">{menu.nama}</div>
      </div>
    </div>
  );

  if (hasLink) {
    return (
      <a className="card-link" href={menu.link} target="_blank" rel="noopener noreferrer">
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
};

function App() {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiSource, setApiSource] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching data from backend...');
        
        // Try multiple endpoints
        const endpoints = [
          { url: '/api/menu', name: 'nginx_proxy' },
          { url: 'http://localhost:5001/menu', name: 'direct_backend' }
        ];
        
        let success = false;
        
        for (const endpoint of endpoints) {
          try {
            console.log(`🔍 Trying: ${endpoint.url}`);
            const response = await fetch(endpoint.url);
            
            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                setMenuData(data.data);
                setApiSource(`${endpoint.name} (${data.source})`);
                console.log(`✅ Success with: ${endpoint.url}`);
                success = true;
                break;
              }
            }
          } catch (err) {
            console.log(`❌ Failed ${endpoint.url}:`, err.message);
          }
        }
        
        if (!success) {
          throw new Error('Unable to connect to backend');
        }
        
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        
        // Fallback data
        setTimeout(() => {
          setMenuData([
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
          ]);
          setApiSource('demo_fallback');
          setLoading(false);
        }, 1000);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app-container">
      <div className="header">
        <img 
          className="logo" 
          src="https://i.imgur.com/q0lH38R.png" 
          alt="LPI Abata Logo"
        />
        <h1>LPI Abata Leaders</h1>
        <h2>Division of Operations — We serve you better.</h2>
        
        {apiSource && (
          <div style={{ 
            background: '#f0f9ff', 
            border: '1px solid #bae6fd', 
            borderRadius: '8px', 
            padding: '8px 12px', 
            margin: '5px 0',
            color: '#0369a1',
            fontSize: '12px'
          }}>
            📡 Data source: {apiSource}
          </div>
        )}
        
        {error && (
          <div style={{ 
            background: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: '8px', 
            padding: '12px', 
            margin: '10px 0',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            ⚠️ {error} - Using demo data
          </div>
        )}
      </div>

      <div className="menu">
        {loading ? (
          <div className="text-white text-center py-8">Loading...</div>
        ) : menuData.length > 0 ? (
          menuData.map((menu) => <MenuCard key={menu.id} menu={menu} />)
        ) : (
          <p className="text-gray-400 text-center py-8">Belum ada menu.</p>
        )}
      </div>

      <div className="footer">
        Copyright © 2025
        {apiSource && <span style={{color: '#666', marginLeft: '10px'}}>• {apiSource}</span>}
      </div>
    </div>
  );
}

export default App;
