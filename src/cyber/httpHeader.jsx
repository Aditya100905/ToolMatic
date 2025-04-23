import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Copy, ExternalLink, Eye, EyeOff, Filter, Info, Search, Send, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

// Main component that accepts a theme prop
export default function HTTPHeadersAnalyzer({ theme = 'light' }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRawHeaders, setShowRawHeaders] = useState(false);
  const [securityScore, setSecurityScore] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [copiedHeader, setCopiedHeader] = useState('');

  // Theme-based colors
  const colors = {
    background: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    foreground: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
    card: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    input: theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900',
    inputBorder: theme === 'dark' ? 'border-gray-600' : 'border-gray-300',
    button: theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
    secondaryButton: theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300',
    tabs: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100',
    activeTab: theme === 'dark' ? 'bg-gray-700' : 'bg-white',
    scrollbar: theme === 'dark' ? 'scrollbar-dark' : 'scrollbar-light',
    danger: theme === 'dark' ? 'text-red-400' : 'text-red-600',
    success: theme === 'dark' ? 'text-green-400' : 'text-green-600',
    warning: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
    info: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
  };

  // Security header definitions
  const securityHeaders = {
    'Content-Security-Policy': {
      description: 'Helps prevent XSS and data injection attacks',
      importance: 'high',
      icon: <Shield className="w-5 h-5" />,
    },
    'Strict-Transport-Security': {
      description: 'Enforces HTTPS connections',
      importance: 'high',
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    'X-Content-Type-Options': {
      description: 'Prevents MIME-type sniffing',
      importance: 'medium',
      icon: <Shield className="w-5 h-5" />,
    },
    'X-Frame-Options': {
      description: 'Protects against clickjacking',
      importance: 'high',
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    'X-XSS-Protection': {
      description: 'Mitigates Cross-site scripting attacks',
      importance: 'medium',
      icon: <Shield className="w-5 h-5" />,
    },
    'Referrer-Policy': {
      description: 'Controls how much referrer information is included',
      importance: 'medium',
      icon: <Info className="w-5 h-5" />,
    },
    'Permissions-Policy': {
      description: 'Controls browser features available to the site',
      importance: 'medium',
      icon: <Info className="w-5 h-5" />,
    },
    'Cross-Origin-Embedder-Policy': {
      description: 'Prevents loading cross-origin resources',
      importance: 'medium',
      icon: <Shield className="w-5 h-5" />,
    },
    'Cross-Origin-Opener-Policy': {
      description: 'Controls cross-origin window references',
      importance: 'medium',
      icon: <Shield className="w-5 h-5" />,
    },
    'Cross-Origin-Resource-Policy': {
      description: 'Prevents resource loading by cross-origin sites',
      importance: 'medium',
      icon: <Shield className="w-5 h-5" />,
    },
  };

  // Function to analyze headers and calculate security score
  const analyzeHeaders = (headers) => {
    let score = 0;
    let maxScore = 0;
    const presentSecurityHeaders = [];
    const missingSecurityHeaders = [];

    Object.keys(securityHeaders).forEach(header => {
      const importanceValue = securityHeaders[header].importance === 'high' ? 10 : 5;
      maxScore += importanceValue;

      const headerExists = Object.keys(headers).some(h => 
        h.toLowerCase() === header.toLowerCase()
      );

      if (headerExists) {
        score += importanceValue;
        presentSecurityHeaders.push(header);
      } else {
        missingSecurityHeaders.push(header);
      }
    });

    const percentage = Math.round((score / maxScore) * 100);
    
    return {
      score: percentage,
      present: presentSecurityHeaders,
      missing: missingSecurityHeaders
    };
  };

  const fetchHeaders = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }
    
    // Validate URL format
    let processedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      processedUrl = 'https://' + url;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // In a real application, you'd use a proxy server to avoid CORS issues
      // For demo purposes, we'll simulate a response
      const mockResponse = await simulateFetchHeaders(processedUrl);
      
      setHeaders(mockResponse.headers);
      const securityAnalysis = analyzeHeaders(mockResponse.headers);
      setSecurityScore(securityAnalysis);
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to fetch headers: ' + err.message);
    }
  };

  // This simulates fetching headers (in a real app, this would be an actual API call)
  const simulateFetchHeaders = async (url) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, return realistic headers based on the URL
    let headers = {
      'Content-Type': 'text/html; charset=UTF-8',
      'Server': 'nginx/1.18.0',
      'Date': new Date().toUTCString(),
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=604800',
      'Expires': new Date(Date.now() + 604800000).toUTCString(),
      'Content-Length': '1270',
      'Accept-Ranges': 'bytes',
    };
    
    // Add some security headers for known domains to make it realistic
    if (url.includes('github.com')) {
      headers = {
        ...headers,
        'Content-Security-Policy': "default-src 'none'; base-uri 'self'; connect-src 'self'; form-action 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'",
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'deny',
        'X-XSS-Protection': '0',
        'Referrer-Policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',
        'Permissions-Policy': 'interest-cohort=()'
      };
    } 
    else if (url.includes('google.com')) {
      headers = {
        ...headers,
        'Strict-Transport-Security': 'max-age=31536000',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "object-src 'none'; frame-ancestors 'self'"
      };
    }
    
    return { headers };
  };

  const copyToClipboard = (text, headerName) => {
    navigator.clipboard.writeText(text);
    setCopiedHeader(headerName);
    setTimeout(() => setCopiedHeader(''), 2000);
  };

  const formatRawHeaders = () => {
    if (!headers) return '';
    
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  };

  const filteredHeaders = () => {
    if (!headers) return [];
    
    let filtered = Object.entries(headers);
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(([key, value]) => 
        key.toLowerCase().includes(searchTerm.toLowerCase()) || 
        value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (activeTab === 'security') {
      filtered = filtered.filter(([key]) => 
        Object.keys(securityHeaders).some(h => h.toLowerCase() === key.toLowerCase())
      );
    } else if (activeTab === 'caching') {
      filtered = filtered.filter(([key]) => 
        ['cache-control', 'expires', 'etag', 'last-modified'].includes(key.toLowerCase())
      );
    } else if (activeTab === 'cors') {
      filtered = filtered.filter(([key]) => 
        key.toLowerCase().includes('cors') || key.toLowerCase().includes('origin')
      );
    }
    
    return filtered;
  };

  const getHeaderImportance = (key) => {
    for (const secHeader in securityHeaders) {
      if (key.toLowerCase() === secHeader.toLowerCase()) {
        return securityHeaders[secHeader].importance;
      }
    }
    return 'normal';
  };
  
  const getHeaderIcon = (key) => {
    for (const secHeader in securityHeaders) {
      if (key.toLowerCase() === secHeader.toLowerCase()) {
        return securityHeaders[secHeader].icon;
      }
    }
    return <Info className="w-5 h-5" />;
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'high':
        return colors.danger;
      case 'medium':
        return colors.warning;
      default:
        return colors.info;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return colors.success;
    if (score >= 50) return colors.warning;
    return colors.danger;
  };

  return (
    <div className={`${colors.background} ${colors.foreground} min-h-screen p-4 md:p-6 lg:p-8`}>
      <div className={`max-w-6xl mx-auto ${colors.card} rounded-lg shadow-lg p-4 md:p-6 border ${colors.border}`}>
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
          <Shield className="inline-block mr-2" /> 
          HTTP Headers Analyzer
        </h1>

        {/* URL Input Form */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-grow">
            <div className={`flex items-center border ${colors.inputBorder} rounded-md overflow-hidden ${colors.input}`}>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL (e.g., https://example.com)"
                className={`w-full p-3 outline-none ${colors.input}`}
                onKeyPress={(e) => e.key === 'Enter' && fetchHeaders()}
              />
            </div>
          </div>
          <button
            onClick={fetchHeaders}
            disabled={loading}
            className={`${colors.button} text-white rounded-md p-3 px-6 flex items-center justify-center whitespace-nowrap transition-colors duration-200`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="mr-2 h-4 w-4" /> Analyze Headers
              </span>
            )}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className={`p-4 mb-6 rounded-md bg-opacity-10 flex items-start ${theme === 'dark' ? 'bg-red-900' : 'bg-red-100'} ${colors.danger}`}>
            <AlertCircle className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Section */}
        {headers && (
          <div className="space-y-6">
            {/* Toggle and search controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRawHeaders(!showRawHeaders)}
                  className={`${colors.secondaryButton} rounded-md p-2 flex items-center transition-colors duration-200`}
                >
                  {showRawHeaders ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                  {showRawHeaders ? "Show Parsed" : "Show Raw"}
                </button>
                
                <div className={`flex items-center border ${colors.inputBorder} rounded-md ${colors.input}`}>
                  <Search className="mx-2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter headers..."
                    className={`p-2 outline-none ${colors.input} w-full`}
                  />
                </div>
              </div>
              
              {/* Tabs */}
              <div className={`flex rounded-md ${colors.tabs} p-1 self-stretch md:self-auto`}>
                {['all', 'security', 'caching', 'cors'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-md capitalize transition-colors duration-200 text-sm ${
                      activeTab === tab 
                        ? `${colors.activeTab} shadow-sm font-medium` 
                        : 'opacity-70'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Security Score */}
            {securityScore && (
              <div className={`p-4 rounded-md border ${colors.border} ${colors.card}`}>
                <h2 className="text-lg font-semibold mb-3">Security Assessment</h2>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Score */}
                  <div className="flex flex-col items-center">
                    <div className={`text-4xl font-bold ${getScoreColor(securityScore.score)}`}>
                      {securityScore.score}%
                    </div>
                    <div className="text-sm mt-1">Security Score</div>
                  </div>
                  
                  {/* Missing Headers */}
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium mb-2">Missing Security Headers ({securityScore.missing.length})</h3>
                    {securityScore.missing.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {securityScore.missing.map(header => (
                          <div key={header} className="flex items-center">
                            <ShieldAlert className={`w-4 h-4 mr-2 ${colors.danger}`} />
                            <span className="text-sm">{header}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${colors.success}`} />
                        <span className="text-sm">All security headers present!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Raw Headers View */}
            {headers && showRawHeaders ? (
              <div className={`p-4 rounded-md border ${colors.border} ${colors.card} relative`}>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">Raw Headers</h2>
                  <button
                    onClick={() => copyToClipboard(formatRawHeaders(), 'raw')}
                    className={`p-2 rounded-md ${colors.secondaryButton} flex items-center`}
                  >
                    {copiedHeader === 'raw' ? (
                      <span className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" /> Copied!
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Copy className="w-4 h-4 mr-1" /> Copy All
                      </span>
                    )}
                  </button>
                </div>
                <pre className={`whitespace-pre-wrap font-mono text-sm p-3 rounded bg-opacity-50 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} overflow-x-auto max-h-96 ${colors.scrollbar}`}>
                  {formatRawHeaders()}
                </pre>
              </div>
            ) : (
              // Parsed Headers View
              headers && (
                <div className={`rounded-md border ${colors.border} ${colors.card} overflow-hidden`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}>
                          <th className="px-4 py-3 text-left font-semibold">Header</th>
                          <th className="px-4 py-3 text-left font-semibold">Value</th>
                          <th className="px-4 py-3 text-right font-semibold w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHeaders().length > 0 ? (
                          filteredHeaders().map(([key, value], index) => {
                            const importance = getHeaderImportance(key);
                            const icon = getHeaderIcon(key);
                            
                            return (
                              <tr 
                                key={index} 
                                className={`border-t ${colors.border} ${
                                  index % 2 === 0 
                                    ? theme === 'dark' ? 'bg-gray-800' : 'bg-white' 
                                    : theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50'
                                }`}
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <span className={`mr-2 ${getImportanceColor(importance)}`}>
                                      {icon}
                                    </span>
                                    <div>
                                      <div className="font-medium">{key}</div>
                                      {Object.keys(securityHeaders).includes(key) && (
                                        <div className="text-xs opacity-70 mt-1">
                                          {securityHeaders[key].description}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="font-mono text-sm break-all">
                                    {value}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    onClick={() => copyToClipboard(value, key)}
                                    className={`p-1 rounded-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors duration-200`}
                                    title="Copy value"
                                  >
                                    {copiedHeader === key ? (
                                      <CheckCircle className="w-4 h-4" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="3" className="px-4 py-8 text-center">
                              <div className="flex flex-col items-center opacity-70">
                                <Filter className="w-12 h-12 mb-2 opacity-50" />
                                <p>No headers match your filters</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            )}
            
            {/* Learn More Section */}
            <div className={`mt-8 p-4 rounded-md border ${colors.border} ${colors.card}`}>
              <h2 className="text-lg font-semibold mb-2">Learn More</h2>
              <p className="text-sm mb-2">
                HTTP headers are important for security, caching, and content delivery. Security headers can help protect against common web vulnerabilities.
              </p>
              <a 
                href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers" 
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center text-sm ${colors.info} hover:underline mt-1`}
              >
                MDN HTTP Headers Reference <ExternalLink className="ml-1 w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}