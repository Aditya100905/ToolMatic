import React, { useState, useEffect } from 'react';

const FullURLShortener = ({ theme = 'light' }) => {
  // State management
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const [urlHistory, setUrlHistory] = useState([]);
  const [qrCode, setQrCode] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [expiryDays, setExpiryDays] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [urlStats, setUrlStats] = useState(null);
  const [viewMode, setViewMode] = useState('create'); // 'create' or 'history'
  
  // Define localStorage key for consistency
  const STORAGE_KEY = 'shortenedUrls';
  
  // Define theme-based colors
  const themeColors = {
    background: theme === 'light' ? 'bg-gray-50' : 'bg-black',
    card: theme === 'light' ? 'bg-white' : 'bg-gray-800',
    text: theme === 'light' ? 'text-gray-800' : 'text-gray-100',
    secondaryText: theme === 'light' ? 'text-gray-600' : 'text-gray-400',
    inputBg: theme === 'light' ? 'bg-gray-50' : 'bg-gray-700',
    inputBorder: theme === 'light' ? 'border-gray-300' : 'border-gray-600',
    inputText: theme === 'light' ? 'text-gray-900' : 'text-gray-100',
    buttonPrimary: theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800',
    buttonSecondary: theme === 'light' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : 'bg-gray-700 hover:bg-gray-600 text-gray-100',
    tabActive: theme === 'light' ? 'bg-white text-blue-600 border-blue-600' : 'bg-gray-800 text-blue-400 border-blue-500',
    tabInactive: theme === 'light' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-gray-700 text-gray-400 hover:bg-gray-600',
    divider: theme === 'light' ? 'border-gray-200' : 'border-gray-700',
    success: theme === 'light' ? 'text-green-600 bg-green-50' : 'text-green-400 bg-green-900/30',
    error: theme === 'light' ? 'text-red-600 bg-red-50' : 'text-red-400 bg-red-900/30',
    statsBar: theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/40',
    statsProgress: theme === 'light' ? 'bg-blue-500' : 'bg-blue-600',
    shadow: theme === 'light' ? 'shadow-md' : 'shadow-lg shadow-gray-900/30',
  };

  // Load saved URLs from localStorage on component mount
  useEffect(() => {
    try {
      const savedUrls = localStorage.getItem(STORAGE_KEY);
      if (savedUrls) {
        const parsedUrls = JSON.parse(savedUrls);
        // Validate the structure of the data
        if (Array.isArray(parsedUrls)) {
          setUrlHistory(parsedUrls);
          console.log('Loaded URL history from localStorage:', parsedUrls.length, 'items');
        } else {
          console.error('Stored URL history is not an array, resetting');
          localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
          setUrlHistory([]);
        }
      }
    } catch (err) {
      console.error('Error loading URL history from localStorage:', err);
      // Reset localStorage if data is corrupted
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      setUrlHistory([]);
    }
  }, []);

  // Save URLs to localStorage when history changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(urlHistory));
      console.log('Saved URL history to localStorage:', urlHistory.length, 'items');
    } catch (err) {
      console.error('Error saving URL history to localStorage:', err);
      setError('Failed to save history. Storage might be full.');
    }
  }, [urlHistory]);

  // Generate a QR code using a public QR code API
  const generateQRCode = (url) => {
    // Using the QR Server API which supports CORS
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=300x300&color=${theme === 'light' ? '0-0-0' : '255-255-255'}&bgcolor=${theme === 'light' ? '255-255-255' : '31-41-55'}`;
    
    setQrCode(qrCodeUrl);
    setShowQR(true);
  };

  // Function to generate a short URL
  const shortenUrl = () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    // Validate URL
    try {
      new URL(url);
    } catch (err) {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    // Generate random string for short URL unless custom alias is provided
    let urlCode = customAlias;
    
    if (!urlCode) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      urlCode = '';
      for (let i = 0; i < 6; i++) {
        urlCode += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    }

    // Use TinyURL API as an alternative that works without backend
    fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`)
      .then(response => response.text())
      .then(tinyUrl => {
        // Create current timestamp
        const timestamp = new Date().toISOString();
        
        // Calculate expiry date if set
        let expiryDate = null;
        if (expiryDays > 0) {
          const date = new Date();
          date.setDate(date.getDate() + parseInt(expiryDays));
          expiryDate = date.toISOString();
        }
        
        // Add to history
        const newUrlEntry = {
          id: Date.now(),
          originalUrl: url,
          shortUrl: tinyUrl, // Use the actual TinyURL
          customAlias: customAlias || null,
          createdAt: timestamp,
          expiryDate: expiryDate,
          clicks: 0,
        };
        
        setShortUrl(tinyUrl);
        setUrlHistory(prevHistory => {
          const updatedHistory = [newUrlEntry, ...prevHistory];
          return updatedHistory;
        });
        
        setIsLoading(false);
        setSuccess('URL shortened successfully!');
        
        // Reset form
        setCustomAlias('');
      })
      .catch(err => {
        console.error('Error shortening URL:', err);
        
        // Fallback to using a URL shortener that doesn't require API key
        const bitlyUrl = `https://bit.ly/app/shorten?link=${encodeURIComponent(url)}`;
        window.open(bitlyUrl, '_blank');
        
        const timestamp = new Date().toISOString();
        
        // Calculate expiry date if set
        let expiryDate = null;
        if (expiryDays > 0) {
          const date = new Date();
          date.setDate(date.getDate() + parseInt(expiryDays));
          expiryDate = date.toISOString();
        }
        
        // Add to history
        const newUrlEntry = {
          id: Date.now(),
          originalUrl: url,
          shortUrl: url, // Use the original URL as fallback
          customAlias: customAlias || null,
          createdAt: timestamp,
          expiryDate: expiryDate,
          clicks: 0,
        };
        
        setShortUrl(url);
        setUrlHistory(prevHistory => [newUrlEntry, ...prevHistory]);
        setIsLoading(false);
        setSuccess('Please use the opened Bitly page to create your short URL');
      });
  };

  const copyToClipboard = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy || shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const deleteUrl = (id) => {
    setUrlHistory(prevHistory => {
      const updatedHistory = prevHistory.filter(item => item.id !== id);
      return updatedHistory;
    });
    setSuccess('URL deleted from history');
  };
  
  // Clear all URLs from history
  const clearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire URL history?')) {
      setUrlHistory([]);
      localStorage.removeItem(STORAGE_KEY);
      setSuccess('URL history cleared');
    }
  };
  
  // Export history to JSON file
  const exportHistory = () => {
    const dataStr = JSON.stringify(urlHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = 'url_shortener_history.json';
    link.href = url;
    link.click();
  };

  // Simulate fetching stats for a URL
  const fetchUrlStats = (urlItem) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate random stats
      const today = new Date();
      const daysData = [];
      
      // Generate last 7 days of data
      for (let i = 6; i >= 0; i--) {
        const day = new Date();
        day.setDate(today.getDate() - i);
        const clicks = Math.floor(Math.random() * 15);
        
        daysData.push({
          date: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          clicks: clicks
        });
      }
      
      // Calculate devices and browsers (random distribution)
      const devices = {
        mobile: Math.floor(Math.random() * 60) + 20,
        desktop: Math.floor(Math.random() * 50) + 10,
        tablet: Math.floor(Math.random() * 30) + 5
      };
      
      // Normalize to 100%
      const deviceSum = devices.mobile + devices.desktop + devices.tablet;
      devices.mobile = Math.round((devices.mobile / deviceSum) * 100);
      devices.desktop = Math.round((devices.desktop / deviceSum) * 100);
      devices.tablet = 100 - devices.mobile - devices.desktop;
      
      const browsers = {
        chrome: Math.floor(Math.random() * 60) + 20,
        firefox: Math.floor(Math.random() * 30) + 10,
        safari: Math.floor(Math.random() * 20) + 10,
        edge: Math.floor(Math.random() * 15) + 5
      };
      
      // Normalize to 100%
      const browserSum = browsers.chrome + browsers.firefox + browsers.safari + browsers.edge;
      browsers.chrome = Math.round((browsers.chrome / browserSum) * 100);
      browsers.firefox = Math.round((browsers.firefox / browserSum) * 100);
      browsers.safari = Math.round((browsers.safari / browserSum) * 100);
      browsers.edge = 100 - browsers.chrome - browsers.firefox - browsers.safari;
      
      setUrlStats({
        url: urlItem,
        totalClicks: urlItem.clicks + Math.floor(Math.random() * 50),
        dailyData: daysData,
        devices: devices,
        browsers: browsers,
        referrers: [
          { source: 'Direct', percentage: 45 },
          { source: 'Social Media', percentage: 32 },
          { source: 'Email', percentage: 15 },
          { source: 'Other', percentage: 8 }
        ]
      });
      
      setIsLoading(false);
      setShowStats(true);
    }, 1000);
  };

  // Open original URL in a new tab (simulating a click on the short URL)
  const visitUrl = (urlItem) => {
    window.open(urlItem.originalUrl, '_blank');
    
    // Update clicks count and save to localStorage
    setUrlHistory(prevHistory => 
      prevHistory.map(item => 
        item.id === urlItem.id 
          ? { ...item, clicks: item.clicks + 1 } 
          : item
      )
    );
  };

  // Check if URL is expired
  const isExpired = (urlItem) => {
    if (!urlItem.expiryDate) return false;
    const now = new Date();
    const expiry = new Date(urlItem.expiryDate);
    return now > expiry;
  };

  // Component for displaying URL stats
  const URLStats = ({ stats }) => {
    if (!stats) return null;
    
    const maxClicks = Math.max(...stats.dailyData.map(day => day.clicks));
    
    return (
      <div className={`${themeColors.card} ${themeColors.shadow} rounded-lg p-4 mt-4`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Analytics for {stats.url.shortUrl}</h3>
          <button 
            onClick={() => setShowStats(false)} 
            className={`${themeColors.buttonSecondary} px-2 py-1 rounded-md text-sm`}
          >
            Close
          </button>
        </div>
        
        <div className="text-center mb-4">
          <div className="text-3xl font-bold mb-1">{stats.totalClicks}</div>
          <div className={`${themeColors.secondaryText} text-sm`}>Total Clicks</div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Clicks (Last 7 days)</h4>
          <div className="flex items-end h-32 gap-1">
            {stats.dailyData.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full flex-1 flex items-end">
                  <div 
                    className={`w-full ${themeColors.statsProgress} rounded-t`} 
                    style={{ height: `${maxClicks ? (day.clicks / maxClicks) * 100 : 0}%` }}
                  ></div>
                </div>
                <div className={`${themeColors.secondaryText} text-xs mt-1`}>{day.date}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Devices</h4>
            {Object.entries(stats.devices).map(([device, percentage]) => (
              <div key={device} className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="capitalize">{device}</span>
                  <span>{percentage}%</span>
                </div>
                <div className={`w-full h-2 ${themeColors.statsBar} rounded-full`}>
                  <div 
                    className={`h-2 ${themeColors.statsProgress} rounded-full`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Browsers</h4>
            {Object.entries(stats.browsers).map(([browser, percentage]) => (
              <div key={browser} className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="capitalize">{browser}</span>
                  <span>{percentage}%</span>
                </div>
                <div className={`w-full h-2 ${themeColors.statsBar} rounded-full`}>
                  <div 
                    className={`h-2 ${themeColors.statsProgress} rounded-full`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Referrers</h4>
          {stats.referrers.map((referrer, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span>{referrer.source}</span>
                <span>{referrer.percentage}%</span>
              </div>
              <div className={`w-full h-2 ${themeColors.statsBar} rounded-full`}>
                <div 
                  className={`h-2 ${themeColors.statsProgress} rounded-full`} 
                  style={{ width: `${referrer.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Component for History Management Tools
  const HistoryManagementTools = () => (
    <div className={`mt-4 p-4 ${themeColors.card} ${themeColors.shadow} rounded-lg`}>
      <h3 className="text-lg font-semibold mb-3">History Management</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={clearAllHistory}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Clear All History
        </button>
        <button
          onClick={exportHistory}
          className={`${themeColors.buttonSecondary} px-4 py-2 rounded-md text-sm`}
        >
          Export History
        </button>
      </div>
      <div className="mt-3 text-sm">
        <span className={`${themeColors.secondaryText}`}>
          {urlHistory.length} URL{urlHistory.length !== 1 ? 's' : ''} in history
        </span>
      </div>
    </div>
  );
  
  // Component for URL History Table
  const URLHistoryTable = () => (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full">
        <thead>
          <tr className={`${themeColors.inputBg} border-t border-b ${themeColors.divider}`}>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Short URL</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Original URL</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Created</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Expires</th>
            <th className="px-4 py-2 text-left text-xs font-medium uppercase">Clicks</th>
            <th className="px-4 py-2 text-center text-xs font-medium uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {urlHistory.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-4 text-center">
                No URLs in history
              </td>
            </tr>
          ) : (
            urlHistory.map((item) => (
              <tr key={item.id} className={`border-b ${themeColors.divider} ${isExpired(item) ? 'opacity-60' : ''}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    {isExpired(item) && (
                      <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2" title="Expired"></span>
                    )}
                    <a 
                      href={item.originalUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-blue-600 hover:underline truncate max-w-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isExpired(item)) {
                          visitUrl(item);
                        }
                      }}
                    >
                      {item.shortUrl}
                    </a>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="truncate max-w-xs" title={item.originalUrl}>
                    {item.originalUrl}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-4 py-3 text-sm">
                  {item.clicks}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => copyToClipboard(item.shortUrl)}
                      className={`${themeColors.buttonSecondary} px-2 py-1 rounded text-xs`}
                      title="Copy URL"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => generateQRCode(item.originalUrl)}  // Generate QR for original URL
                      className={`${themeColors.buttonSecondary} px-2 py-1 rounded text-xs`}
                      title="Generate QR Code"
                    >
                      QR
                    </button>
                    <button
                      onClick={() => fetchUrlStats(item)}
                      className={`${themeColors.buttonSecondary} px-2 py-1 rounded text-xs`}
                      title="View Analytics"
                    >
                      Stats
                    </button>
                    <button
                      onClick={() => deleteUrl(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                      title="Delete URL"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // QR Code Modal with actual QR code
  const QRCodeModal = () => (
    <div className={`${showQR ? 'flex' : 'hidden'} ${themeColors.background} fixed inset-0 z-50 items-center justify-center p-4 bg-black bg-opacity-50`}>
      <div className={`${themeColors.card} ${themeColors.shadow} rounded-lg p-6 max-w-sm w-full`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">QR Code</h3>
          <button 
            onClick={() => setShowQR(false)} 
            className={`${themeColors.buttonSecondary} p-1 rounded-full`}
          >
            &times;
          </button>
        </div>
        <div className="flex justify-center mb-4">
          {qrCode && <img src={qrCode} alt="QR Code" className="w-48 h-48" />}
        </div>
        <div className="text-center text-sm mb-4 break-all">
          {shortUrl}
        </div>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => setShowQR(false)} 
            className={`${themeColors.buttonSecondary} px-4 py-2 rounded-md`}
          >
            Close
          </button>
          <a 
            href={qrCode} 
            download="qrcode.png"
            className={`${themeColors.buttonPrimary} text-white px-4 py-2 rounded-md text-center`}
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );

return (
    <div className={`${themeColors.background} ${themeColors.text} mt-18 min-h-screen p-4 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">URL Shortener</h1>
          <p className={`mt-2 ${themeColors.secondaryText}`}>Create short, easy-to-share links</p>
        </div>
        
        {/* Tabs */}
        <div className={`flex border-b mb-6 ${themeColors.divider}`}>
          <button 
            onClick={() => setViewMode('create')} 
            className={`px-4 py-2 border-b-2 font-medium ${viewMode === 'create' ? themeColors.tabActive : themeColors.tabInactive}`}
          >
            Create URL
          </button>
          <button 
            onClick={() => setViewMode('history')} 
            className={`px-4 py-2 border-b-2 font-medium ${viewMode === 'history' ? themeColors.tabActive : themeColors.tabInactive}`}
          >
            URL History ({urlHistory.length})
          </button>
        </div>
        
        {/* Success and Error Messages */}
        {success && (
          <div className={`${themeColors.success} p-3 rounded-md mb-4`}>
            {success}
          </div>
        )}
        
        {error && (
          <div className={`${themeColors.error} p-3 rounded-md mb-4`}>
            {error}
          </div>
        )}
        
        {/* Create URL Form */}
        {viewMode === 'create' && (
          <div className={`${themeColors.card} ${themeColors.shadow} rounded-lg p-6`}>
            <div className="mb-4">
              <label htmlFor="url" className="block mb-2 text-sm font-medium">
                Enter a long URL
              </label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/url/to/shorten"
                className={`w-full px-4 py-2 rounded-md border ${themeColors.inputBg} ${themeColors.inputBorder} ${themeColors.inputText} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="customAlias" className="block mb-2 text-sm font-medium">
                  Custom alias (optional)
                </label>
                <input
                  type="text"
                  id="customAlias"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  placeholder="my-custom-url"
                  className={`w-full px-4 py-2 rounded-md border ${themeColors.inputBg} ${themeColors.inputBorder} ${themeColors.inputText} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              
              <div>
                <label htmlFor="expiryDays" className="block mb-2 text-sm font-medium">
                  Link expiry (optional)
                </label>
                <select
                  id="expiryDays"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                  className={`w-full px-4 py-2 rounded-md border ${themeColors.inputBg} ${themeColors.inputBorder} ${themeColors.inputText} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="0">Never expires</option>
                  <option value="1">1 day</option>
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={shortenUrl}
              disabled={isLoading}
              className={`${themeColors.buttonPrimary} text-white py-2 px-4 rounded-md w-full mb-4 flex justify-center items-center`}
            >
              {isLoading ? (
                <span>Shortening...</span>
              ) : (
                <span>Shorten URL</span>
              )}
            </button>
            
            {shortUrl && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Your shortened URL:</span>
                  {copied && (
                    <span className={`text-xs ${themeColors.success.split(' ')[0]}`}>
                      Copied!
                    </span>
                  )}
                </div>
                <div className={`flex rounded-md overflow-hidden border ${themeColors.inputBorder}`}>
                  <div className={`flex-1 p-2 ${themeColors.inputBg} truncate`}>
                    {shortUrl}
                  </div>
                  <button
                    onClick={() => copyToClipboard()}
                    className={`${themeColors.buttonSecondary} px-3 py-2`}
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => generateQRCode(url)}
                    className={`${themeColors.buttonSecondary} px-3 py-2`}
                  >
                    QR Code
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* URL History */}
        {viewMode === 'history' && (
          <>
            <div className={`${themeColors.card} ${themeColors.shadow} rounded-lg p-6`}>
              <h2 className="text-xl font-semibold mb-4">Your URL History</h2>
              <URLHistoryTable />
            </div>
            <HistoryManagementTools />
          </>
        )}
        
        {/* URL Stats View */}
        {showStats && (
          <URLStats stats={urlStats} />
        )}
        
        {/* QR Code Modal */}
        <QRCodeModal />
      </div>
    </div>
  );
}
  export default FullURLShortener;