import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const UrlList = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState('');

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await axiosInstance.get('/api/urls');
      setUrls(response.data);
      setLoading(false);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลได้');
      setLoading(false);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('คุณต้องการลบ URL นี้หรือไม่?')) return;

    try {
      await axiosInstance.delete(`/api/urls/${id}`);
      setUrls(urls.filter(url => url._id !== id));
    } catch (err) {
      alert('ไม่สามารถลบได้');
      console.error(err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="card"><div className="loading">กำลังโหลด...</div></div>;
  }

  if (error) {
    return <div className="card"><div className="error">{error}</div></div>;
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: '20px', color: '#2d3748' }}>
        ประวัติ URL ทั้งหมด ({urls.length})
      </h2>

      {urls.length === 0 ? (
        <div className="empty-state">
          <h3>ยังไม่มีข้อมูล</h3>
          <p>เริ่มสร้าง Short URL แรกของคุณเลย!</p>
        </div>
      ) : (
        <div className="url-list">
          {urls.map((url) => (
            <div key={url._id} className="url-item">
              <div className="url-item-header">
                <div className="url-info">
                  <div className="url-original">
                    <strong>URL ต้นฉบับ:</strong> {url.originalUrl}
                  </div>
                  <div className="url-short">
                    <strong>Short URL:</strong>{' '}
                    <a 
                      href={url.shortUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {url.shortUrl}
                    </a>
                  </div>
                  <div className="url-meta">
                    <span>👁️ คลิก: {url.clicks} ครั้ง</span>
                    <span>📅 สร้างเมื่อ: {formatDate(url.createdAt)}</span>
                    {url.lastAccessed && (
                      <span>🕐 เข้าถึงล่าสุด: {formatDate(url.lastAccessed)}</span>
                    )}
                  </div>
                </div>
                <div>
                  <button 
                    onClick={() => handleDelete(url._id)}
                    className="btn btn-danger"
                  >
                    ลบ
                  </button>
                </div>
              </div>
              
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <img 
                  src={url.qrCode} 
                  alt="QR Code" 
                  style={{ maxWidth: '150px', borderRadius: '8px' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UrlList;