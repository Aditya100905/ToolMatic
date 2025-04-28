import { useState, useEffect } from 'react';
import { Save, Copy, RefreshCw, Unlock, Eye, EyeOff, Settings, History, ChevronDown, ChevronRight, Award, Check, AlertCircle, Download, Key } from 'lucide-react';

export default function PasswordGenerator({ theme = 'dark' }) {
  // Basic settings
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  
  // Advanced settings
  const [excludeSimilarChars, setExcludeSimilarChars] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [requireAllTypes, setRequireAllTypes] = useState(true);
  const [minNumbers, setMinNumbers] = useState(1);
  const [minSymbols, setMinSymbols] = useState(1);
  const [minUppercase, setMinUppercase] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Word-based password options
  const [useWords, setUseWords] = useState(false);
  const [wordCount, setWordCount] = useState(4);
  const [wordSeparator, setWordSeparator] = useState('-');
  
  // UI states
  const [copied, setCopied] = useState(false);
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: 'None',
    feedback: []
  });
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Enhanced theme-based colors with better dark mode
  const themeColors = {
    dark: {
      background: '#0e0e0e',
      cardBackground: '#121212',
      panelBackground: '#1a1a1a',
      text: '#f8fafc',
      border: '#2a2a2a',
      primary: '#6366f1',
      secondary: '#4f46e5',
      success: '#22c55e',
      danger: '#ef4444',
      slider: '#4f46e5',
      infoText: '#94a3b8',
      inputBackground: '#1e1e1e'
    },
    light: {
      background: '#f8fafc',
      cardBackground: '#ffffff',
      panelBackground: '#f1f5f9',
      text: '#1e293b',
      border: '#e2e8f0',
      primary: '#6366f1',
      secondary: '#4f46e5',
      success: '#22c55e',
      danger: '#ef4444',
      slider: '#3b82f6',
      infoText: '#64748b',
      inputBackground: '#ffffff'
    }
  };

  const colors = themeColors[theme];

  // Sample word list for word-based passwords
  const commonWords = [
    "apple", "banana", "carrot", "dolphin", "elephant", "forest", "guitar", "harbor",
    "island", "jungle", "koala", "lemon", "mango", "noodle", "orange", "penguin",
    "quasar", "rabbit", "sunset", "turtle", "umbrella", "violet", "window", "xylophone",
    "yellow", "zebra", "anchor", "butter", "canvas", "diamond", "eagle", "fossil"
  ];

  // Generate password on component mount
  useEffect(() => {
    generatePassword();
  }, []);

  // Evaluate password strength whenever password changes
  useEffect(() => {
    if (password) {
      const strength = evaluatePasswordStrength(password);
      setPasswordStrength(strength);
    }
  }, [password]);

  // Function to generate a character-based password
  const generateCharacterPassword = () => {
    let charset = {
      lowercase: includeLowercase ? 'abcdefghijklmnopqrstuvwxyz' : '',
      uppercase: includeUppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '',
      numbers: includeNumbers ? '0123456789' : '',
      symbols: includeSymbols ? '!@#$%^&*()_+{}[]|:;<>,.?/~' : ''
    };

    // Handle similar character exclusion
    if (excludeSimilarChars) {
      charset.lowercase = charset.lowercase.replace(/[ilo]/g, '');
      charset.uppercase = charset.uppercase.replace(/[IO]/g, '');
      charset.numbers = charset.numbers.replace(/[10]/g, '');
    }

    // Handle ambiguous character exclusion
    if (excludeAmbiguous) {
      charset.symbols = charset.symbols.replace(/[{}[\]()<>:;,.\/'"`~|\\]/g, '');
    }

    // Combine all selected character sets
    let allChars = '';
    if (charset.lowercase) allChars += charset.lowercase;
    if (charset.uppercase) allChars += charset.uppercase;
    if (charset.numbers) allChars += charset.numbers;
    if (charset.symbols) allChars += charset.symbols;

    // Ensure at least one character set is selected
    if (allChars === '') {
      setPassword('');
      return;
    }

    let newPassword = '';
    
    // If we require all types and have enough length
    if (requireAllTypes && length >= 
        (minUppercase + minNumbers + minSymbols + (includeLowercase ? 1 : 0))) {
      
      // Add required uppercase characters
      for (let i = 0; i < minUppercase && includeUppercase; i++) {
        const randomIndex = Math.floor(Math.random() * charset.uppercase.length);
        newPassword += charset.uppercase[randomIndex];
      }
      
      // Add required numbers
      for (let i = 0; i < minNumbers && includeNumbers; i++) {
        const randomIndex = Math.floor(Math.random() * charset.numbers.length);
        newPassword += charset.numbers[randomIndex];
      }
      
      // Add required symbols
      for (let i = 0; i < minSymbols && includeSymbols; i++) {
        const randomIndex = Math.floor(Math.random() * charset.symbols.length);
        newPassword += charset.symbols[randomIndex];
      }
      
      // Add required lowercase if needed
      if (includeLowercase && newPassword.length < length) {
        const randomIndex = Math.floor(Math.random() * charset.lowercase.length);
        newPassword += charset.lowercase[randomIndex];
      }
    }
    
    // Fill the rest randomly
    while (newPassword.length < length) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      newPassword += allChars[randomIndex];
    }
    
    // Shuffle the password characters
    newPassword = shuffleString(newPassword);
    return newPassword;
  };

  // Function to generate a word-based password
  const generateWordPassword = () => {
    let newPassword = [];
    
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * commonWords.length);
      let word = commonWords[randomIndex];
      
      // Capitalize first letter if uppercase is included
      if (includeUppercase && Math.random() > 0.5) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      
      newPassword.push(word);
    }
    
    // Add numbers if required
    if (includeNumbers) {
      let numStr = Math.floor(Math.random() * 100).toString();
      newPassword.push(numStr);
    }
    
    // Add symbols if required
    if (includeSymbols) {
      const symbols = '!@#$%^&*';
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      newPassword.push(randomSymbol);
    }
    
    // Shuffle and join with separator
    newPassword = shuffleArray(newPassword);
    return newPassword.join(wordSeparator);
  };

  // Master generate function that decides which generator to use
  const generatePassword = () => {
    const newPassword = useWords ? generateWordPassword() : generateCharacterPassword();
    setPassword(newPassword);
    
    // Add to history, keeping only the latest 10 passwords
    setPasswordHistory(prev => [newPassword, ...prev.slice(0, 9)]);
  };

  // Helper function to shuffle a string
  const shuffleString = (str) => {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
  };

  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Detailed password strength evaluation
  const evaluatePasswordStrength = (pwd) => {
    let score = 0;
    let feedback = [];
    
    // Base score from length
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (pwd.length >= 20) score += 1;
    
    // Diversity scoring
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSymbols = /[^A-Za-z0-9]/.test(pwd);
    
    if (hasUppercase) score += 1;
    if (hasLowercase) score += 1;
    if (hasNumbers) score += 1;
    if (hasSymbols) score += 1;
    
    // Distribution scoring
    const uppercaseRatio = (pwd.match(/[A-Z]/g) || []).length / pwd.length;
    const lowercaseRatio = (pwd.match(/[a-z]/g) || []).length / pwd.length;
    const numbersRatio = (pwd.match(/[0-9]/g) || []).length / pwd.length;
    const symbolsRatio = (pwd.match(/[^A-Za-z0-9]/g) || []).length / pwd.length;
    
    // Good distribution increases score
    if (uppercaseRatio > 0.1 && uppercaseRatio < 0.9) score += 0.5;
    if (lowercaseRatio > 0.1 && lowercaseRatio < 0.9) score += 0.5;
    if (numbersRatio > 0.1 && numbersRatio < 0.9) score += 0.5;
    if (symbolsRatio > 0.1 && symbolsRatio < 0.9) score += 0.5;
    
    // Pattern detection
    const sequences = ['abcdefghijklmnopqrstuvwxyz', '0123456789', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
    let hasSequence = false;
    
    sequences.forEach(seq => {
      for (let i = 0; i < seq.length - 2; i++) {
        const fragment = seq.slice(i, i + 3);
        if (pwd.toLowerCase().includes(fragment)) {
          hasSequence = true;
          score -= 1;
          feedback.push('Contains a common sequence');
          break;
        }
      }
    });
    
    // Repeated characters
    const repeats = pwd.match(/(.)\1{2,}/g);
    if (repeats) {
      score -= repeats.length;
      feedback.push('Contains repeated characters');
    }
    
    // Determine label
    let label = 'Very Weak';
    if (score >= 3) label = 'Weak';
    if (score >= 5) label = 'Medium';
    if (score >= 7) label = 'Strong';
    if (score >= 9) label = 'Very Strong';
    
    // Provide feedback
    if (pwd.length < 8) {
      feedback.push('Password is too short');
    }
    
    if (!hasUppercase) {
      feedback.push('Add uppercase letters');
    }
    
    if (!hasLowercase) {
      feedback.push('Add lowercase letters');
    }
    
    if (!hasNumbers) {
      feedback.push('Add numbers');
    }
    
    if (!hasSymbols) {
      feedback.push('Add symbols');
    }
    
    return {
      score: Math.max(0, Math.min(10, score)),
      label,
      feedback: feedback.slice(0, 3) // Limit to top 3 feedback items
    };
  };

  // Function to copy password to clipboard
  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Function to select a password from history
  const selectFromHistory = (pwd) => {
    setPassword(pwd);
    setShowHistory(false);
  };

  // Function to export passwords
  const exportPasswords = () => {
    if (passwordHistory.length === 0) return;
    
    const content = passwordHistory.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const href = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = href;
    link.download = 'password_history.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  // Get color for password strength indicator
  const getStrengthColor = () => {
    const { score } = passwordStrength;
    if (score < 3) return colors.danger;
    if (score < 7) return '#fbbf24'; // amber
    return colors.success;
  };

  // Get password analysis stats
  const getPasswordAnalysis = () => {
    if (!password) return null;
    
    const length = password.length;
    const uppercase = (password.match(/[A-Z]/g) || []).length;
    const lowercase = (password.match(/[a-z]/g) || []).length;
    const numbers = (password.match(/[0-9]/g) || []).length;
    const symbols = (password.match(/[^A-Za-z0-9]/g) || []).length;
    
    // Calculate entropy
    let possibleChars = 0;
    if (uppercase > 0) possibleChars += 26;
    if (lowercase > 0) possibleChars += 26;
    if (numbers > 0) possibleChars += 10;
    if (symbols > 0) possibleChars += 33;
    
    const entropy = Math.log2(Math.pow(possibleChars, length)).toFixed(2);
    
    // Calculate crack time estimation (very rough approximation)
    const passwordsPerSecond = 1000000000; // 1 billion passwords per second
    const combinations = Math.pow(possibleChars, length);
    const secondsToCrack = combinations / (passwordsPerSecond * 2);
    
    // Convert seconds to human-readable time
    let crackTime = '';
    if (secondsToCrack < 60) {
      crackTime = 'instantly';
    } else if (secondsToCrack < 3600) {
      crackTime = `${Math.floor(secondsToCrack / 60)} minutes`;
    } else if (secondsToCrack < 86400) {
      crackTime = `${Math.floor(secondsToCrack / 3600)} hours`;
    } else if (secondsToCrack < 31536000) {
      crackTime = `${Math.floor(secondsToCrack / 86400)} days`;
    } else if (secondsToCrack < 31536000 * 100) {
      crackTime = `${Math.floor(secondsToCrack / 31536000)} years`;
    } else {
      crackTime = 'centuries';
    }
    
    return {
      length,
      uppercase,
      lowercase,
      numbers,
      symbols,
      entropy,
      crackTime
    };
  };

  const analysis = getPasswordAnalysis();

  // Get strength icon based on score
  const getStrengthIcon = () => {
    const { score } = passwordStrength;
    if (score < 3) return <AlertCircle size={20} color={colors.danger} />;
    if (score < 7) return <Award size={20} color="#fbbf24" />;
    return <Award size={20} color={colors.success} />;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
      {/* Header Banner */}
      <div className="w-full py-4 shadow-md" style={{ backgroundColor: colors.primary }}>
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Key size={24} className="mr-2 text-white" />
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">Advanced Password Generator</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Password Display and Strength */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="rounded-xl shadow-lg overflow-hidden transition-all duration-300" style={{ backgroundColor: colors.cardBackground, color: colors.text, borderColor: colors.border }}>
                <div className="p-6">
                  {/* Password Output */}
                  <div className="mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-center p-4 rounded-lg mb-3" style={{ backgroundColor: colors.panelBackground, border: `1px solid ${colors.border}` }}>
                      <div className="w-full md:w-3/4 overflow-x-auto mb-3 md:mb-0">
                        <p className="font-mono text-lg md:text-xl break-all select-all">{password || 'Click Generate'}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={generatePassword}
                          className="px-4 py-2 rounded-md font-medium transition-transform hover:opacity-90 text-white flex items-center"
                          style={{ backgroundColor: colors.secondary }}
                        >
                          <RefreshCw size={16} className="mr-1" />
                          Generate
                        </button>
                        <button 
                          onClick={copyToClipboard}
                          className="px-4 py-2 rounded-md transition-colors hover:opacity-90 flex items-center"
                          style={{ backgroundColor: copied ? colors.success : colors.primary, color: 'white' }}
                        >
                          {copied ? <Check size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    {/* Password Strength Section */}
                    <div className="rounded-lg p-4 shadow-md" style={{ backgroundColor: colors.panelBackground }}>
                      <div className="flex items-center mb-3">
                        <h2 className="text-lg font-semibold">Password Strength</h2>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-3" style={{ backgroundColor: theme === 'dark' ? '#2a2a2a' : '#e2e8f0' }}>
                          <div 
                            className="h-3 rounded-full transition-all duration-300" 
                            style={{ 
                              width: `${(passwordStrength.score / 10) * 100}%`,
                              backgroundColor: getStrengthColor()
                            }} 
                          ></div>
                        </div>
                        <div className="ml-3 font-medium flex items-center" style={{ color: getStrengthColor() }}>
                          {getStrengthIcon()}
                          <span className="ml-1">{passwordStrength.label}</span>
                        </div>
                      </div>
                      
                      {/* Password Strength Feedback */}
                      {passwordStrength.feedback.length > 0 && (
                        <div className="text-sm mt-2 p-3 rounded-md" style={{ backgroundColor: theme === 'dark' ? '#232323' : '#f8fafc', color: colors.infoText }}>
                          <h3 className="font-medium mb-1 flex items-center">
                            <AlertCircle size={16} className="mr-1" />
                            Suggestions:
                          </h3>
                          <ul className="list-disc pl-5">
                            {passwordStrength.feedback.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Analysis Toggle */}
                      <button 
                        onClick={() => setShowAnalysis(!showAnalysis)}
                        className="text-sm mt-3 transition-colors hover:opacity-80 flex items-center"
                        style={{ color: colors.primary }}
                      >
                        {showAnalysis ? <EyeOff size={16} className="mr-1" /> : <Eye size={16} className="mr-1" />}
                        {showAnalysis ? 'Hide Details' : 'View Password Details'}
                      </button>
                      
                      {/* Password Analysis */}
                      {showAnalysis && analysis && (
                        <div className="mt-3 p-4 rounded-md text-sm" style={{ backgroundColor: theme === 'dark' ? '#232323' : '#f8fafc' }}>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="p-2 rounded" style={{ backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f1f5f9' }}>
                              <div className="text-xs uppercase" style={{ color: colors.infoText }}>Length</div>
                              <div className="font-mono text-lg">{analysis.length}</div>
                            </div>
                            <div className="p-2 rounded" style={{ backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f1f5f9' }}>
                              <div className="text-xs uppercase" style={{ color: colors.infoText }}>Entropy</div>
                              <div className="font-mono text-lg">{analysis.entropy} bits</div>
                            </div>
                            <div className="p-2 rounded" style={{ backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f1f5f9' }}>
                              <div className="text-xs uppercase" style={{ color: colors.infoText }}>Crack Time</div>
                              <div className="font-semibold">{analysis.crackTime}</div>
                            </div>
                            <div className="p-2 rounded" style={{ backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f1f5f9' }}>
                              <div className="text-xs uppercase" style={{ color: colors.infoText }}>Uppercase</div>
                              <div className="font-mono text-lg">{analysis.uppercase}</div>
                            </div>
                            <div className="p-2 rounded" style={{ backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f1f5f9' }}>
                              <div className="text-xs uppercase" style={{ color: colors.infoText }}>Lowercase</div>
                              <div className="font-mono text-lg">{analysis.lowercase}</div>
                            </div>
                            <div className="p-2 rounded" style={{ backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f1f5f9' }}>
                              <div className="text-xs uppercase" style={{ color: colors.infoText }}>Numbers</div>
                              <div className="font-mono text-lg">{analysis.numbers}</div>
                            </div>
                            <div className="p-2 rounded" style={{ backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f1f5f9' }}>
                              <div className="text-xs uppercase" style={{ color: colors.infoText }}>Symbols</div>
                              <div className="font-mono text-lg">{analysis.symbols}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Password History */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-2">
                        <button 
                          onClick={() => setShowHistory(!showHistory)}
                          className="flex items-center text-sm hover:opacity-90"
                          style={{ color: colors.primary }}
                        >
                          <History size={16} className="mr-1" />
                          <span>Password History ({passwordHistory.length})</span>
                          {showHistory ? <ChevronDown size={16} className="ml-1" /> : <ChevronRight size={16} className="ml-1" />}
                        </button>
                        
                        {passwordHistory.length > 0 && (
                          <button 
                            onClick={exportPasswords}
                            className="text-sm py-1 px-3 rounded border hover:opacity-90 flex items-center"
                            style={{ borderColor: colors.border, color: colors.primary }}
                          >
                            <Download size={14} className="mr-1" />
                            Export
                          </button>
                        )}
                      </div>
                      
                      {showHistory && passwordHistory.length > 0 && (
                        <div className="mt-2 p-2 rounded-md max-h-64 overflow-y-auto" style={{ backgroundColor: colors.panelBackground }}>
                          {passwordHistory.map((pwd, index) => (
                            <div 
                              key={index}
                              onClick={() => selectFromHistory(pwd)}
                              className="p-3 mb-2 rounded font-mono text-sm cursor-pointer hover:opacity-90 flex justify-between items-center"
                              style={{ 
                                backgroundColor: pwd === password 
                                  ? (theme === 'dark' ? '#2a2a2a' : '#e2e8f0') 
                                  : (theme === 'dark' ? '#1e1e1e' : '#f8fafc')
                              }}
                            >
                              <span className="truncate">{pwd}</span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(pwd);
                                }}
                                className="ml-2 px-2 py-1 rounded text-xs hover:bg-opacity-80 flex items-center"
                                style={{ backgroundColor: colors.primary, color: 'white' }}
                              >
                                <Copy size={12} className="mr-1" />
                                Copy
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: colors.cardBackground, color: colors.text, borderColor: colors.border }}>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Settings size={18} className="mr-2" style={{ color: colors.primary }} />
                    <h2 className="text-xl font-semibold">Password Settings</h2>
                  </div>
                  
                  {/* Password Type Selection */}
                  <div className="mb-6">
                    <label className="font-medium mb-2 block">Password Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setUseWords(false)}
                        className="py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                        style={{ 
                          backgroundColor: !useWords ? colors.primary : 'transparent', 
                          color: !useWords ? 'white' : colors.text,
                          border: `1px solid ${!useWords ? colors.primary : colors.border}`
                        }}
                      >
                        <Unlock size={16} className="mr-2" />
                        Character-based
                      </button>
                      <button 
                        onClick={() => setUseWords(true)}
                        className="py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                        style={{ 
                          backgroundColor: useWords ? colors.primary : 'transparent', 
                          color: useWords ? 'white' : colors.text,
                          border: `1px solid ${useWords ? colors.primary : colors.border}`
                        }}
                      >
                        <Unlock size={16} className="mr-2" />
                        Word-based
                      </button>
                    </div>
                  </div>
                  
                  {/* Password Options - character-based */}
                  {!useWords && (
                    <div className="space-y-6">
                      {/* Password Length */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="font-medium">Password Length</label>
                          <span className="font-mono px-2 py-1 rounded" style={{ backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f1f5f9' }}>{length}</span>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="range" 
                            min="8" 
                            max="64"
                            value={length} 
                            onChange={(e) => setLength(parseInt(e.target.value))}
                            className="w-full"
                            style={{ accentColor: colors.slider }}
                          />
                          <span className="ml-3 text-sm" style={{ color: colors.infoText }}>8-64</span>
                        </div>
                      </div>
                      
                      {/* Character Types */}
                      <div>
                        <label className="font-medium block mb-2">Character Types</label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={includeUppercase} 
                                onChange={() => setIncludeUppercase(!includeUppercase)}
                                className="form-checkbox rounded"
                                style={{ accentColor: colors.primary }}
                              />
                              <span className="ml-2">Uppercase (A-Z)</span>
                            </label>
                            {includeUppercase && requireAllTypes && (
                              <div className="flex items-center">
                                <button 
                                  onClick={() => setMinUppercase(Math.max(1, minUppercase - 1))}
                                  className="px-2 py-1 rounded"
                                  style={{ backgroundColor: colors.panelBackground }}
                                >-</button>
                                <span className="mx-2 text-sm">{minUppercase}</span>
                                <button 
                                  onClick={() => setMinUppercase(minUppercase + 1)}
                                  className="px-2 py-1 rounded"
                                  style={{ backgroundColor: colors.panelBackground }}
                                >+</button>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={includeLowercase} 
                                onChange={() => setIncludeLowercase(!includeLowercase)}
                                className="form-checkbox rounded"
                                style={{ accentColor: colors.primary }}
                              />
                              <span className="ml-2">Lowercase (a-z)</span>
                            </label>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={includeNumbers} 
                                onChange={() => setIncludeNumbers(!includeNumbers)}
                                className="form-checkbox rounded"
                                style={{ accentColor: colors.primary }}
                              />
                              <span className="ml-2">Numbers (0-9)</span>
                            </label>
                            {includeNumbers && requireAllTypes && (
                              <div className="flex items-center">
                                <button 
                                  onClick={() => setMinNumbers(Math.max(1, minNumbers - 1))}
                                  className="px-2 py-1 rounded"
                                  style={{ backgroundColor: colors.panelBackground }}
                                >-</button>
                                <span className="mx-2 text-sm">{minNumbers}</span>
                                <button 
                                  onClick={() => setMinNumbers(minNumbers + 1)}
                                  className="px-2 py-1 rounded"
                                  style={{ backgroundColor: colors.panelBackground }}
                                >+</button>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={includeSymbols} 
                                onChange={() => setIncludeSymbols(!includeSymbols)}
                                className="form-checkbox rounded"
                                style={{ accentColor: colors.primary }}
                              />
                              <span className="ml-2">Symbols (!@#$%)</span>
                            </label>
                            {includeSymbols && requireAllTypes && (
                              <div className="flex items-center">
                                <button 
                                  onClick={() => setMinSymbols(Math.max(1, minSymbols - 1))}
                                  className="px-2 py-1 rounded"
                                  style={{ backgroundColor: colors.panelBackground }}
                                >-</button>
                                <span className="mx-2 text-sm">{minSymbols}</span>
                                <button 
                                  onClick={() => setMinSymbols(minSymbols + 1)}
                                  className="px-2 py-1 rounded"
                                  style={{ backgroundColor: colors.panelBackground }}
                                >+</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Advanced Settings Toggle */}
                      <div className="pt-2">
                        <button 
                          onClick={() => setShowAdvanced(!showAdvanced)}
                          className="flex items-center text-sm font-medium"
                          style={{ color: colors.primary }}
                        >
                          {showAdvanced ? <ChevronDown size={16} className="mr-1" /> : <ChevronRight size={16} className="mr-1" />}
                          Advanced Options
                        </button>
                        
                        {showAdvanced && (
                          <div className="mt-4 p-4 rounded-md space-y-4" style={{ backgroundColor: colors.panelBackground }}>
                            <div>
                              <label className="flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={requireAllTypes} 
                                  onChange={() => setRequireAllTypes(!requireAllTypes)}
                                  className="form-checkbox rounded"
                                  style={{ accentColor: colors.primary }}
                                />
                                <span className="ml-2">Require all character types</span>
                              </label>
                            </div>
                            
                            <div>
                              <label className="flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={excludeSimilarChars} 
                                  onChange={() => setExcludeSimilarChars(!excludeSimilarChars)}
                                  className="form-checkbox rounded"
                                  style={{ accentColor: colors.primary }}
                                />
                                <span className="ml-2">Exclude similar characters (1, l, I, 0, O)</span>
                              </label>
                            </div>
                            
                            <div>
                              <label className="flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={excludeAmbiguous} 
                                  onChange={() => setExcludeAmbiguous(!excludeAmbiguous)}
                                  className="form-checkbox rounded"
                                  style={{ accentColor: colors.primary }}
                                />
                                <span className="ml-2">Exclude ambiguous symbols ({ }[ ]( )/ \ ' " ` ~)</span>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Password Options - word-based */}
                  {useWords && (
                    <div className="space-y-6">
                      {/* Word Count */}
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="font-medium">Number of Words</label>
                          <span className="font-mono px-2 py-1 rounded" style={{ backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f1f5f9' }}>{wordCount}</span>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="range" 
                            min="3" 
                            max="8" 
                            value={wordCount} 
                            onChange={(e) => setWordCount(parseInt(e.target.value))}
                            className="w-full"
                            style={{ accentColor: colors.slider }}
                          />
                          <span className="ml-3 text-sm" style={{ color: colors.infoText }}>3-8</span>
                        </div>
                      </div>
                      
                      {/* Word Separator */}
                      <div>
                        <label className="font-medium block mb-2">Word Separator</label>
                        <div className="grid grid-cols-4 gap-2">
                          {['-', '.', '_', ' '].map(sep => (
                            <button 
                              key={sep}
                              onClick={() => setWordSeparator(sep)}
                              className="py-2 px-3 rounded-md font-mono transition-colors"
                              style={{ 
                                backgroundColor: wordSeparator === sep ? colors.primary : 'transparent', 
                                color: wordSeparator === sep ? 'white' : colors.text,
                                border: `1px solid ${wordSeparator === sep ? colors.primary : colors.border}`
                              }}
                            >
                              {sep === ' ' ? '(space)' : sep}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Additional Character Types */}
                      <div>
                        <label className="font-medium block mb-2">Include Additional Characters</label>
                        <div className="space-y-3">
                          <div>
                            <label className="flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={includeUppercase} 
                                onChange={() => setIncludeUppercase(!includeUppercase)}
                                className="form-checkbox rounded"
                                style={{ accentColor: colors.primary }}
                              />
                              <span className="ml-2">Uppercase First Letters</span>
                            </label>
                          </div>
                          
                          <div>
                            <label className="flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={includeNumbers} 
                                onChange={() => setIncludeNumbers(!includeNumbers)}
                                className="form-checkbox rounded"
                                style={{ accentColor: colors.primary }}
                              />
                              <span className="ml-2">Add Numbers</span>
                            </label>
                          </div>
                          
                          <div>
                            <label className="flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={includeSymbols} 
                                onChange={() => setIncludeSymbols(!includeSymbols)}
                                className="form-checkbox rounded"
                                style={{ accentColor: colors.primary }}
                              />
                              <span className="ml-2">Add Symbols</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8">
                    <button 
                      onClick={generatePassword}
                      className="w-full py-3 rounded-lg font-semibold text-white shadow-md hover:opacity-90 transition-opacity flex items-center justify-center"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <RefreshCw size={18} className="mr-2" />
                      Generate New Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="py-6 shadow-inner mt-8" style={{ backgroundColor: theme === 'dark' ? '#121212' : '#f8fafc' }}>
        <div className="container mx-auto px-4 text-center text-sm" style={{ color: colors.infoText }}>
          <p>Secure Password Generator • Your passwords are generated locally and are never stored or transmitted</p>
        </div>
      </div>
    </div>
  );
}