import React, { useState } from 'react';
import UrlShortener from './components/UrlShortener';
import UrlList from './components/UrlList';
import Statistics from './components/Statistics';

function App() {
  const [activeTab, setActiveTab] = useState('shorten');

  return (
    <div className="container">
      <h1>🔗 ระบบย่อ URL</h1>
      
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'shorten' ? 'active' : ''}`}
          onClick={() => setActiveTab('shorten')}
        >
          สร้าง Short URL
        </button>
        <button 
          className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          ประวัติ URL
        </button>
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          สถิติ
        </button>
      </div>

      {activeTab === 'shorten' && <UrlShortener />}
      {activeTab === 'list' && <UrlList />}
      {activeTab === 'stats' && <Statistics />}
    </div>
  );
}

export default App;