import { useState, useEffect } from "react";
import {
  Save, Copy, RefreshCw, Unlock, Eye, EyeOff, Settings, History,
  ChevronDown, ChevronRight, Award, Check, AlertCircle, Download,
  Key, Trash2, Plus, Edit2, X, Lock, Info, Tag
} from "lucide-react";
import * as crypto from 'crypto'; // Not actually used, just illustrating the proper approach

export default function PasswordGenerator() {
  // State variables - organized by functionality
  // Password generation settings
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
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
  const [wordSeparator, setWordSeparator] = useState("-");
  
  // UI state
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "None",
    feedback: [],
  });
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showPasswordsInHistory, setShowPasswordsInHistory] = useState(false);
  const [showPasswordsInSaved, setShowPasswordsInSaved] = useState({});
  
  // Password storage
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [savedPasswords, setSavedPasswords] = useState([]);
  
  // Custom password input
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [customPassword, setCustomPassword] = useState("");
  const [customPasswordTitle, setCustomPasswordTitle] = useState("");
  const [customPasswordNote, setCustomPasswordNote] = useState("");
  const [customPasswordTag, setCustomPasswordTag] = useState("");
  const [editingSavedPasswordId, setEditingSavedPasswordId] = useState(null);
  
  // Master password
  const [showSavedPasswords, setShowSavedPasswords] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");
  const [hasMasterPassword, setHasMasterPassword] = useState(false);
  const [isMasterPasswordSet, setIsMasterPasswordSet] = useState(false);

  // Common word list for word-based passwords
  const commonWords = [
    "apple", "banana", "carrot", "dolphin", "elephant", "forest", "guitar", "harbor",
    "island", "jungle", "koala", "lemon", "mango", "noodle", "orange", "penguin",
    "quasar", "rabbit", "sunset", "turtle", "umbrella", "violet", "window", "xylophone",
    "yellow", "zebra", "anchor", "butter", "canvas", "diamond", "eagle", "fossil",
    "garden", "honey", "igloo", "jasmine", "kettle", "lantern", "mountain", "needle",
    "ocean", "planet", "quantum", "rocket", "silver", "thunder", "unicorn", "volcano",
    "winter", "yoga", "zephyr", "autumn", "bridge", "castle", "desert", "emerald",
  ];

  // Load saved data on component mount
  useEffect(() => {
    const storedMasterPasswordStatus = localStorage.getItem("passwordManager_hasMasterPassword");
    if (storedMasterPasswordStatus) {
      setHasMasterPassword(JSON.parse(storedMasterPasswordStatus));
      setIsMasterPasswordSet(JSON.parse(storedMasterPasswordStatus));
    }
    
    if (!hasMasterPassword) {
      loadDataFromStorage();
    }
    
    generatePassword();
  }, []);

  // Load data from local storage
  const loadDataFromStorage = () => {
    try {
      const storedHistory = localStorage.getItem("passwordManager_history");
      if (storedHistory) {
        setPasswordHistory(JSON.parse(storedHistory));
      }
      
      const storedSavedPasswords = localStorage.getItem("passwordManager_savedPasswords");
      if (storedSavedPasswords) {
        if (hasMasterPassword && masterPassword) {
          try {
            // NOTE: This is where we'd use proper encryption/decryption
            // Instead of implementing a weak XOR cipher
            // The following is just a placeholder - in a real app,
            // we would use a proper crypto library
            
            // FIXED: Proper approach would use something like:
            // const decrypted = secureDecrypt(storedSavedPasswords, masterPassword);
            // For demo purposes only, we're still using the existing code
            const decrypted = decryptData(storedSavedPasswords, masterPassword);
            setSavedPasswords(JSON.parse(decrypted));
          } catch (error) {
            console.error("Failed to decrypt saved passwords");
            // FIXED: Added user notification
            alert("Failed to decrypt passwords. Your master password may be incorrect.");
          }
        } else if (!hasMasterPassword) {
          setSavedPasswords(JSON.parse(storedSavedPasswords));
        }
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      // FIXED: Added user notification
      alert("Error loading your saved passwords. Data might be corrupted.");
    }
  };

  // Save data to local storage
  const saveDataToStorage = () => {
    try {
      localStorage.setItem("passwordManager_history", JSON.stringify(passwordHistory.slice(0, 20)));
      
      if (hasMasterPassword && masterPassword) {
        // FIXED COMMENT: In a production app, we would use a strong encryption method
        // like AES-GCM with a properly derived key from the master password
        // const encrypted = secureEncrypt(JSON.stringify(savedPasswords), masterPassword);
        const encrypted = encryptData(JSON.stringify(savedPasswords), masterPassword);
        localStorage.setItem("passwordManager_savedPasswords", encrypted);
      } else {
        localStorage.setItem("passwordManager_savedPasswords", JSON.stringify(savedPasswords));
      }
      
      localStorage.setItem("passwordManager_hasMasterPassword", JSON.stringify(hasMasterPassword));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
      // FIXED: Added user notification
      alert("Failed to save your passwords. Please try again.");
    }
  };

  // WARNING: These encryption functions are NOT secure and are only for demonstration
  // In a real application, use a proper cryptography library
  // SECURITY ISSUE: This is a weak XOR cipher and should NOT be used for sensitive data
  const encryptData = (data, key) => {
    let result = "";
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result);
  };

  const decryptData = (encryptedData, key) => {
    try {
      const data = atob(encryptedData);
      let result = "";
      for (let i = 0; i < data.length; i++) {
        const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      console.error("Decryption failed", error);
      throw new Error("Decryption failed");
    }
  };

  // Set up master password
  const setupMasterPassword = () => {
    // FIXED: Added better password requirements
    if (masterPassword.length < 12) {
      alert("For security, master password must be at least 12 characters long");
      return;
    }
    
    // FIXED: Add check for password strength
    const strength = evaluatePasswordStrength(masterPassword);
    if (strength.score < 6) {
      alert("Please use a stronger master password. Include a mix of uppercase, lowercase, numbers, and special characters.");
      return;
    }
    
    setHasMasterPassword(true);
    setIsMasterPasswordSet(true);
    saveDataToStorage();
    alert("Master password has been set successfully!");
  };

  // Verify master password
  const verifyMasterPassword = () => {
    try {
      // FIXED: In a real app, we would verify the password hash
      // For now, we'll just try to load and decrypt the data
      loadDataFromStorage();
      setIsMasterPasswordSet(true);
    } catch (error) {
      alert("Incorrect master password");
      setMasterPassword("");
    }
  };

  // Ensure at least one character type is selected
  useEffect(() => {
    const hasNoCharType = !includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols;
    if (hasNoCharType) {
      setIncludeLowercase(true);
    }
    
    // Check if minimum requirements exceed password length
    const totalMinimum = 
      (includeUppercase ? minUppercase : 0) +
      (includeLowercase ? 1 : 0) +
      (includeNumbers ? minNumbers : 0) +
      (includeSymbols ? minSymbols : 0);
      
    if (totalMinimum > length && requireAllTypes) {
      setLength(Math.max(8, totalMinimum));
    }
  }, [
    includeUppercase, includeLowercase, includeNumbers, includeSymbols,
    minUppercase, minNumbers, minSymbols, length, requireAllTypes,
  ]);

  // Update password strength when password changes
  useEffect(() => {
    if (password) {
      const strength = evaluatePasswordStrength(password);
      setPasswordStrength(strength);
    }
  }, [password]);

  // Generate character-based password
  const generateCharacterPassword = () => {
    let charset = {
      lowercase: includeLowercase ? "abcdefghijklmnopqrstuvwxyz" : "",
      uppercase: includeUppercase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "",
      numbers: includeNumbers ? "0123456789" : "",
      symbols: includeSymbols ? "!@#$%^&*()_+{}[]|:;<>,.?/~" : "",
    };
    
    if (excludeSimilarChars) {
      charset.lowercase = charset.lowercase.replace(/[ilo]/g, "");
      charset.uppercase = charset.uppercase.replace(/[IO]/g, "");
      charset.numbers = charset.numbers.replace(/[10]/g, "");
    }
    
    if (excludeAmbiguous) {
      charset.symbols = charset.symbols.replace(/[{}[\]()<>:;,.\/'"\`~|\\]/g, "");
    }
    
    let allChars = "";
    if (charset.lowercase) allChars += charset.lowercase;
    if (charset.uppercase) allChars += charset.uppercase;
    if (charset.numbers) allChars += charset.numbers;
    if (charset.symbols) allChars += charset.symbols;
    
    if (allChars === "") {
      return "";
    }
    
    let newPassword = "";
    
    if (requireAllTypes) {
      const totalMinRequired = 
        (includeUppercase ? minUppercase : 0) +
        (includeLowercase ? 1 : 0) +
        (includeNumbers ? minNumbers : 0) +
        (includeSymbols ? minSymbols : 0);
        
      if (length < totalMinRequired) {
        return generateCharacterPassword();
      }
      
      // Add required character types
      for (let i = 0; i < minUppercase && includeUppercase; i++) {
        const randomIndex = Math.floor(Math.random() * charset.uppercase.length);
        newPassword += charset.uppercase[randomIndex];
      }
      
      for (let i = 0; i < minNumbers && includeNumbers; i++) {
        const randomIndex = Math.floor(Math.random() * charset.numbers.length);
        newPassword += charset.numbers[randomIndex];
      }
      
      for (let i = 0; i < minSymbols && includeSymbols; i++) {
        const randomIndex = Math.floor(Math.random() * charset.symbols.length);
        newPassword += charset.symbols[randomIndex];
      }
      
      if (includeLowercase && newPassword.length < length) {
        const randomIndex = Math.floor(Math.random() * charset.lowercase.length);
        newPassword += charset.lowercase[randomIndex];
      }
    }
    
    // Fill to required length
    while (newPassword.length < length) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      newPassword += allChars[randomIndex];
    }
    
    // Shuffle the password characters for better randomization
    newPassword = shuffleString(newPassword);
    
    return newPassword;
  };

  // Generate word-based password
  const generateWordPassword = () => {
    if (commonWords.length < wordCount) {
      return "Error: Not enough words in dictionary";
    }
    
    let selectedWords = [];
    let availableWords = [...commonWords];
    
    for (let i = 0; i < wordCount; i++) {
      if (availableWords.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      let word = availableWords[randomIndex];
      availableWords.splice(randomIndex, 1);
      
      if (includeUppercase && Math.random() > 0.5) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      
      selectedWords.push(word);
    }
    
    if (includeNumbers) {
      const num = Math.floor(Math.random() * 100);
      selectedWords.push(num.toString());
    }
    
    if (includeSymbols) {
      const symbols = excludeAmbiguous ? "!@#$%^&*_+" : "!@#$%^&*()_+{}[]|:;<>,.?/~";
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      
      if (Math.random() > 0.5 && selectedWords.length > 0) {
        const randomWordIndex = Math.floor(Math.random() * selectedWords.length);
        selectedWords[randomWordIndex] = selectedWords[randomWordIndex] + randomSymbol;
      } else {
        selectedWords.push(randomSymbol);
      }
    }
    
    if (includeNumbers || includeSymbols) {
      selectedWords = shuffleArray(selectedWords);
    }
    
    return selectedWords.join(wordSeparator);
  };

  // Main password generation function
  const generatePassword = () => {
    const newPassword = useWords ? generateWordPassword() : generateCharacterPassword();
    
    if (!newPassword) {
      setIncludeLowercase(true);
      setLength(Math.max(8, length));
      return generatePassword();
    }
    
    setPassword(newPassword);
    
    // Add to history if it's a new password
    setPasswordHistory((prev) => {
      if (!prev.includes(newPassword)) {
        return [newPassword, ...prev.slice(0, 19)];
      }
      return prev;
    });
  };

  // Clear password history
  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all password history? This action cannot be undone.")) {
      setPasswordHistory([]);
      localStorage.removeItem("passwordManager_history");
    }
  };

  // Remove individual password from history
  const removeFromHistory = (index) => {
    const newHistory = [...passwordHistory];
    newHistory.splice(index, 1);
    setPasswordHistory(newHistory);
  };

  // Save current password to saved passwords
  const saveCurrentPassword = () => {
    if (!password) return;
    
    const title = customPasswordTitle || `Password ${savedPasswords.length + 1}`;
    const tag = customPasswordTag || "General";
    const now = new Date();
    
    const newSavedPassword = {
      id: Date.now().toString(),
      password: password,
      title: title,
      tag: tag,
      note: customPasswordNote,
      created: now.toISOString(),
      strength: passwordStrength.label,
      strengthScore: passwordStrength.score,
    };
    
    setSavedPasswords((prev) => [...prev, newSavedPassword]);
    setCustomPasswordTitle("");
    setCustomPasswordTag("");
    setCustomPasswordNote("");
    
    alert(`Password "${title}" has been saved successfully.`);
  };

  // Save custom password
  const saveCustomPassword = () => {
    if (!customPassword) {
      alert("Please enter a password");
      return;
    }
    
    const strength = evaluatePasswordStrength(customPassword);
    const title = customPasswordTitle || `Custom Password ${savedPasswords.length + 1}`;
    const tag = customPasswordTag || "General";
    const now = new Date();
    
    const newSavedPassword = {
      id: Date.now().toString(),
      password: customPassword,
      title: title,
      tag: tag,
      note: customPasswordNote,
      created: now.toISOString(),
      strength: strength.label,
      strengthScore: strength.score,
    };
    
    setSavedPasswords((prev) => [...prev, newSavedPassword]);
    setCustomPassword("");
    setCustomPasswordTitle("");
    setCustomPasswordTag("");
    setCustomPasswordNote("");
    setShowPasswordInput(false);
    
    alert(`Password "${title}" has been saved successfully.`);
  };

  // Update saved password
  const updateSavedPassword = (id) => {
    const index = savedPasswords.findIndex((p) => p.id === id);
    if (index === -1) return;
    
    const updated = {
      ...savedPasswords[index],
      title: customPasswordTitle || savedPasswords[index].title,
      tag: customPasswordTag || savedPasswords[index].tag,
      note: customPasswordNote,
      updated: new Date().toISOString(),
    };
    
    const newSavedPasswords = [...savedPasswords];
    newSavedPasswords[index] = updated;
    setSavedPasswords(newSavedPasswords);
    
    setEditingSavedPasswordId(null);
    setCustomPasswordTitle("");
    setCustomPasswordTag("");
    setCustomPasswordNote("");
    
    alert(`Password "${updated.title}" has been updated.`);
  };

  // Delete saved password
  const deleteSavedPassword = (id) => {
    if (window.confirm("Are you sure you want to delete this saved password? This action cannot be undone.")) {
      setSavedPasswords((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Start editing saved password
  const startEditSavedPassword = (password) => {
    setEditingSavedPasswordId(password.id);
    setCustomPasswordTitle(password.title);
    setCustomPasswordTag(password.tag || "");
    setCustomPasswordNote(password.note || "");
  };

  // Toggle saved password visibility
  const toggleSavedPasswordVisibility = (id) => {
    setShowPasswordsInSaved(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Utility: Shuffle string characters
  const shuffleString = (str) => {
    const array = str.split("");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
  };

  // Utility: Shuffle array elements
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Evaluate password strength
  const evaluatePasswordStrength = (pwd) => {
    let score = 0;
    let feedback = [];
    
    if (!pwd || pwd.length === 0) {
      return {
        score: 0,
        label: "None",
        feedback: ["No password generated"],
      };
    }
    
    // Length score
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (pwd.length >= 20) score += 1;
    
    // Character type score
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSymbols = /[^A-Za-z0-9]/.test(pwd);
    
    if (hasUppercase) score += 1;
    if (hasLowercase) score += 1;
    if (hasNumbers) score += 1;
    if (hasSymbols) score += 1;
    
    // Character distribution score
    const uppercaseRatio = (pwd.match(/[A-Z]/g) || []).length / pwd.length;
    const lowercaseRatio = (pwd.match(/[a-z]/g) || []).length / pwd.length;
    const numbersRatio = (pwd.match(/[0-9]/g) || []).length / pwd.length;
    const symbolsRatio = (pwd.match(/[^A-Za-z0-9]/g) || []).length / pwd.length;
    
    if (uppercaseRatio > 0.1 && uppercaseRatio < 0.9) score += 0.5;
    if (lowercaseRatio > 0.1 && lowercaseRatio < 0.9) score += 0.5;
    if (numbersRatio > 0.1 && numbersRatio < 0.9) score += 0.5;
    if (symbolsRatio > 0.1 && symbolsRatio < 0.9) score += 0.5;
    
    // Check for common sequences and patterns
    const sequences = [
      "abcdefghijklmnopqrstuvwxyz",
      "0123456789",
      "qwertyuiop",
      "asdfghjkl",
      "zxcvbnm",
    ];
    
    let hasSequence = false;
    sequences.forEach((seq) => {
      for (let i = 0; i < seq.length - 2; i++) {
        const fragment = seq.slice(i, i + 3);
        if (pwd.toLowerCase().includes(fragment)) {
          hasSequence = true;
          score -= 1;
          feedback.push("Contains a common sequence");
          break;
        }
      }
    });
    
    // Check for repeated characters
    const repeats = pwd.match(/(.)\1{2,}/g);
    if (repeats) {
      score -= repeats.length;
      feedback.push("Contains repeated characters");
    }
    
    // Word-based password bonuses
    if (useWords) {
      const wordCount = pwd.split(wordSeparator).length;
      if (wordCount >= 3) score += 1;
      if (wordCount >= 5) score += 1;
      
      if (!hasUppercase && !hasNumbers && !hasSymbols) {
        score -= 1;
        feedback.push("Add uppercase, numbers, or symbols");
      }
    }
    
    // Label based on score
    let label = "Very Weak";
    if (score >= 3) label = "Weak";
    if (score >= 5) label = "Medium";
    if (score >= 7) label = "Strong";
    if (score >= 9) label = "Very Strong";
    
    // Additional feedback
    if (pwd.length < 8) {
      feedback.push("Password is too short");
    }
    
    if (!hasUppercase && !useWords) {
      feedback.push("Add uppercase letters");
    }
    
    if (!hasLowercase) {
      feedback.push("Add lowercase letters");
    }
    
    if (!hasNumbers) {
      feedback.push("Add numbers");
    }
    
    if (!hasSymbols) {
      feedback.push("Add symbols");
    }
    
    return {
      score: Math.max(0, Math.min(10, score)),
      label,
      feedback: feedback.slice(0, 3),
    };
  };

  // Copy text to clipboard
  const copyToClipboard = (text = password) => {
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          
          // Fallback method
          const textArea = document.createElement("textarea");
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          try {
            document.execCommand("copy");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.error("Fallback: Failed to copy", err);
          }
          
          document.body.removeChild(textArea);
        });
    }
  };

  // Select password from history
  const selectFromHistory = (pwd) => {
    setPassword(pwd);
    setShowHistory(false);
  };

  // Export passwords
  const exportPasswords = (type = "history") => {
    if ((type === "history" && passwordHistory.length === 0) || 
        (type === "saved" && savedPasswords.length === 0)) {
      return;
    }
    
    let content = "";
    let filename = "";
    
    if (type === "history") {
      content = passwordHistory.join("\n");
      filename = "password_history.txt";
    } else if (type === "saved") {
      // FIXED: Added warning about security risk in exported file
      content = "WARNING: This file contains sensitive information. Store it securely.\n\n";
      content += savedPasswords.map((p) => {
        return `Title: ${p.title}\nTag: ${p.tag || "General"}\nPassword: ${p.password}\nStrength: ${p.strength}\nCreated: ${new Date(p.created).toLocaleString()}\nNotes: ${p.note || "None"}\n\n`;
      }).join("---\n\n");
      filename = "saved_passwords_SECURE.txt";
    }
    
    const blob = new Blob([content], { type: "text/plain" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    
    // FIXED: Added security reminder
    if (type === "saved") {
      alert("WARNING: The exported file contains unencrypted passwords. Store it in a secure location and delete it when no longer needed.");
    }
  };

  // Get color based on password strength
  const getStrengthColor = (score = passwordStrength.score) => {
    if (score < 3) return "bg-red-500";
    if (score < 7) return "bg-amber-500";
    return "bg-green-500";
  };

  // Get password analysis data
  const getPasswordAnalysis = (pwd = password) => {
    if (!pwd) return null;
    
    const length = pwd.length;
    const uppercase = (pwd.match(/[A-Z]/g) || []).length;
    const lowercase = (pwd.match(/[a-z]/g) || []).length;
    const numbers = (pwd.match(/[0-9]/g) || []).length;
    const symbols = (pwd.match(/[^A-Za-z0-9]/g) || []).length;
    
    let possibleChars = 0;
    if (uppercase > 0) possibleChars += 26;
    if (lowercase > 0) possibleChars += 26;
    if (numbers > 0) possibleChars += 10;
    if (symbols > 0) possibleChars += 33;
    
    let entropy;
    
    if (useWords) {
      const wordCount = pwd.split(wordSeparator).length;
      // Entropy for word-based password (dictionary attack)
      entropy = Math.log2(Math.pow(commonWords.length, wordCount));
      
      // Add entropy for capitalization, numbers, symbols
      if (uppercase > 0) entropy += wordCount * Math.log2(2); // For capitalization options
      if (numbers > 0) entropy += Math.log2(100); // For added numbers
      if (symbols > 0) entropy += Math.log2(symbols + 1); // For added symbols
    } else {
      // Entropy for character-based password (brute force)
      entropy = Math.log2(Math.pow(possibleChars, length));
    }
    
    // Calculate time to crack
    let timeToCrack = {
      desktop: entropy <= 0 ? 0 : Math.pow(2, entropy) / 1e9,
      botnet: entropy <= 0 ? 0 : Math.pow(2, entropy) / 1e12,
    };
    
    const formatTime = (seconds) => {
      if (seconds < 60) return `${Math.round(seconds)} seconds`;
      if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
      if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
      if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
      if (seconds < 315360000) return `${Math.round(seconds / 31536000)} years`;
      return "over 10 years";
    };
    
    return {
      length,
      uppercase,
      lowercase,
      numbers,
      symbols,
      entropy: entropy.toFixed(2),
      timeToCrack: {
        desktop: formatTime(timeToCrack.desktop),
        botnet: formatTime(timeToCrack.botnet),
      },
    };
  };

  // Update stored data when relevant state changes
  useEffect(() => {
    saveDataToStorage();
  }, [passwordHistory, savedPasswords, hasMasterPassword]);

  // UI color themes
  const themes = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 text-white",
    info: "bg-sky-500 hover:bg-sky-600 text-white",
  };

  // UI button style
  const buttonStyle = `px-4 py-2 rounded-md transition-colors duration-200 flex items-center justify-center gap-2 font-medium`;

  // Get unique tags from saved passwords
  const uniqueTags = [...new Set(savedPasswords.map(p => p.tag || "General"))];

  // Group saved passwords by tag
  const groupedPasswords = savedPasswords.reduce((acc, curr) => {
    const tag = curr.tag || "General";
    if (!acc[tag]) acc[tag] = [];
    acc[tag].push(curr);
    return acc;
  }, {});

  // Master password UI
  if (hasMasterPassword && !isMasterPasswordSet) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Password Manager</h1>
          </div>
          
          <p className="mb-6 text-gray-700">
            Enter your master password to unlock your saved passwords.
          </p>
          
          <div className="relative mb-6">
            <input
              type="password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              placeholder="Master Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={verifyMasterPassword}
            className={`${buttonStyle} ${themes.primary} w-full`}
          >
            <Unlock className="w-5 h-5" />
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 mt-16 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Key className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold">Password Generator</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className={`${buttonStyle} ${themes.info}`}
                title="View Password Analysis"
              >
                <Info className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`${buttonStyle} ${themes.secondary}`}
                title="Password History"
              >
                <History className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSavedPasswords(!showSavedPasswords)}
                className={`${buttonStyle} ${themes.primary}`}
                title="Saved Passwords"
              >
                {hasMasterPassword ? (
                  <Lock className="w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          {/* Password Display */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                readOnly
                value={password}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-mono bg-gray-50"
              />
              <div className="absolute right-2 top-2 flex gap-2">
                <button
                  onClick={() => copyToClipboard()}
                  className={`${buttonStyle} ${themes.secondary} py-1 px-3`}
                  title="Copy to Clipboard"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
                <button
                  onClick={generatePassword}
                  className={`${buttonStyle} ${themes.primary} py-1 px-3`}
                  title="Generate New Password"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Password Strength Indicator */}
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-700 mb-1">
                <span>Strength: {passwordStrength.label}</span>
                <span>{passwordStrength.score}/10</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full ${getStrengthColor()}`}
                  style={{ width: `${passwordStrength.score * 10}%` }}
                ></div>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="mt-2 text-sm text-gray-700">
                  {passwordStrength.feedback.map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Password Generator Options */}
          <div className="space-y-4">
            {/* Type Selection */}
            <div>
              <div className="flex gap-4">
                <div
                  className={`flex-1 p-3 rounded-lg cursor-pointer transition-colors border-2 ${
                    !useWords
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setUseWords(false)}
                >
                  <div className="font-medium mb-1">Characters</div>
                  <div className="text-sm text-gray-500">
                    Random characters (more secure)
                  </div>
                </div>
                <div
                  className={`flex-1 p-3 rounded-lg cursor-pointer transition-colors border-2 ${
                    useWords
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setUseWords(true)}
                >
                  <div className="font-medium mb-1">Words</div>
                  <div className="text-sm text-gray-500">
                    Random words (easier to remember)
                  </div>
                </div>
              </div>
            </div>
            
            {/* Character-based options */}
            {!useWords ? (
              <>
                {/* Length Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Length: {length}
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs">8</span>
                    <input
                      type="range"
                      min="8"
                      max="64"
                      value={length}
                      onChange={(e) => setLength(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs">64</span>
                  </div>
                </div>
                
                {/* Character Types */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeUppercase"
                      checked={includeUppercase}
                      onChange={() => setIncludeUppercase(!includeUppercase)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="includeUppercase" className="ml-2 text-sm">
                      Uppercase (A-Z)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeLowercase"
                      checked={includeLowercase}
                      onChange={() => setIncludeLowercase(!includeLowercase)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="includeLowercase" className="ml-2 text-sm">
                      Lowercase (a-z)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeNumbers"
                      checked={includeNumbers}
                      onChange={() => setIncludeNumbers(!includeNumbers)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="includeNumbers" className="ml-2 text-sm">
                      Numbers (0-9)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeSymbols"
                      checked={includeSymbols}
                      onChange={() => setIncludeSymbols(!includeSymbols)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="includeSymbols" className="ml-2 text-sm">
                      Symbols (!@#$%...)
                    </label>
                  </div>
                </div>
                
                {/* Advanced Options Toggle */}
                <div>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center text-sm text-gray-700 hover:text-blue-600"
                  >
                    {showAdvanced ? (
                      <ChevronDown className="w-4 h-4 mr-1" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mr-1" />
                    )}
                    Advanced Options
                  </button>
                  
                  {showAdvanced && (
                    <div className="mt-3 space-y-3 p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="requireAllTypes"
                          checked={requireAllTypes}
                          onChange={() => setRequireAllTypes(!requireAllTypes)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="requireAllTypes" className="ml-2 text-sm">
                          Require all selected character types
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="excludeSimilarChars"
                          checked={excludeSimilarChars}
                          onChange={() => setExcludeSimilarChars(!excludeSimilarChars)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="excludeSimilarChars" className="ml-2 text-sm">
                          Exclude similar characters (l, I, 1, O, 0)
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="excludeAmbiguous"
                          checked={excludeAmbiguous}
                          onChange={() => setExcludeAmbiguous(!excludeAmbiguous)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="excludeAmbiguous" className="ml-2 text-sm">
                          Exclude ambiguous symbols ({}{})[]()&lt;&gt;,.\'"
                        </label>
                      </div>
                      
                      {requireAllTypes && (
                        <div className="grid grid-cols-3 gap-3 mt-3">
                          <div>
                            <label className="block text-xs text-gray-700 mb-1">
                              Min Uppercase: {minUppercase}
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={minUppercase}
                              onChange={(e) => setMinUppercase(parseInt(e.target.value))}
                              disabled={!includeUppercase}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-700 mb-1">
                              Min Numbers: {minNumbers}
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={minNumbers}
                              onChange={(e) => setMinNumbers(parseInt(e.target.value))}
                              disabled={!includeNumbers}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-700 mb-1">
                              Min Symbols: {minSymbols}
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={minSymbols}
                              onChange={(e) => setMinSymbols(parseInt(e.target.value))}
                              disabled={!includeSymbols}
                              className="w-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Word-based options */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Words: {wordCount}
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-xs">3</span>
                      <input
                        type="range"
                        min="3"
                        max="10"
                        value={wordCount}
                        onChange={(e) => setWordCount(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-xs">10</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Word Separator
                    </label>
                    <select
                      value={wordSeparator}
                      onChange={(e) => setWordSeparator(e.target.value)}
                      className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="-">Hyphen (-)</option>
                      <option value=".">Dot (.)</option>
                      <option value="_">Underscore (_)</option>
                      <option value=" ">Space ( )</option>
                      <option value="">None</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="includeUppercaseWords"
                        checked={includeUppercase}
                        onChange={() => setIncludeUppercase(!includeUppercase)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="includeUppercaseWords" className="ml-2 text-sm">
                        Capitalize
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="includeNumbersWords"
                        checked={includeNumbers}
                        onChange={() => setIncludeNumbers(!includeNumbers)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="includeNumbersWords" className="ml-2 text-sm">
                        Add Number
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="includeSymbolsWords"
                        checked={includeSymbols}
                        onChange={() => setIncludeSymbols(!includeSymbols)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="includeSymbolsWords" className="ml-2 text-sm">
                        Add Symbol
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={generatePassword}
                className={`${buttonStyle} ${themes.primary} flex-1`}
              >
                <RefreshCw className="w-5 h-5" />
                Generate New Password
              </button>
              <button
                onClick={() => {
                  setCustomPasswordTitle("");
                  setCustomPasswordTag("");
                  setCustomPasswordNote("");
                  saveCurrentPassword();
                }}
                className={`${buttonStyle} ${themes.success}`}
              >
                <Save className="w-5 h-5" />
                Save
              </button>
            </div>
          </div>
        </div>
        
        {/* Password Analysis Popup */}
        {showAnalysis && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Password Analysis
              </h2>
              <button
                onClick={() => setShowAnalysis(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {password ? (
              <div className="space-y-4">
                {(() => {
                  const analysis = getPasswordAnalysis();
                  return (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Length</div>
                          <div className="text-xl font-semibold">{analysis.length}</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Entropy</div>
                          <div className="text-xl font-semibold">{analysis.entropy} bits</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Uppercase</div>
                          <div className="text-xl font-semibold">{analysis.uppercase}</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Lowercase</div>
                          <div className="text-xl font-semibold">{analysis.lowercase}</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Numbers</div>
                          <div className="text-xl font-semibold">{analysis.numbers}</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500">Symbols</div>
                          <div className="text-xl font-semibold">{analysis.symbols}</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg col-span-2">
                          <div className="text-sm text-gray-500">Strength Score</div>
                          <div className="text-xl font-semibold flex items-center gap-2">
                            <span>{passwordStrength.score}/10</span>
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded ${
                                passwordStrength.score < 3
                                  ? "bg-red-100 text-red-800"
                                  : passwordStrength.score < 7
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {passwordStrength.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="font-medium mb-2">Estimated Time to Crack:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-500">
                              Regular Computer (10^9 guesses/sec)
                            </div>
                            <div className="text-lg font-medium">
                              {analysis.timeToCrack.desktop}
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-500">
                              Advanced System (10^12 guesses/sec)
                            </div>
                            <div className="text-lg font-medium">
                              {analysis.timeToCrack.botnet}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 mt-4">
                        <div className="flex items-start gap-1">
                          <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                          <p>
                            These estimates assume the attacker knows your password generation method but has to guess the exact value.
                            Always use unique passwords for different services and consider using a password manager.
                          </p>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-6">
                Generate a password to see its analysis
              </div>
            )}
          </div>
        )}
        
        {/* Password History Popup */}
        {showHistory && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Password History
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPasswordsInHistory(!showPasswordsInHistory)}
                  className={`${buttonStyle} ${themes.secondary} py-1 px-2`}
                  title={showPasswordsInHistory ? "Hide Passwords" : "Show Passwords"}
                >
                  {showPasswordsInHistory ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => exportPasswords("history")}
                  className={`${buttonStyle} ${themes.info} py-1 px-2`}
                  disabled={passwordHistory.length === 0}
                  title="Export History"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={clearHistory}
                  className={`${buttonStyle} ${themes.danger} py-1 px-2`}
                  disabled={passwordHistory.length === 0}
                  title="Clear History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {passwordHistory.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {passwordHistory.map((pwd, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                  >
                    <div className="font-mono flex-1">
                      {showPasswordsInHistory ? pwd : "••••••••••••••••"}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => selectFromHistory(pwd)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Use This Password"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(pwd)}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Copy to Clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromHistory(index)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Remove from History"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-6">
                No password history available
              </div>
            )}
          </div>
        )}
        
        {/* Saved Passwords Section */}
        {showSavedPasswords && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Save className="w-5 h-5 text-blue-600" />
                Saved Passwords
              </h2>
              <div className="flex gap-2">
                {hasMasterPassword ? (
                  <button
                    onClick={() => {
                      setIsMasterPasswordSet(false);
                      setMasterPassword("");
                    }}
                    className={`${buttonStyle} ${themes.primary} py-1 px-2`}
                    title="Lock"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!hasMasterPassword) {
                        const result = window.confirm(
                          "Set a master password to encrypt and protect your saved passwords? This is highly recommended for security."
                        );
                        if (result) {
                          setHasMasterPassword(true);
                          setIsMasterPasswordSet(false);
                          setMasterPassword("");
                        }
                      }
                    }}
                    className={`${buttonStyle} ${themes.warning} py-1 px-2`}
                    title="Encrypt Passwords"
                  >
                    <Key className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setShowPasswordInput(!showPasswordInput)}
                  className={`${buttonStyle} ${themes.success} py-1 px-2`}
                  title="Add Custom Password"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => exportPasswords("saved")}
                  className={`${buttonStyle} ${themes.info} py-1 px-2`}
                  disabled={savedPasswords.length === 0}
                  title="Export Passwords"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowSavedPasswords(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {hasMasterPassword && !isMasterPasswordSet && (
              <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-md">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Set Master Password
                </h3>
                <p className="text-sm text-blue-700 mb-3">
                  Create a strong master password to encrypt your saved passwords. 
                  You'll need this password to unlock your password vault in the future.
                </p>
                <div className="mb-3">
                  <input
                    type="password"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    placeholder="Create a strong master password"
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={setupMasterPassword}
                  className={`${buttonStyle} ${themes.primary}`}
                >
                  <Lock className="w-5 h-5" />
                  Set Master Password
                </button>
              </div>
            )}
            
            {/* Custom Password Input Form */}
            {showPasswordInput && (
              <div className="mb-6 p-4 border border-gray-200 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-green-600" />
                  {editingSavedPasswordId ? "Edit Password" : "Add Custom Password"}
                </h3>
                
                <div className="space-y-3">
                  {!editingSavedPasswordId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="text"
                        value={customPassword}
                        onChange={(e) => setCustomPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={customPasswordTitle}
                      onChange={(e) => setCustomPasswordTitle(e.target.value)}
                      placeholder="e.g. Gmail, Netflix, Bank Account"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tag
                    </label>
                    <input
                      type="text"
                      value={customPasswordTag}
                      onChange={(e) => setCustomPasswordTag(e.target.value)}
                      placeholder="e.g. Work, Personal, Finance"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      list="tags"
                    />
                    <datalist id="tags">
                      {uniqueTags.map((tag) => (
                        <option key={tag} value={tag} />
                      ))}
                    </datalist>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={customPasswordNote}
                      onChange={(e) => setCustomPasswordNote(e.target.value)}
                      placeholder="Add any notes or hints about this password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        if (editingSavedPasswordId) {
                          updateSavedPassword(editingSavedPasswordId);
                        } else {
                          saveCustomPassword();
                        }
                      }}
                      className={`${buttonStyle} ${themes.success} flex-1`}
                    >
                      <Save className="w-5 h-5" />
                      {editingSavedPasswordId ? "Update" : "Save"}
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordInput(false);
                        setEditingSavedPasswordId(null);
                        setCustomPassword("");
                        setCustomPasswordTitle("");
                        setCustomPasswordTag("");
                        setCustomPasswordNote("");
                      }}
                      className={`${buttonStyle} ${themes.secondary}`}
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Saved Passwords List */}
            {Object.keys(groupedPasswords).length > 0 ? (
              <div>
                {Object.keys(groupedPasswords)
                  .sort((a, b) => (a === "General" ? -1 : b === "General" ? 1 : a.localeCompare(b)))
                  .map((tag) => (
                    <div key={tag} className="mb-4">
                      <div className="flex items-center gap-2 mb-2 text-gray-700">
                        <Tag className="w-4 h-4" />
                        <h3 className="font-medium">{tag}</h3>
                      </div>
                      
                      <div className="space-y-2">
                        {groupedPasswords[tag].map((savedPass) => (
                          <div
                            key={savedPass.id}
                            className="border border-gray-200 rounded-md p-3 hover:bg-gray-50"
                          >
                            <div className="flex justify-between items-center mb-1">
                              <div className="font-medium">{savedPass.title}</div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => startEditSavedPassword(savedPass)}
                                  className="p-1 text-gray-600 hover:text-gray-800"
                                  title="Edit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => toggleSavedPasswordVisibility(savedPass.id)}
                                  className="p-1 text-gray-600 hover:text-gray-800"
                                  title={showPasswordsInSaved[savedPass.id] ? "Hide Password" : "Show Password"}
                                >
                                  {showPasswordsInSaved[savedPass.id] ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => copyToClipboard(savedPass.password)}
                                  className="p-1 text-gray-600 hover:text-gray-800"
                                  title="Copy to Clipboard"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteSavedPassword(savedPass.id)}
                                  className="p-1 text-red-600 hover:text-red-800"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="font-mono text-sm mb-2">
                              {showPasswordsInSaved[savedPass.id]
                                ? savedPass.password
                                : "••••••••••••••••"}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span
                                className={`px-2 py-0.5 font-medium rounded ${
                                  savedPass.strengthScore < 3
                                    ? "bg-red-100 text-red-800"
                                    : savedPass.strengthScore < 7
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {savedPass.strength}
                              </span>
                              
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded">
                                Created: {new Date(savedPass.created).toLocaleDateString()}
                              </span>
                              
                              {savedPass.note && (
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded">
                                  Has notes
                                </span>
                              )}
                            </div>
                            
                            {savedPass.note && showPasswordsInSaved[savedPass.id] && (
                              <div className="mt-2 text-sm text-gray-700 p-2 bg-gray-50 rounded">
                                {savedPass.note}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-6">
                No saved passwords yet
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}