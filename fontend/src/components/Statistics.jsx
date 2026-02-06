import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError('ไม่สามารถโหลดสถิติได้');
      setLoading(false);
      console.error(err);
    }
  };

  if (loading) {
    return <div className="card"><div className="loading">กำลังโหลดสถิติ...</div></div>;
  }

  if (error) {
    return <div className="card"><div className="error">{error}</div></div>;
  }

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalUrls}</div>
          <div className="stat-label">จำนวน URL ทั้งหมด</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{stats.totalClicks}</div>
          <div className="stat-label">จำนวนคลิกทั้งหมด</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">
            {stats.totalUrls > 0 
              ? (stats.totalClicks / stats.totalUrls).toFixed(1)
              : '0'}
          </div>
          <div className="stat-label">ค่าเฉลี่ยคลิกต่อ URL</div>
        </div>
      </div>

      {stats.mostClicked.length > 0 && (
        <div className="card">
          <div className="most-clicked">
            <h3>🔥 URL ยอดนิยม (5 อันดับแรก)</h3>
            <div className="url-list">
              {stats.mostClicked.map((url, index) => (
                <div key={url._id} className="url-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    <div style={{ 
                      fontSize: '2rem', 
                      fontWeight: 'bold',
                      color: index === 0 ? '#f6ad55' : index === 1 ? '#cbd5e0' : index === 2 ? '#fc8181' : '#a0aec0',
                      minWidth: '50px'
                    }}>
                      #{index + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div className="url-original" style={{ marginBottom: '5px' }}>
                        {url.originalUrl}
                      </div>
                      <div className="url-short">
                        <a 
                          href={url.shortUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {url.shortUrl}
                        </a>
                      </div>
                    </div>
                    <div style={{ 
                      background: '#667eea', 
                      color: 'white', 
                      padding: '10px 20px', 
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}>
                      {url.clicks} คลิก
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;