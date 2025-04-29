import { useState, useEffect } from "react";
import {
  Save,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
  History,
  ChevronDown,
  ChevronRight,
  Check,
  AlertCircle,
  Download,
  Trash2,
  Plus,
  Edit2,
  X,
  Info,
  Tag,
  Key,
} from "lucide-react";

export default function PasswordGenerator({ theme = "light" }) {
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
  const [useWords, setUseWords] = useState(false);
  const [wordCount, setWordCount] = useState(4);
  const [wordSeparator, setWordSeparator] = useState("-");
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
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [customPassword, setCustomPassword] = useState("");
  const [customPasswordTitle, setCustomPasswordTitle] = useState("");
  const [customPasswordNote, setCustomPasswordNote] = useState("");
  const [customPasswordTag, setCustomPasswordTag] = useState("");
  const [editingSavedPasswordId, setEditingSavedPasswordId] = useState(null);
  const [showSavedPasswords, setShowSavedPasswords] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const commonWords = [
    "apple",
    "banana",
    "carrot",
    "dolphin",
    "elephant",
    "forest",
    "guitar",
    "harbor",
    "island",
    "jungle",
    "koala",
    "lemon",
    "mango",
    "noodle",
    "orange",
    "penguin",
    "quasar",
    "rabbit",
    "sunset",
    "turtle",
    "umbrella",
    "violet",
    "window",
    "xylophone",
    "yellow",
    "zebra",
    "anchor",
    "butter",
    "canvas",
    "diamond",
    "eagle",
    "fossil",
    "garden",
    "honey",
    "igloo",
    "jasmine",
    "kettle",
    "lantern",
    "mountain",
    "needle",
    "ocean",
    "planet",
    "quantum",
    "rocket",
    "silver",
    "thunder",
    "unicorn",
    "volcano",
    "winter",
    "yoga",
    "zephyr",
    "autumn",
    "bridge",
    "castle",
    "desert",
    "emerald",
  ];

  const showNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // 1. Lazy-initialize history & saved list from localStorage
  const [passwordHistory, setPasswordHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("passwordManager_history");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Error reading password history:", e);
      showNotification("Error loading your password history.", "error");
      return [];
    }
  });

  const loadDataFromStorage = () => {
    try {
      const storedHistory = localStorage.getItem("passwordManager_history");
      if (storedHistory) {
        setPasswordHistory(JSON.parse(storedHistory));
      }

      const storedSavedPasswords = localStorage.getItem(
        "passwordManager_savedPasswords"
      );
      if (storedSavedPasswords) {
        setSavedPasswords(JSON.parse(storedSavedPasswords));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      showNotification(
        "Error loading your saved passwords. Data might be corrupted.",
        "error"
      );
    }
  };

  const saveDataToStorage = () => {
    try {
      localStorage.setItem(
        "passwordManager_history",
        JSON.stringify(passwordHistory.slice(0, 20))
      );
      localStorage.setItem(
        "passwordManager_savedPasswords",
        JSON.stringify(savedPasswords)
      );
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
      showNotification(
        "Failed to save your passwords. Please try again.",
        "error"
      );
    }
  };
  const [savedPasswords, setSavedPasswords] = useState(() => {
    try {
      const raw = localStorage.getItem("passwordManager_savedPasswords");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Error reading saved passwords:", e);
      showNotification("Error loading your saved passwords.", "error");
      return [];
    }
  });

  // 2. On mount, generate password (history/saved are already in state)
  useEffect(() => {}, []);

  // 3. Persist history & saved-list whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "passwordManager_history",
        JSON.stringify(passwordHistory.slice(0, 20))
      );
      localStorage.setItem(
        "passwordManager_savedPasswords",
        JSON.stringify(savedPasswords)
      );
    } catch (e) {
      console.error("Error saving to localStorage:", e);
      showNotification(
        "Failed to save your passwords. Please try again.",
        "error"
      );
    }
  }, [passwordHistory, savedPasswords]);

  // 4. Enforce at least one character type and adjust length if needed
  useEffect(() => {
    const hasNoCharType =
      !includeUppercase &&
      !includeLowercase &&
      !includeNumbers &&
      !includeSymbols;

    if (hasNoCharType) {
      setIncludeLowercase(true);
    }

    const totalMinimum =
      (includeUppercase ? minUppercase : 0) +
      (includeLowercase ? 1 : 0) +
      (includeNumbers ? minNumbers : 0) +
      (includeSymbols ? minSymbols : 0);

    if (requireAllTypes && totalMinimum > length) {
      setLength(Math.max(8, totalMinimum));
    }
  }, [
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    minUppercase,
    minNumbers,
    minSymbols,
    length,
    requireAllTypes,
  ]);

  // 5. Re-evaluate and update password strength on every password change
  useEffect(() => {
    if (password) {
      const strength = evaluatePasswordStrength(password);
      setPasswordStrength(strength);
    }
  }, [password]);

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
      charset.symbols = charset.symbols.replace(
        /[{}[\]()<>:;,.\/'"\`~|\\]/g,
        ""
      );
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

      for (let i = 0; i < minUppercase && includeUppercase; i++) {
        const randomIndex = Math.floor(
          Math.random() * charset.uppercase.length
        );
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
        const randomIndex = Math.floor(
          Math.random() * charset.lowercase.length
        );
        newPassword += charset.lowercase[randomIndex];
      }
    }

    while (newPassword.length < length) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      newPassword += allChars[randomIndex];
    }

    newPassword = shuffleString(newPassword);
    return newPassword;
  };

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
      const symbols = excludeAmbiguous
        ? "!@#$%^&*_+"
        : "!@#$%^&*()_+{}[]|:;<>,.?/~";
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

      if (Math.random() > 0.5 && selectedWords.length > 0) {
        const randomWordIndex = Math.floor(
          Math.random() * selectedWords.length
        );
        selectedWords[randomWordIndex] =
          selectedWords[randomWordIndex] + randomSymbol;
      } else {
        selectedWords.push(randomSymbol);
      }
    }

    if (includeNumbers || includeSymbols) {
      selectedWords = shuffleArray(selectedWords);
    }

    return selectedWords.join(wordSeparator);
  };

  const generatePassword = () => {
    const newPassword = useWords
      ? generateWordPassword()
      : generateCharacterPassword();

    if (!newPassword) {
      setIncludeLowercase(true);
      setLength(Math.max(8, length));
      return generatePassword();
    }

    setPassword(newPassword);
    setPasswordHistory((prev) => {
      if (!prev.includes(newPassword)) {
        return [newPassword, ...prev.slice(0, 19)];
      }
      return prev;
    });
  };

  const clearHistory = () => {
    setPasswordHistory([]);
    localStorage.removeItem("passwordManager_history");
    showNotification("Password history cleared", "success");
  };

  const removeFromHistory = (index) => {
    const newHistory = [...passwordHistory];
    newHistory.splice(index, 1);
    setPasswordHistory(newHistory);
  };

  const saveCurrentPassword = () => {
    if (!password) return;

    const title =
      customPasswordTitle || `Password ${savedPasswords.length + 1}`;
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

    showNotification(
      `Password "${title}" has been saved successfully.`,
      "success"
    );
  };

  const saveCustomPassword = () => {
    if (!customPassword) {
      showNotification("Please enter a password", "error");
      return;
    }

    const strength = evaluatePasswordStrength(customPassword);
    const title =
      customPasswordTitle || `Custom Password ${savedPasswords.length + 1}`;
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

    showNotification(
      `Password "${title}" has been saved successfully.`,
      "success"
    );
  };

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

    showNotification(
      `Password "${updated.title}" has been updated.`,
      "success"
    );
  };

  const deleteSavedPassword = (id) => {
    setSavedPasswords((prev) => prev.filter((p) => p.id !== id));
    showNotification("Password deleted successfully", "success");
  };

  const startEditSavedPassword = (password) => {
    setEditingSavedPasswordId(password.id);
    setCustomPasswordTitle(password.title);
    setCustomPasswordTag(password.tag || "");
    setCustomPasswordNote(password.note || "");
  };

  const toggleSavedPasswordVisibility = (id) => {
    setShowPasswordsInSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const shuffleString = (str) => {
    const array = str.split("");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

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

    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (pwd.length >= 20) score += 1;

    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSymbols = /[^A-Za-z0-9]/.test(pwd);

    if (hasUppercase) score += 1;
    if (hasLowercase) score += 1;
    if (hasNumbers) score += 1;
    if (hasSymbols) score += 1;

    const uppercaseRatio = (pwd.match(/[A-Z]/g) || []).length / pwd.length;
    const lowercaseRatio = (pwd.match(/[a-z]/g) || []).length / pwd.length;
    const numbersRatio = (pwd.match(/[0-9]/g) || []).length / pwd.length;
    const symbolsRatio = (pwd.match(/[^A-Za-z0-9]/g) || []).length / pwd.length;

    if (uppercaseRatio > 0.1 && uppercaseRatio < 0.9) score += 0.5;
    if (lowercaseRatio > 0.1 && lowercaseRatio < 0.9) score += 0.5;
    if (numbersRatio > 0.1 && numbersRatio < 0.9) score += 0.5;
    if (symbolsRatio > 0.1 && symbolsRatio < 0.9) score += 0.5;

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

    const repeats = pwd.match(/(.)\1{2,}/g);
    if (repeats) {
      score -= repeats.length;
      feedback.push("Contains repeated characters");
    }

    if (useWords) {
      const wordCount = pwd.split(wordSeparator).length;
      if (wordCount >= 3) score += 1;
      if (wordCount >= 5) score += 1;

      if (!hasUppercase && !hasNumbers && !hasSymbols) {
        score -= 1;
        feedback.push("Add uppercase, numbers, or symbols");
      }
    }

    let label = "Very Weak";
    if (score >= 3) label = "Weak";
    if (score >= 5) label = "Medium";
    if (score >= 7) label = "Strong";
    if (score >= 9) label = "Very Strong";

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

  const copyToClipboard = (text = password) => {
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
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

  const selectFromHistory = (pwd) => {
    setPassword(pwd);
    setShowHistory(false);
  };

  const exportPasswords = (type = "history") => {
    if (
      (type === "history" && passwordHistory.length === 0) ||
      (type === "saved" && savedPasswords.length === 0)
    ) {
      return;
    }

    let content = "";
    let filename = "";

    if (type === "history") {
      content = passwordHistory.join("\n");
      filename = "password_history.txt";
    } else if (type === "saved") {
      content =
        "WARNING: This file contains sensitive information. Store it securely.\n\n";
      content += savedPasswords
        .map((p) => {
          return `Title: ${p.title}\nTag: ${p.tag || "General"}\nPassword: ${p.password}\nStrength: ${p.strength}\nCreated: ${new Date(p.created).toLocaleString()}\nNotes: ${p.note || "None"}\n\n`;
        })
        .join("---\n\n");
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

    if (type === "saved") {
      showNotification(
        "WARNING: The exported file contains unencrypted passwords. Store it in a secure location.",
        "warning"
      );
    }
  };

  const getStrengthColor = (score = passwordStrength.score) => {
    if (score < 3) return theme === "dark" ? "bg-red-600" : "bg-red-500";
    if (score < 7) return theme === "dark" ? "bg-amber-600" : "bg-amber-500";
    return theme === "dark" ? "bg-green-600" : "bg-green-500";
  };

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
      entropy = Math.log2(Math.pow(commonWords.length, wordCount));
      if (uppercase > 0) entropy += wordCount * Math.log2(2);
      if (numbers > 0) entropy += Math.log2(100);
      if (symbols > 0) entropy += Math.log2(symbols + 1);
    } else {
      entropy = Math.log2(Math.pow(possibleChars, length));
    }

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

  useEffect(() => {
    saveDataToStorage();
  }, [passwordHistory, savedPasswords]);

  const isDark = theme === "dark";

  const themes = {
    primary: isDark
      ? "bg-[blue-700] hover:bg-blue-800 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: isDark
      ? "bg-gray-700 hover:bg-gray-800 text-white"
      : "bg-gray-600 hover:bg-gray-700 text-white",
    danger: isDark
      ? "bg-red-700 hover:bg-red-800 text-white"
      : "bg-red-600 hover:bg-red-700 text-white",
    success: isDark
      ? "bg-green-700 hover:bg-green-800 text-white"
      : "bg-green-600 hover:bg-green-700 text-white",
    warning: isDark
      ? "bg-amber-600 hover:bg-amber-700 text-white"
      : "bg-amber-500 hover:bg-amber-600 text-white",
    input: isDark
      ? "bg-gray-800 text-white border-gray-700"
      : "bg-white text-gray-900 border-gray-300",
    card: isDark ? "bg-[#121212] border-gray-700" : "bg-white border-gray-200",
    text: isDark ? "text-white" : "text-gray-900",
    textSecondary: isDark ? "text-gray-300" : "text-gray-600",
  };

  return (
    <div className={`max-w-2xl mt-18 mx-auto p-4 bg-transparent`}>
      <div className={`mb-6 mt-16 p-4 rounded-lg border ${themes.card}`}>
        <div className="flex items-center mb-4">
          <Key className="mr-2" size={24} />
          <h2 className="text-xl font-bold">Password Generator</h2>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              readOnly
              value={password}
              placeholder="Enter Password"
              className={`w-full px-4 py-3 pr-24 rounded border text-lg font-mono ${themes.input}`}
            />
            <div className="absolute right-2 top-2 flex space-x-1">
              <button
                onClick={() => copyToClipboard()}
                className={`p-2 rounded ${themes.secondary} text-sm`}
                title="Copy to clipboard"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
              <button
                onClick={generatePassword}
                className={`p-2 rounded ${themes.primary} text-sm`}
                title="Generate new password"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStrengthColor()}`}
                style={{ width: `${passwordStrength.score * 10}%` }}
              ></div>
            </div>
            <span className={`ml-2 text-sm ${themes.textSecondary}`}>
              {passwordStrength.label}
            </span>
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              className={`ml-2 p-1 rounded ${themes.secondary} text-xs`}
            >
              <Info size={16} />
            </button>
          </div>

          {showAnalysis && getPasswordAnalysis() && (
            <div
              className={`mt-4 p-3 rounded ${isDark ? "bg-gray-900" : "bg-gray-100"}`}
            >
              <h4 className="font-semibold mb-2">Password Analysis</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Length: {getPasswordAnalysis().length}</div>
                <div>Uppercase: {getPasswordAnalysis().uppercase}</div>
                <div>Lowercase: {getPasswordAnalysis().lowercase}</div>
                <div>Numbers: {getPasswordAnalysis().numbers}</div>
                <div>Symbols: {getPasswordAnalysis().symbols}</div>
                <div>Entropy: {getPasswordAnalysis().entropy} bits</div>
                <div className="col-span-2">
                  Crack time (standard PC):{" "}
                  {getPasswordAnalysis().timeToCrack.desktop}
                </div>
                <div className="col-span-2">
                  Crack time (botnet):{" "}
                  {getPasswordAnalysis().timeToCrack.botnet}
                </div>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="mt-2 text-sm text-amber-600">
                  <p className="font-semibold">Suggestions:</p>
                  <ul className="list-disc pl-4">
                    {passwordStrength.feedback.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={`block mb-1 text-sm font-medium ${themes.text}`}>
              Password Length
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="flex-grow mr-2"
                disabled={useWords}
              />
              <input
                type="number"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className={`w-16 px-2 py-1 text-center rounded border ${themes.input}`}
                disabled={useWords}
              />
            </div>
          </div>

          <div>
            <label className={`block mb-1 text-sm font-medium ${themes.text}`}>
              Password Type
            </label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="passwordType"
                  checked={!useWords}
                  onChange={() => setUseWords(false)}
                  className="mr-1"
                />
                <span className="text-sm">Random</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="passwordType"
                  checked={useWords}
                  onChange={() => setUseWords(true)}
                  className="mr-1"
                />
                <span className="text-sm">Memorable</span>
              </label>
            </div>
          </div>
        </div>

        {!useWords ? (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className={`mb-2 text-sm font-medium ${themes.text}`}>
                Include Characters
              </h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={() => setIncludeUppercase(!includeUppercase)}
                    className="mr-2"
                  />
                  <span className="text-sm">Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={() => setIncludeLowercase(!includeLowercase)}
                    className="mr-2"
                  />
                  <span className="text-sm">Lowercase (a-z)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={() => setIncludeNumbers(!includeNumbers)}
                    className="mr-2"
                  />
                  <span className="text-sm">Numbers (0-9)</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={() => setIncludeSymbols(!includeSymbols)}
                    className="mr-2"
                  />
                  <span className="text-sm">Symbols (!@#$%^&*)</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className={`mb-2 text-sm font-medium ${themes.text}`}>
                Options
              </h3>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={excludeSimilarChars}
                    onChange={() =>
                      setExcludeSimilarChars(!excludeSimilarChars)
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">
                    Exclude similar (i, l, 1, o, 0)
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={excludeAmbiguous}
                    onChange={() => setExcludeAmbiguous(!excludeAmbiguous)}
                    className="mr-2"
                  />
                  <span className="text-sm">
                    Exclude ambiguous ({}[]()&lt;&gt;)
                  </span>
                </label>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center text-sm text-blue-600 dark:text-blue-400"
                >
                  {showAdvanced ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                  <span className="ml-1">Advanced Options</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className={`block mb-1 text-sm font-medium ${themes.text}`}
              >
                Number of Words
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className="flex-grow mr-2"
                />
                <input
                  type="number"
                  min="2"
                  max="8"
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className={`w-16 px-2 py-1 text-center rounded border ${themes.input}`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block mb-1 text-sm font-medium ${themes.text}`}
              >
                Word Separator
              </label>
              <select
                value={wordSeparator}
                onChange={(e) => setWordSeparator(e.target.value)}
                className={`w-full px-2 py-1 rounded border ${themes.input}`}
              >
                <option value="-">Hyphen (-)</option>
                <option value="_">Underscore (_)</option>
                <option value=".">Period (.)</option>
                <option value=" ">Space ( )</option>
                <option value="">None</option>
              </select>
            </div>

            <div className="col-span-2">
              <h3 className={`mb-2 text-sm font-medium ${themes.text}`}>
                Options
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={() => setIncludeUppercase(!includeUppercase)}
                    className="mr-2"
                  />
                  <span className="text-sm">Capitalize words</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={() => setIncludeNumbers(!includeNumbers)}
                    className="mr-2"
                  />
                  <span className="text-sm">Include numbers</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={() => setIncludeSymbols(!includeSymbols)}
                    className="mr-2"
                  />
                  <span className="text-sm">Include symbols</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {showAdvanced && !useWords && (
          <div className={`mb-4 p-3 rounded border ${themes.card}`}>
            <h3 className={`mb-2 text-sm font-medium ${themes.text}`}>
              Advanced Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={requireAllTypes}
                    onChange={() => setRequireAllTypes(!requireAllTypes)}
                    className="mr-2"
                  />
                  <span className="text-sm">Require all character types</span>
                </label>

                <div
                  className={`p-3 rounded ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
                >
                  <h4 className="text-sm mb-2">Minimum requirements</h4>
                  <div className="space-y-2">
                    <div>
                      <label className={`block text-xs mb-1 ${themes.text}`}>
                        Uppercase ({includeUppercase ? "Enabled" : "Disabled"})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={length}
                        value={minUppercase}
                        onChange={(e) =>
                          setMinUppercase(Number(e.target.value))
                        }
                        className={`w-full px-2 py-1 rounded border ${themes.input}`}
                        disabled={!includeUppercase || !requireAllTypes}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${themes.text}`}>
                        Numbers ({includeNumbers ? "Enabled" : "Disabled"})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={length}
                        value={minNumbers}
                        onChange={(e) => setMinNumbers(Number(e.target.value))}
                        className={`w-full px-2 py-1 rounded border ${themes.input}`}
                        disabled={!includeNumbers || !requireAllTypes}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${themes.text}`}>
                        Symbols ({includeSymbols ? "Enabled" : "Disabled"})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={length}
                        value={minSymbols}
                        onChange={(e) => setMinSymbols(Number(e.target.value))}
                        className={`w-full px-2 py-1 rounded border ${themes.input}`}
                        disabled={!includeSymbols || !requireAllTypes}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-4 gap-2 flex-wrap">
          <div>
            <button
              onClick={generatePassword}
              className={`px-4 py-2 rounded ${themes.primary} text-sm`}
            >
              <RefreshCw size={16} className="inline mr-1" />
              Generate Password
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-3 py-2 rounded ${themes.secondary} text-sm`}
            >
              <History size={16} className="inline mr-1" />
              History
            </button>

            <button
              onClick={() => setShowSavedPasswords(!showSavedPasswords)}
              className={`px-3 py-2 rounded ${themes.secondary} text-sm`}
            >
              <Save size={16} className="inline mr-1" />
              Saved
            </button>
          </div>
        </div>

        {password &&
          !showPasswordInput &&
          !showHistory &&
          !showSavedPasswords && (
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setShowPasswordInput(true);
                  setCustomPasswordTitle("");
                  setCustomPasswordTag("");
                  setCustomPasswordNote("");
                }}
                className={`px-3 py-2 rounded ${themes.secondary} text-sm`}
              >
                <Plus size={16} className="inline mr-1" />
                Add Custom Password
              </button>

              <button
                onClick={saveCurrentPassword}
                className={`px-3 py-2 rounded ${themes.success} text-sm`}
              >
                <Save size={16} className="inline mr-1" />
                Save This Password
              </button>
            </div>
          )}

        {showPasswordInput && (
          <div className={`mt-4 p-4 rounded border ${themes.card}`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Add Custom Password</h3>
              <button
                onClick={() => setShowPasswordInput(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className={`block mb-1 text-sm ${themes.text}`}>
                  Password:
                </label>
                <input
                  type="text"
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  className={`w-full px-3 py-2 rounded border ${themes.input}`}
                  placeholder="Enter your password"
                />
              </div>

              <div>
                <label className={`block mb-1 text-sm ${themes.text}`}>
                  Title:
                </label>
                <input
                  type="text"
                  value={customPasswordTitle}
                  onChange={(e) => setCustomPasswordTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded border ${themes.input}`}
                  placeholder="e.g. Work Email"
                />
              </div>

              <div>
                <label className={`block mb-1 text-sm ${themes.text}`}>
                  Tag:
                </label>
                <input
                  type="text"
                  value={customPasswordTag}
                  onChange={(e) => setCustomPasswordTag(e.target.value)}
                  className={`w-full px-3 py-2 rounded border ${themes.input}`}
                  placeholder="e.g. Work, Personal, Finance"
                />
              </div>

              <div>
                <label className={`block mb-1 text-sm ${themes.text}`}>
                  Notes (optional):
                </label>
                <textarea
                  value={customPasswordNote}
                  onChange={(e) => setCustomPasswordNote(e.target.value)}
                  className={`w-full px-3 py-2 rounded border ${themes.input}`}
                  rows="3"
                  placeholder="Add any additional information"
                ></textarea>
              </div>

              <div className="text-right">
                <button
                  onClick={saveCustomPassword}
                  className={`px-4 py-2 rounded ${themes.success} text-sm`}
                >
                  <Save size={16} className="inline mr-1" />
                  Save Password
                </button>
              </div>
            </div>
          </div>
        )}

        {showHistory && (
          <div className={`mt-4 p-4 rounded border ${themes.card}`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Password History</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setShowPasswordsInHistory(!showPasswordsInHistory)
                  }
                  className={`p-1 rounded ${themes.secondary} text-xs`}
                  title={
                    showPasswordsInHistory ? "Hide passwords" : "Show passwords"
                  }
                >
                  {showPasswordsInHistory ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
                <button
                  onClick={() => exportPasswords("history")}
                  className={`p-1 rounded ${themes.secondary} text-xs`}
                  title="Export history"
                  disabled={passwordHistory.length === 0}
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={clearHistory}
                  className={`p-1 rounded ${themes.danger} text-xs`}
                  title="Clear history"
                  disabled={passwordHistory.length === 0}
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {passwordHistory.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No password history available.
              </p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {passwordHistory.map((pwd, index) => (
                  <li
                    key={index}
                    className={`flex justify-between items-center p-2 rounded ${
                      isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="font-mono text-sm truncate flex-grow">
                      {showPasswordsInHistory
                        ? pwd
                        : "•".repeat(Math.min(pwd.length, 16))}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => copyToClipboard(pwd)}
                        className={`p-1 rounded ${themes.secondary} text-xs`}
                        title="Copy to clipboard"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => selectFromHistory(pwd)}
                        className={`p-1 rounded ${themes.primary} text-xs`}
                        title="Select this password"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => removeFromHistory(index)}
                        className={`p-1 rounded ${themes.danger} text-xs`}
                        title="Remove from history"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {showSavedPasswords && (
          <div className={`mt-4 p-4 rounded border ${themes.card}`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Saved Passwords</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => exportPasswords("saved")}
                  className={`p-1 rounded ${themes.secondary} text-xs`}
                  title="Export saved passwords"
                  disabled={savedPasswords.length === 0}
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => setShowSavedPasswords(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {savedPasswords.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No saved passwords.
              </p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {savedPasswords.map((savedPwd) => (
                  <div
                    key={savedPwd.id}
                    className={`p-3 rounded border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    {editingSavedPasswordId === savedPwd.id ? (
                      <div className="space-y-2">
                        <div>
                          <label
                            className={`block mb-1 text-xs ${themes.text}`}
                          >
                            Title:
                          </label>
                          <input
                            type="text"
                            value={customPasswordTitle}
                            onChange={(e) =>
                              setCustomPasswordTitle(e.target.value)
                            }
                            className={`w-full px-2 py-1 rounded border text-sm ${themes.input}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block mb-1 text-xs ${themes.text}`}
                          >
                            Tag:
                          </label>
                          <input
                            type="text"
                            value={customPasswordTag}
                            onChange={(e) =>
                              setCustomPasswordTag(e.target.value)
                            }
                            className={`w-full px-2 py-1 rounded border text-sm ${themes.input}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block mb-1 text-xs ${themes.text}`}
                          >
                            Notes:
                          </label>
                          <textarea
                            value={customPasswordNote}
                            onChange={(e) =>
                              setCustomPasswordNote(e.target.value)
                            }
                            className={`w-full px-2 py-1 rounded border text-sm ${themes.input}`}
                            rows="2"
                          ></textarea>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingSavedPasswordId(null)}
                            className={`px-2 py-1 rounded ${themes.secondary} text-xs`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => updateSavedPassword(savedPwd.id)}
                            className={`px-2 py-1 rounded ${themes.success} text-xs`}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center">
                            <h4 className="font-medium">{savedPwd.title}</h4>
                            {savedPwd.tag && (
                              <span
                                className={`ml-2 px-2 py-0.5 text-xs rounded ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                              >
                                <Tag size={12} className="inline mr-1" />
                                {savedPwd.tag}
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() =>
                                toggleSavedPasswordVisibility(savedPwd.id)
                              }
                              className={`p-1 rounded ${themes.secondary} text-xs`}
                              title={
                                showPasswordsInSaved[savedPwd.id]
                                  ? "Hide password"
                                  : "Show password"
                              }
                            >
                              {showPasswordsInSaved[savedPwd.id] ? (
                                <EyeOff size={14} />
                              ) : (
                                <Eye size={14} />
                              )}
                            </button>
                            <button
                              onClick={() => startEditSavedPassword(savedPwd)}
                              className={`p-1 rounded ${themes.secondary} text-xs`}
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => deleteSavedPassword(savedPwd.id)}
                              className={`p-1 rounded ${themes.danger} text-xs`}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center my-2">
                          <span className="font-mono text-sm truncate flex-grow">
                            {showPasswordsInSaved[savedPwd.id]
                              ? savedPwd.password
                              : "•".repeat(
                                  Math.min(savedPwd.password.length, 16)
                                )}
                          </span>
                          <button
                            onClick={() => copyToClipboard(savedPwd.password)}
                            className={`ml-2 p-1 rounded ${themes.secondary} text-xs`}
                            title="Copy to clipboard"
                          >
                            <Copy size={14} />
                          </button>
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                          <div>
                            <span
                              className={`inline-block w-2 h-2 rounded-full mr-1 ${getStrengthColor(savedPwd.strengthScore)}`}
                            ></span>
                            {savedPwd.strength}
                          </div>
                          <div>
                            {new Date(savedPwd.created).toLocaleDateString()}
                          </div>
                        </div>

                        {savedPwd.note && (
                          <div
                            className={`mt-2 text-xs p-2 rounded ${isDark ? "bg-gray-700" : "bg-gray-100"}`}
                          >
                            {savedPwd.note}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-4 py-2 rounded shadow-lg text-white text-sm ${
              notification.type === "success"
                ? themes.success
                : notification.type === "error"
                  ? themes.danger
                  : themes.warning
            }`}
          >
            {notification.type === "success" && (
              <Check size={16} className="inline mr-1" />
            )}
            {notification.type === "error" && (
              <AlertCircle size={16} className="inline mr-1" />
            )}
            {notification.type === "warning" && (
              <AlertCircle size={16} className="inline mr-1" />
            )}
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
}
