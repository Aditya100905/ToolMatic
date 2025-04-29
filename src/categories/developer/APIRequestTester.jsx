import React, { useState, useEffect, useRef } from 'react';

export default function APIRequestTester() {
  // State for request parameters
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState([{ id: Date.now(), key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [bodyType, setBodyType] = useState('json');
  
  // State for UI management
  const [showHeaders, setShowHeaders] = useState(true);
  const [showBody, setShowBody] = useState(true);
  const [responseTab, setResponseTab] = useState('result');
  const [showSaved, setShowSaved] = useState(false);
  const [timeout, setTimeout] = useState(30);
  
  // State for response data
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for validation
  const [urlError, setUrlError] = useState('');
  const [bodyError, setBodyError] = useState('');
  
  // State for saved requests
  const [savedRequests, setSavedRequests] = useState([]);
  
  // For request cancellation
  const abortControllerRef = useRef(null);

  // Custom dark theme colors
  const colors = {
    background: '#0e0e0e',
    secondary: '#121212',
    border: '#303030',
    text: '#ffffff',
    textSecondary: '#aaaaaa',
    input: '#1a1a1a',
    accent: '#2563eb',
    accentHover: '#1d4ed8',
    error: '#dc2626',
    success: '#10b981',
    warning: '#f59e0b'
  };

  // Load saved requests from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem('apiTesterSavedRequests');
      if (saved) {
        setSavedRequests(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error loading saved requests:', err);
    }
  }, []);

  // Validate JSON body whenever it changes
  useEffect(() => {
    if (bodyType === 'json' && body.trim()) {
      try {
        JSON.parse(body);
        setBodyError('');
      } catch (err) {
        setBodyError('Invalid JSON: ' + err.message);
      }
    } else {
      setBodyError('');
    }
  }, [body, bodyType]);

  const validateUrl = (urlToCheck) => {
    if (!urlToCheck) return "URL is required";
    if (!urlToCheck.startsWith('http://') && !urlToCheck.startsWith('https://')) {
      return "URL must start with http:// or https://";
    }
    return "";
  };

  const handleSendRequest = async () => {
    // Validate URL first
    const urlValidationError = validateUrl(url);
    if (urlValidationError) {
      setUrlError(urlValidationError);
      return;
    }
    
    // Validate JSON body if applicable
    if (bodyType === 'json' && body.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        JSON.parse(body);
      } catch (e) {
        setBodyError('Invalid JSON: ' + e.message);
        return;
      }
    }
    
    setUrlError('');
    setLoading(true);
    setError(null);
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new AbortController
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;
    
    // Set timeout to abort request
    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }, timeout * 1000);
    
    try {
      const requestOptions = {
        method,
        headers: headers.reduce((acc, header) => {
          if (header.key && header.value) {
            acc[header.key] = header.value;
          }
          return acc;
        }, {}),
        signal
      };

      // Handle request body for methods that support it
      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        const contentTypeHeader = headers.find(h => 
          h.key.toLowerCase() === 'content-type'
        );
        
        if (bodyType === 'json') {
          try {
            requestOptions.body = JSON.stringify(JSON.parse(body));
            // Only auto-set Content-Type if user hasn't specified one
            if (!contentTypeHeader?.key) {
              requestOptions.headers['Content-Type'] = 'application/json';
            }
          } catch (e) {
            throw new Error('Invalid JSON in request body');
          }
        } else {
          requestOptions.body = body;
        }
      }

      const startTime = Date.now();
      const res = await fetch(url, requestOptions);
      const endTime = Date.now();
      
      const responseTime = Math.round(endTime - startTime);
      
      let responseData;
      const contentType = res.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }

      const responseObj = {
        status: res.status,
        statusText: res.statusText,
        headers: Array.from(res.headers.entries()),
        data: responseData,
        time: responseTime
      };

      setResponse(responseObj);
      
      // Save this successful request
      saveRequest({
        id: Date.now(),
        url,
        method,
        headers: headers.filter(h => h.key && h.value),
        body,
        bodyType,
        timestamp: new Date().toISOString()
      });
      
    } catch (err) {
      if (err.name === 'AbortError') {
        setError(`Request timed out after ${timeout} seconds`);
      } else {
        setError(err.message);
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const saveRequest = (request) => {
    const updatedRequests = [request, ...savedRequests.slice(0, 9)]; // Keep only last 10
    setSavedRequests(updatedRequests);
    localStorage.setItem('apiTesterSavedRequests', JSON.stringify(updatedRequests));
  };

  const deleteRequest = (id) => {
    const updatedRequests = savedRequests.filter(req => req.id !== id);
    setSavedRequests(updatedRequests);
    localStorage.setItem('apiTesterSavedRequests', JSON.stringify(updatedRequests));
  };

  const loadSavedRequest = (request) => {
    setUrl(request.url);
    setMethod(request.method);
    setHeaders(request.headers.length > 0 
      ? request.headers.map(h => ({ id: Date.now() + Math.random(), ...h }))
      : [{ id: Date.now(), key: '', value: '' }]
    );
    setBody(request.body || '');
    setBodyType(request.bodyType || 'json');
    setShowSaved(false);
  };

  const addHeader = () => {
    setHeaders([...headers, { id: Date.now() + Math.random(), key: '', value: '' }]);
  };

  const removeHeader = (id) => {
    setHeaders(headers.filter(header => header.id !== id));
  };

  const updateHeader = (id, field, value) => {
    setHeaders(headers.map(header => 
      header.id === id ? { ...header, [field]: value } : header
    ));
  };

  const prettyPrintJson = (data) => {
    try {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return data;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return colors.textSecondary;
    if (status >= 200 && status < 300) return colors.success;
    if (status >= 300 && status < 400) return '#3b82f6';
    if (status >= 400 && status < 500) return colors.warning;
    if (status >= 500) return colors.error;
    return colors.textSecondary;
  };

  const getMethodColor = (methodType) => {
    switch(methodType) {
      case 'GET': return 'bg-green-800 bg-opacity-30 text-green-400';
      case 'POST': return 'bg-blue-800 bg-opacity-30 text-blue-400';
      case 'PUT': return 'bg-yellow-800 bg-opacity-30 text-yellow-400';
      case 'PATCH': return 'bg-purple-800 bg-opacity-30 text-purple-400';
      case 'DELETE': return 'bg-red-800 bg-opacity-30 text-red-400';
      default: return 'bg-gray-800 bg-opacity-30 text-gray-400';
    }
  };

  const clearResponse = () => {
    setResponse(null);
    setError(null);
  };

  const downloadResponse = () => {
    if (!response) return;
    
    let filename, data, type;
    
    if (typeof response.data === 'object') {
      filename = 'response.json';
      data = JSON.stringify(response.data, null, 2);
      type = 'application/json';
    } else {
      filename = 'response.txt';
      data = response.data;
      type = 'text/plain';
    }
    
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  const cancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const formatJsonBody = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(body || '{}'), null, 2);
      setBody(formatted);
    } catch (e) {
      // If invalid JSON, do nothing
    }
  };

  return (
    <div className="min-h-screen w-full p-4" style={{ backgroundColor: colors.background, color: colors.text }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="flex items-center mb-2 md:mb-0">
            <h1 className="text-2xl font-bold">API Request Tester</h1>
            <button 
              onClick={() => setShowSaved(!showSaved)} 
              className="ml-4 px-3 py-1 text-sm rounded-md"
              style={{ backgroundColor: colors.secondary, borderColor: colors.border, border: '1px solid' }}
            >
              History
            </button>
          </div>
          <div className="p-1 text-sm rounded-md" 
            style={{ backgroundColor: colors.secondary, borderColor: colors.border, border: '1px solid' }}>
            Dark Mode
          </div>
        </div>

        {/* Saved Requests Dropdown */}
        {showSaved && savedRequests.length > 0 && (
          <div className="mb-4 p-2 max-h-64 overflow-y-auto rounded-md" 
            style={{ backgroundColor: colors.secondary, borderColor: colors.border, border: '1px solid' }}>
            <h3 className="font-medium mb-2">Recent Requests</h3>
            {savedRequests.map((req) => (
              <div 
                key={req.id}
                className="flex items-center p-2 mb-1 rounded hover:bg-opacity-50"
                style={{ transition: 'background-color 0.2s', cursor: 'pointer' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span className={`px-2 py-1 rounded text-xs mr-2 ${getMethodColor(req.method)}`}>
                  {req.method}
                </span>
                <span 
                  className="truncate flex-grow"
                  onClick={() => loadSavedRequest(req)}
                >
                  {req.url}
                </span>
                <span className="text-xs mr-2" style={{ color: colors.textSecondary }}>
                  {new Date(req.timestamp).toLocaleString()}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRequest(req.id);
                  }}
                  className="px-2 text-red-500 hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* URL and Method */}
        <div className="flex flex-col md:flex-row w-full mb-2 gap-2">
          <div className="w-full md:w-1/6 mb-2 md:mb-0">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="rounded-md w-full p-2"
              style={{ backgroundColor: colors.input, borderColor: colors.border, border: '1px solid' }}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
              <option value="HEAD">HEAD</option>
              <option value="OPTIONS">OPTIONS</option>
            </select>
          </div>
          <div className="w-full md:w-4/6">
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (urlError) setUrlError('');
              }}
              placeholder="Enter request URL (https://example.com/api)"
              className="rounded-md w-full p-2"
              style={{ 
                backgroundColor: colors.input, 
                borderColor: urlError ? colors.error : colors.border, 
                border: '1px solid' 
              }}
            />
            {urlError && <p style={{ color: colors.error }} className="text-sm mt-1">{urlError}</p>}
          </div>
          <div className="w-full md:w-1/6">
            <button
              onClick={handleSendRequest}
              disabled={loading}
              className="text-white rounded-md w-full p-2 transition-opacity duration-200"
              style={{ 
                backgroundColor: colors.accent, 
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer' 
              }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.accentHover)}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = colors.accent)}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>

        {/* Timeout Setting */}
        <div className="flex items-center mb-4">
          <label className="mr-2 text-sm">Timeout:</label>
          <input
            type="number"
            min="1"
            max="120"
            value={timeout}
            onChange={(e) => setTimeout(Math.max(1, Math.min(120, parseInt(e.target.value) || 30)))}
            className="rounded-md p-1 w-16 text-sm mr-1"
            style={{ backgroundColor: colors.input, borderColor: colors.border, border: '1px solid' }}
          />
          <span className="text-sm">seconds</span>
          {loading && (
            <button
              onClick={cancelRequest}
              className="ml-4 text-white rounded-md px-3 py-1 text-sm transition-colors duration-200"
              style={{ backgroundColor: colors.error }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = colors.error)}
            >
              Cancel
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Section */}
          <div className="rounded-md overflow-hidden" 
            style={{ backgroundColor: colors.secondary, borderColor: colors.border, border: '1px solid' }}>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Request</h2>
              
              {/* Headers */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <button 
                    onClick={() => setShowHeaders(!showHeaders)}
                    className={`flex items-center text-lg font-medium ${showHeaders ? 'mb-2' : ''}`}
                  >
                    Headers
                    <span className="ml-2">
                      {showHeaders ? '▼' : '▶'}
                    </span>
                  </button>
                  {showHeaders && (
                    <button 
                      onClick={addHeader}
                      className="text-white text-sm rounded px-2 py-1 transition-colors duration-200"
                      style={{ backgroundColor: colors.accent }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = colors.accentHover)}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = colors.accent)}
                    >
                      Add Header
                    </button>
                  )}
                </div>
                
                {showHeaders && (
                  <div className="space-y-3">
                    {headers.map((header) => (
                      <div key={header.id} className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={header.key}
                          onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                          placeholder="Header key"
                          className="rounded-md p-2 w-full sm:w-5/12"
                          style={{ backgroundColor: colors.input, borderColor: colors.border, border: '1px solid' }}
                        />
                        <input
                          type="text"
                          value={header.value}
                          onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                          placeholder="Header value"
                          className="rounded-md p-2 w-full sm:w-5/12"
                          style={{ backgroundColor: colors.input, borderColor: colors.border, border: '1px solid' }}
                        />
                        <button
                          onClick={() => removeHeader(header.id)}
                          className="text-white rounded-md p-2 w-full sm:w-2/12 transition-colors duration-200"
                          style={{ backgroundColor: colors.error }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = colors.error)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Body */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <button 
                    onClick={() => setShowBody(!showBody)}
                    className={`flex items-center text-lg font-medium ${showBody ? 'mb-2' : ''}`}
                  >
                    Body
                    <span className="ml-2">
                      {showBody ? '▼' : '▶'}
                    </span>
                  </button>
                  {showBody && (
                    <div className="flex items-center gap-2">
                      <select
                        value={bodyType}
                        onChange={(e) => setBodyType(e.target.value)}
                        className="rounded-md p-1 text-sm"
                        style={{ backgroundColor: colors.input, borderColor: colors.border, border: '1px solid' }}
                        disabled={!['POST', 'PUT', 'PATCH'].includes(method)}
                      >
                        <option value="json">JSON</option>
                        <option value="text">Text</option>
                      </select>
                      {bodyType === 'json' && (
                        <button 
                          onClick={formatJsonBody}
                          className="text-white text-xs rounded px-2 py-1 transition-colors duration-200"
                          style={{ backgroundColor: colors.accent }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = colors.accentHover)}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = colors.accent)}
                          disabled={!['POST', 'PUT', 'PATCH'].includes(method)}
                        >
                          Format
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {showBody && (
                  <div>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder={bodyType === 'json' ? '{\n  "key": "value"\n}' : 'Enter request body'}
                      className="rounded-md p-2 w-full h-40 font-mono text-sm"
                      style={{ 
                        backgroundColor: colors.input, 
                        borderColor: bodyError ? colors.error : colors.border, 
                        border: '1px solid' 
                      }}
                      disabled={!['POST', 'PUT', 'PATCH'].includes(method)}
                    />
                    {bodyError && <p style={{ color: colors.error }} className="text-sm mt-1">{bodyError}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Response Section */}
          <div className="rounded-md overflow-hidden" 
            style={{ backgroundColor: colors.secondary, borderColor: colors.border, border: '1px solid' }}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold">Response</h2>
                  {(response || error) && (
                    <button 
                      onClick={clearResponse}
                      className="ml-3 text-sm text-white px-2 py-1 rounded transition-colors duration-200"
                      style={{ backgroundColor: '#6b7280' }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4b5563')}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#6b7280')}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex items-center">
                  {response && (
                    <>
                      <span style={{ color: getStatusColor(response.status) }} className="font-medium mr-2">
                        {response.status} {response.statusText}
                      </span>
                      <span className="text-sm mr-2">{response.time} ms</span>
                      <button 
                        onClick={downloadResponse}
                        className="text-sm text-white px-2 py-1 rounded transition-colors duration-200"
                        style={{ backgroundColor: colors.success }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = colors.success)}
                      >
                        Download
                      </button>
                    </>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-sm">Waiting for response... ({timeout}s timeout)</p>
                </div>
              ) : error ? (
                <div className="px-4 py-3 rounded relative mb-4"
                  style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', borderColor: colors.error, border: '1px solid' }}>
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              ) : response ? (
                <div>
                  <div className="flex border-b mb-4" style={{ borderColor: colors.border }}>
                    <button
                      className="px-4 py-2 transition-colors duration-200"
                      style={{ backgroundColor: responseTab === 'result' ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                      onClick={() => setResponseTab('result')}
                      onMouseOver={(e) => responseTab !== 'result' && (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.025)')}
                      onMouseOut={(e) => responseTab !== 'result' && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      Result
                    </button>
                    <button
                      className="px-4 py-2 transition-colors duration-200"
                      style={{ backgroundColor: responseTab === 'headers' ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                      onClick={() => setResponseTab('headers')}
                      onMouseOver={(e) => responseTab !== 'headers' && (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.025)')}
                      onMouseOut={(e) => responseTab !== 'headers' && (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      Headers
                    </button>
                  </div>

                  {responseTab === 'result' ? (
                    <pre className="rounded-md p-4 overflow-auto h-64 text-sm font-mono"
                      style={{ backgroundColor: colors.input, borderColor: colors.border, border: '1px solid' }}>
                      {typeof response.data === 'object' 
                        ? prettyPrintJson(response.data) 
                        : response.data}
                    </pre>
                  ) : (
                    <div className="rounded-md p-4 overflow-auto h-64"
                      style={{ backgroundColor: colors.input, borderColor: colors.border, border: '1px solid' }}>
                      <table className="w-full text-sm">
                        <thead>
                          <tr>
                            <th className="text-left pb-2">Key</th>
                            <th className="text-left pb-2">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {response.headers.map(([key, value], index) => (
                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                              <td className="py-1 pr-4 font-medium">{key}</td>
                              <td className="py-1">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-center items-center h-64" style={{ color: colors.textSecondary }}>
                  No response yet. Send a request to see the results.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}