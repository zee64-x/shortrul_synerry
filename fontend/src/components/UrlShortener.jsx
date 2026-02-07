import React, { useState } from 'react';
import axiosInstance from '../api/axiosConfig';

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!originalUrl) {
      setError('กรุณากรอก URL');
      return;
    }

    // ตรวจสอบรูปแบบ URL
    try {
      new URL(originalUrl);
    } catch {
      setError('กรุณากรอก URL ที่ถูกต้อง (ต้องขึ้นต้นด้วย http:// หรือ https://)');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/shorten', { originalUrl });
      setResult(response.data);
      setOriginalUrl('');
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ marginBottom: '20px', color: '#2d3748' }}>สร้าง Short URL</h2>
      
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="url-form">
        <input
          type="text"
          className="url-input"
          placeholder="กรอก URL ที่ต้องการย่อ (เช่น https://www.example.com)"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'กำลังสร้าง...' : 'สร้าง Short URL'}
        </button>
      </form>

      {result && (
        <div className="result-box">
          <h3 style={{ marginBottom: '15px', color: '#2d3748' }}>✅ สร้างสำเร็จ!</h3>
          
          <div className="result-item">
            <div className="result-label">URL ต้นฉบับ:</div>
            <div className="result-value">{result.originalUrl}</div>
          </div>

          <div className="result-item">
            <div className="result-label">Short URL:</div>
            <div className="result-value">
              <a 
                href={result.shortUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="result-link"
              >
                {result.shortUrl}
              </a>
            </div>
          </div>

          <div className="qr-code">
            <div className="result-label" style={{ marginBottom: '10px' }}>QR Code:</div>
            <img src={result.qrCode} alt="QR Code" />
            <div style={{ marginTop: '10px' }}>
              <a 
                href={result.qrCode} 
                download={`qrcode-${result.shortCode}.png`}
                className="btn btn-primary"
                style={{ display: 'inline-block', padding: '10px 20px', fontSize: '14px' }}
              >
                ดาวน์โหลด QR Code
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlShortener;