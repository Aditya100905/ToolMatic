import { useState, useEffect, useCallback } from 'react';

export default function RegexTester({ theme = 'light' }) {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [inputText, setInputText] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [groupResults, setGroupResults] = useState([]);
  const [showGroupResults, setShowGroupResults] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [replacement, setReplacement] = useState('');
  const [replacedText, setReplacedText] = useState('');
  const [showReplaceResults, setShowReplaceResults] = useState(false);
  const [selectedExample, setSelectedExample] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Theme colors
  const themes = {
    light: {
      background: 'bg-gray-100',
      card: 'bg-white',
      text: 'text-gray-800',
      border: 'border-gray-300',
      input: 'bg-white border-gray-300',
      highlight: 'bg-blue-500 text-white',
      buttonPrimary: 'bg-blue-500 hover:bg-blue-600 text-white',
      buttonSecondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
      errorText: 'text-red-500',
      matchHighlight: 'bg-yellow-200',
      groupHighlight: 'bg-green-200',
      successText: 'text-green-500',
    },
    dark: {
      background: 'bg-gray-900',
      card: 'bg-gray-800',
      text: 'text-gray-200',
      border: 'border-gray-700',
      input: 'bg-gray-800 border-gray-700 text-white',
      highlight: 'bg-blue-600 text-white',
      buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
      buttonSecondary: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
      errorText: 'text-red-400',
      matchHighlight: 'bg-yellow-700',
      groupHighlight: 'bg-green-700',
      successText: 'text-green-400',
    }
  };

  const t = themes[currentTheme];

  // Common flag options
  const flagOptions = [
    { value: 'g', label: 'g - Global', description: 'Find all matches' },
    { value: 'i', label: 'i - Case Insensitive', description: 'Ignore case' },
    { value: 'm', label: 'm - Multiline', description: 'Multiline mode' },
    { value: 's', label: 's - Dotall', description: 'Dot matches newlines too' },
    { value: 'u', label: 'u - Unicode', description: 'Unicode support' },
    { value: 'y', label: 'y - Sticky', description: 'Sticky mode' }
  ];

  // Example patterns
  const examples = [
    { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g' },
    { label: 'URL', pattern: 'https?:\\/\\/[\\w\\d\\-._~:/?#[\\]@!$&\'()*+,;=]+', flags: 'g' },
    { label: 'Phone Number', pattern: '\\(\\d{3}\\)\\s?\\d{3}-\\d{4}|\\d{3}-\\d{3}-\\d{4}', flags: 'g' },
    { label: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}', flags: 'g' },
    { label: 'HTML Tag', pattern: '<([a-z]+)([^<]+)*(?:>(.*?)<\\/\\1>|\\s+\\/?>)', flags: 'gi' },
    { label: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
    { label: 'Password Strength', pattern: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$', flags: '' },
  ];

  // Toggle theme function
  const toggleTheme = () => {
    setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  // Reset all fields
  const resetAll = () => {
    setPattern('');
    setFlags('g');
    setInputText('');
    setMatches([]);
    setError(null);
    setGroupResults([]);
    setShowGroupResults(false);
    setExplanation('');
    setShowExplanation(false);
    setReplacement('');
    setReplacedText('');
    setShowReplaceResults(false);
    setSelectedExample('');
  };

  // Effect to update when props change
  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Generate explanation for the regex pattern
  const generateExplanation = useCallback(() => {
    if (!pattern) {
      setExplanation('Enter a regex pattern to see an explanation.');
      return;
    }

    try {
      let parts = [];
      let currentPattern = pattern;

      // Check for common regex patterns and explain them
      if (currentPattern.includes('^')) parts.push('^ - Matches the start of the string');
      if (currentPattern.includes('$')) parts.push('$ - Matches the end of the string');
      if (currentPattern.includes('.')) parts.push('. - Matches any character except newline');
      if (currentPattern.includes('\\d')) parts.push('\\d - Matches any digit (0-9)');
      if (currentPattern.includes('\\D')) parts.push('\\D - Matches any non-digit character');
      if (currentPattern.includes('\\w')) parts.push('\\w - Matches any word character (a-z, A-Z, 0-9, _)');
      if (currentPattern.includes('\\W')) parts.push('\\W - Matches any non-word character');
      if (currentPattern.includes('\\s')) parts.push('\\s - Matches any whitespace character');
      if (currentPattern.includes('\\S')) parts.push('\\S - Matches any non-whitespace character');
      if (currentPattern.includes('\\b')) parts.push('\\b - Word boundary');
      if (currentPattern.includes('\\B')) parts.push('\\B - Non-word boundary');
      
      // Safer regex tests with try/catch
      try {
        if (/\[\^?.*?\]/.test(currentPattern)) parts.push('[ ] - Character class, matches any character inside the brackets');
      } catch (e) {}
      
      try {
        if (/\(.*?\)/.test(currentPattern)) parts.push('( ) - Capturing group, captures the matched content');
      } catch (e) {}
      
      try {
        if (/\(\?:.*?\)/.test(currentPattern)) parts.push('(?:...) - Non-capturing group');
      } catch (e) {}
      
      try {
        if (/\(\?<\w+>.*?\)/.test(currentPattern)) parts.push('(?<name>...) - Named capturing group');
      } catch (e) {}
      
      try {
        if (/\w+\?/.test(currentPattern)) parts.push('? - Makes the preceding token optional (0 or 1 occurrence)');
      } catch (e) {}
      
      try {
        if (/\w+\*/.test(currentPattern)) parts.push('* - Matches 0 or more of the preceding token');
      } catch (e) {}
      
      try {
        if (/\w+\+/.test(currentPattern)) parts.push('+ - Matches 1 or more of the preceding token');
      } catch (e) {}
      
      try {
        if (/\{\d+,?\d*\}/.test(currentPattern)) parts.push('{ } - Quantifier, specifies exact or range of occurrences');
      } catch (e) {}
      
      try {
        if (/\|/.test(currentPattern)) parts.push('| - Alternation, matches either the expression before or after the pipe');
      } catch (e) {}

      if (parts.length === 0) {
        parts.push('Literal text match - Matches the characters exactly as written');
      }

      // Add explanation for flags
      if (flags) {
        parts.push('\nFlags:');
        for (const flag of flags) {
          const flagInfo = flagOptions.find(opt => opt.value === flag);
          if (flagInfo) {
            parts.push(`${flagInfo.label} - ${flagInfo.description}`);
          }
        }
      }

      setExplanation(parts.join('\n'));
    } catch (err) {
      setExplanation('Unable to explain the current pattern.');
    }
  }, [pattern, flags, flagOptions]);

  // Check for potential catastrophic backtracking
  const checkBacktrackingRisk = useCallback(() => {
    if (!pattern) return null;
    
    // Patterns that might cause catastrophic backtracking
    const riskyPatterns = [
      { test: (p) => /\(\w+\)\+/.test(p), message: "Nested quantifiers ((\\w+)+) can cause catastrophic backtracking" },
      { test: (p) => /\(\w*\)\*/.test(p), message: "Nested quantifiers ((\\w*)*) can cause catastrophic backtracking" },
      { test: (p) => /\(\.\*\)\{2,\}/.test(p), message: "Nested quantifiers ((.*){2,}) can cause catastrophic backtracking" },
      { test: (p) => /\(\.\+\)\{2,\}/.test(p), message: "Nested quantifiers ((.+){2,}) can cause catastrophic backtracking" },
      { test: (p) => /\(\w+\|\s+\)\*/.test(p), message: "Alternation with quantifiers ((\\w+|\\s+)*) can cause backtracking issues" },
    ];

    // Use try-catch for each pattern test to avoid crashes
    for (const risky of riskyPatterns) {
      try {
        if (risky.test(pattern)) {
          return risky.message;
        }
      } catch (e) {
        // Skip this check if it causes an error
      }
    }
    
    return null;
  }, [pattern]);

  // Test the regex against the input
  const testRegex = useCallback(() => {
    // Clear previous results
    setError(null);
    setMatches([]);
    setGroupResults([]);
    setReplacedText('');

    if (!pattern) return;

    try {
      // Check for potentially dangerous regex patterns
      const riskWarning = checkBacktrackingRisk();
      if (riskWarning) {
        setError(`Warning: ${riskWarning}`);
      }

      if (!inputText) return;

      // Validate regex before creating
      try {
        new RegExp(pattern, flags);
      } catch (regexErr) {
        setError(`Invalid regex: ${regexErr.message}`);
        return;
      }

      const regex = new RegExp(pattern, flags);
      const results = [];
      const groups = [];
      
      let match;
      let iteration = 0;
      const maxIterations = 1000; // Prevent infinite loops
      
      if (flags.includes('g')) {
        try {
          while ((match = regex.exec(inputText)) !== null && iteration < maxIterations) {
            results.push({
              fullMatch: match[0],
              start: match.index,
              end: match.index + match[0].length,
              groups: match.slice(1)
            });
            
            if (match.groups) {
              const namedGroups = Object.entries(match.groups).map(([name, value]) => ({
                name,
                value,
                matchIndex: results.length - 1
              }));
              groups.push(...namedGroups);
            }
            
            // For any numbered groups
            if (match.length > 1) {
              for (let i = 1; i < match.length; i++) {
                groups.push({
                  name: `Group ${i}`,
                  value: match[i],
                  matchIndex: results.length - 1
                });
              }
            }
            
            iteration++;
            // Fix for regex with empty matches - prevent infinite loop
            if (match.index === regex.lastIndex) regex.lastIndex++;
          }
        } catch (matchErr) {
          setError(`Error while matching: ${matchErr.message}`);
          return;
        }
      } else {
        try {
          match = regex.exec(inputText);
          if (match) {
            results.push({
              fullMatch: match[0],
              start: match.index,
              end: match.index + match[0].length,
              groups: match.slice(1)
            });
            
            if (match.groups) {
              const namedGroups = Object.entries(match.groups).map(([name, value]) => ({
                name,
                value,
                matchIndex: 0
              }));
              groups.push(...namedGroups);
            }
            
            // For any numbered groups
            if (match.length > 1) {
              for (let i = 1; i < match.length; i++) {
                groups.push({
                  name: `Group ${i}`,
                  value: match[i],
                  matchIndex: 0
                });
              }
            }
          }
        } catch (matchErr) {
          setError(`Error while matching: ${matchErr.message}`);
          return;
        }
      }
      
      // If we hit the max iterations, show a warning
      if (iteration >= maxIterations) {
        setError(`Warning: Reached maximum iteration limit (${maxIterations}). Some matches may not be shown.`);
      }
      
      setMatches(results);
      setGroupResults(groups);
      generateExplanation();
      
      // Perform replacement if a replacement string is provided
      if (replacement) {
        try {
          const replacedResult = inputText.replace(regex, replacement);
          setReplacedText(replacedResult);
        } catch (replaceErr) {
          setError(prev => prev ? `${prev}\nReplacement error: ${replaceErr.message}` : `Replacement error: ${replaceErr.message}`);
        }
      }
      
      // Add to history if pattern is not empty and not already in history
      if (pattern && !history.some(item => item.pattern === pattern && item.flags === flags)) {
        setHistory(prev => [{ pattern, flags, timestamp: new Date() }, ...prev].slice(0, 10));
      }
      
    } catch (err) {
      setError(`Unexpected error: ${err.message}`);
    }
  }, [pattern, flags, inputText, replacement, history, checkBacktrackingRisk, generateExplanation]);

  // Debounced regex testing - increased delay to avoid too frequent testing
  const debouncedTestRegex = useCallback(debounce(testRegex, 500), [testRegex]);

  // Effect to test regex when inputs change - with safety check
  useEffect(() => {
    if (pattern === null || pattern === undefined) return;
    debouncedTestRegex();
  }, [pattern, flags, inputText, debouncedTestRegex]);

  // Apply example pattern
  const applyExample = (example) => {
    if (!example) return;
    setPattern(example.pattern);
    setFlags(example.flags);
    setSelectedExample(example.label);
  };

  // Apply history item
  const applyHistoryItem = (item) => {
    if (!item) return;
    setPattern(item.pattern);
    setFlags(item.flags);
    setSelectedExample('');
  };

  // Copy to clipboard function
  const copyToClipboard = (text, successMessage) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(
      () => {
        setError(`${successMessage} copied to clipboard!`);
        setTimeout(() => setError(null), 2000);
      },
      (err) => {
        setError(`Could not copy: ${err}`);
      }
    );
  };

  // Format date for history items
  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      return 'Invalid date';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Highlighted text display with matches
  const HighlightedText = () => {
    if (!inputText || !matches || matches.length === 0) {
      return <pre className={`${t.text} whitespace-pre-wrap`}>{inputText}</pre>;
    }
    
    try {
      // Sort matches by start position
      const sortedMatches = [...matches].sort((a, b) => a.start - b.start);
      
      let lastIndex = 0;
      const elements = [];
      
      sortedMatches.forEach((match, idx) => {
        // Add text before the match
        if (match.start > lastIndex) {
          elements.push(
            <span key={`text-${idx}`} className={t.text}>
              {inputText.substring(lastIndex, match.start)}
            </span>
          );
        }
        
        // Add the matched text
        elements.push(
          <span 
            key={`match-${idx}`} 
            className={`${t.matchHighlight} px-1 rounded`}
            title={`Match ${idx + 1}: "${match.fullMatch}"`}
          >
            {inputText.substring(match.start, match.end)}
          </span>
        );
        
        lastIndex = match.end;
      });
      
      // Add any remaining text
      if (lastIndex < inputText.length) {
        elements.push(
          <span key="text-end" className={t.text}>
            {inputText.substring(lastIndex)}
          </span>
        );
      }
      
      return <pre className="whitespace-pre-wrap">{elements}</pre>;
    } catch (err) {
      return <pre className={`${t.text} whitespace-pre-wrap`}>{inputText}</pre>;
    }
  };

  return (
    <div className={`${t.background} min-h-screen mt-12 flex items-center justify-center pt-16 pb-8 px-4 transition-colors duration-300`}>
      <div className="w-full max-w-4xl">
        <div className={`${t.card} rounded-lg shadow-lg p-6 ${t.border} border mb-4`}>
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-2xl font-bold ${t.text}`}>Advanced Regex Tester</h1>
            <div className="flex gap-2">
              <button
                onClick={resetAll}
                className={`px-4 py-2 rounded-md ${t.buttonSecondary} transition-colors`}
                aria-label="Reset all fields"
              >
                Reset
              </button>

            </div>
          </div>

          {/* Examples dropdown */}
          <div className="mb-4">
            <label className={`block mb-2 font-medium ${t.text}`}>
              Example Patterns
            </label>
            <div className="flex flex-wrap gap-2">
              <select 
                value={selectedExample} 
                onChange={(e) => {
                  const example = examples.find(ex => ex.label === e.target.value);
                  if (example) {
                    applyExample(example);
                  } else {
                    setSelectedExample(e.target.value);
                  }
                }}
                className={`${t.input} border rounded-md outline-none p-2 ${t.text}`}
                aria-label="Select an example regex pattern"
              >
                <option value="">-- Select Example --</option>
                {examples.map((ex) => (
                  <option key={ex.label} value={ex.label}>{ex.label}</option>
                ))}
              </select>
              
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`px-4 py-2 rounded-md ${t.buttonSecondary}`}
                aria-label="Toggle history panel"
              >
                {showHistory ? 'Hide History' : 'History'}
              </button>
            </div>
          </div>

          {/* History panel */}
          {showHistory && history.length > 0 && (
            <div className={`mb-4 p-3 border ${t.border} rounded-md ${t.text}`}>
              <h3 className="font-bold mb-2">History</h3>
              <div className="max-h-40 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${t.border}`}>
                      <th className="text-left py-2">Pattern</th>
                      <th className="text-left py-2">Flags</th>
                      <th className="text-left py-2">Time</th>
                      <th className="text-left py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, idx) => (
                      <tr key={idx} className={`border-b ${t.border}`}>
                        <td className="py-2 truncate max-w-xs">{item.pattern}</td>
                        <td className="py-2">{item.flags}</td>
                        <td className="py-2">{formatDate(item.timestamp)}</td>
                        <td className="py-2">
                          <button
                            onClick={() => applyHistoryItem(item)}
                            className={`px-2 py-1 text-sm rounded ${t.buttonSecondary}`}
                            aria-label="Apply this history item"
                          >
                            Use
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pattern input */}
          <div className="mb-4">
            <label className={`block mb-2 font-medium ${t.text}`} htmlFor="regex-pattern">Regex Pattern</label>
            <div className="flex">
              <span className={`inline-flex items-center px-3 ${t.input} border border-r-0 rounded-l-md ${t.text}`}>/</span>
              <input
                id="regex-pattern"
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className={`flex-1 ${t.input} border rounded-none outline-none p-2 ${t.text}`}
                placeholder="Enter regex pattern"
                aria-label="Regular expression pattern"
              />
              <span className={`inline-flex items-center px-3 ${t.input} border border-l-0 border-r-0 ${t.text}`}>/</span>
              <input
                type="text"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className={`w-16 ${t.input} border rounded-none rounded-r-md outline-none p-2 ${t.text}`}
                placeholder="flags"
                aria-label="Regular expression flags"
              />
              <button
                onClick={() => copyToClipboard(`/${pattern}/${flags}`, "Regex")}
                className={`ml-2 px-3 py-2 rounded-md ${t.buttonSecondary}`}
                aria-label="Copy regex to clipboard"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Flag toggles */}
          <div className="mb-4">
            <label className={`block mb-2 font-medium ${t.text}`}>Flags</label>
            <div className="flex flex-wrap gap-2">
              {flagOptions.map((flag) => (
                <button
                  key={flag.value}
                  onClick={() => {
                    setFlags(prev => 
                      prev.includes(flag.value) 
                        ? prev.replace(flag.value, '') 
                        : prev + flag.value
                    );
                  }}
                  className={`px-2 py-1 text-sm rounded ${
                    flags.includes(flag.value) ? t.highlight : t.buttonSecondary
                  }`}
                  title={flag.description}
                  aria-label={flag.description}
                  aria-pressed={flags.includes(flag.value)}
                >
                  {flag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Test string input */}
          <div className="mb-4">
            <label className={`block mb-2 font-medium ${t.text}`} htmlFor="test-string">Test String</label>
            <textarea
              id="test-string"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className={`w-full ${t.input} border rounded-md outline-none p-2 h-32 ${t.text}`}
              placeholder="Enter text to test against the regex pattern"
              aria-label="Text to test the regular expression against"
            />
          </div>

          {/* Replacement string input */}
          <div className="mb-4">
            <label className={`block mb-2 font-medium ${t.text}`} htmlFor="replacement-string">Replacement String</label>
            <div className="flex">
              <input
                id="replacement-string"
                type="text"
                value={replacement}
                onChange={(e) => setReplacement(e.target.value)}
                className={`flex-1 ${t.input} border rounded-md outline-none p-2 ${t.text}`}
                placeholder="Enter replacement text (optional)"
                aria-label="Replacement text for regex substitution"
              />
              <button
                onClick={() => setShowReplaceResults(!showReplaceResults)}
                disabled={!replacement || matches.length === 0}
                className={`ml-2 px-4 py-2 rounded-md ${t.buttonSecondary} ${(!replacement || matches.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label="Toggle replacement results"
              >
                {showReplaceResults ? 'Hide' : 'Show'} Results
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={testRegex}
              className={`px-4 py-2 rounded-md ${t.buttonPrimary}`}
              aria-label="Test the regex pattern"
            >
              Test Regex
            </button>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className={`px-4 py-2 rounded-md ${t.buttonSecondary}`}
              aria-label="Toggle explanation panel"
            >
              {showExplanation ? 'Hide' : 'Show'} Explanation
            </button>
            <button
              onClick={() => setShowGroupResults(!showGroupResults)}
              className={`px-4 py-2 rounded-md ${t.buttonSecondary} ${groupResults.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={groupResults.length === 0}
              aria-label="Toggle captured groups panel"
            >
              {showGroupResults ? 'Hide' : 'Show'} Groups ({groupResults.length})
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div 
              className={`mb-4 p-3 border ${t.border} rounded-md ${error.includes('copied') ? t.successText : t.errorText}`}
              role="alert"
            >
              {error.includes('copied') ? <strong>Success:</strong> : <strong>Error:</strong>} {error}
            </div>
          )}

          {/* Explanation panel */}
          {showExplanation && (
            <div className={`mb-4 p-3 border ${t.border} rounded-md ${t.text}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Pattern Explanation</h3>
                <button
                  onClick={() => copyToClipboard(explanation, "Explanation")}
                  className={`px-2 py-1 text-sm rounded ${t.buttonSecondary}`}
                  aria-label="Copy explanation to clipboard"
                >
                  Copy
                </button>
              </div>
              <pre className="whitespace-pre-wrap">{explanation}</pre>
            </div>
          )}

          {/* Replace results */}
          {showReplaceResults && replacedText && (
            <div className={`mb-4 p-3 border ${t.border} rounded-md ${t.text}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Replacement Result</h3>
                <button
                  onClick={() => copyToClipboard(replacedText, "Replacement text")}
                  className={`px-2 py-1 text-sm rounded ${t.buttonSecondary}`}
                  aria-label="Copy replacement result to clipboard"
                >
                  Copy
                </button>
              </div>
              <pre className="whitespace-pre-wrap">{replacedText}</pre>
            </div>
          )}

          {/* Results */}
          <div className={`mb-4 p-0 ${matches.length > 0 ? `border ${t.border} rounded-md` : ''}`}>
            {matches.length > 0 && (
              <div className={`p-3 ${t.text}`}>
                <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Matches ({matches.length})</h3>
                  <button
                    onClick={() => copyToClipboard(matches.map(m => m.fullMatch).join('\n'), "Matches")}
                    className={`px-2 py-1 text-sm rounded ${t.buttonSecondary}`}
                    aria-label="Copy matches to clipboard"
                  >
                    Copy All
                  </button>
                </div>
                <HighlightedText />
              </div>
            )}
          </div>

          {/* Captured groups */}
          {showGroupResults && groupResults.length > 0 && (
            <div className={`mb-4 p-3 border ${t.border} rounded-md ${t.text}`}>
              <h3 className="font-bold mb-2">Captured Groups</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${t.border}`}>
                      <th className="text-left p-2">Match #</th>
                      <th className="text-left p-2">Group</th>
                      <th className="text-left p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupResults.map((group, idx) => (
                      <tr key={idx} className={`border-b ${t.border}`}>
                        <td className="p-2">{group.matchIndex + 1}</td>
                        <td className="p-2">{group.name}</td>
                        <td className="p-2">
                          <span className={`px-1 rounded ${t.groupHighlight}`}>
                            {group.value !== undefined ? group.value : '(undefined)'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className={`text-center ${t.text} text-sm`}>
          Advanced Regex Tester - A tool for testing and learning regular expressions
        </div>
      </div>
    </div>
  );
}