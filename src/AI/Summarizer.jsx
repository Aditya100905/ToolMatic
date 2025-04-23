import { useState, useEffect } from 'react';

export default function AiSummarizer({ theme = 'light', initialText = '' }) {
  // State management
  const [inputText, setInputText] = useState(initialText);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('auto');
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [outputMode, setOutputMode] = useState('explain');
  const [summaryDepth, setSummaryDepth] = useState('balanced');
  const [showKeypoints, setShowKeypoints] = useState(true);
  const [keyPoints, setKeyPoints] = useState([]);
  const [history, setHistory] = useState([]);
  const [readingTime, setReadingTime] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [sentimentAnalysis, setSentimentAnalysis] = useState(null);
  const [exportFormat, setExportFormat] = useState('markdown');
  const [processingStartTime, setProcessingStartTime] = useState(null);
  const [processingTime, setProcessingTime] = useState(null);
  const [keywordExtraction, setKeywordExtraction] = useState(true);
  const [analysisCompleteness, setAnalysisCompleteness] = useState('auto');
  const [recentHistory, setRecentHistory] = useState([]);
  const [visualMode, setVisualMode] = useState('basic');

  // Set themes based on prop
  const themeStyles = {
    light: {
      bg: 'bg-white',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-gray-600',
      border: 'border-gray-300',
      button: 'bg-blue-500 hover:bg-blue-600 text-white',
      buttonSecondary: 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300',
      buttonTertiary: 'text-blue-600 hover:text-blue-800 underline',
      inputBg: 'bg-gray-50',
      card: 'bg-white shadow-md',
      highlight: 'bg-blue-50',
      keypoint: 'bg-green-50 text-green-800 border-green-200',
      switch: 'bg-gray-200',
      switchActive: 'bg-blue-500',
      panel: 'bg-gray-50',
      notification: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      positive: 'bg-green-50 text-green-800',
      negative: 'bg-red-50 text-red-800',
      neutral: 'bg-gray-50 text-gray-800',
      progressBar: 'bg-blue-100',
      progressFill: 'bg-blue-500'
    },
    dark: {
      bg: 'bg-gray-900',
      textPrimary: 'text-gray-100',
      textSecondary: 'text-gray-400',
      border: 'border-gray-700',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      buttonSecondary: 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700',
      buttonTertiary: 'text-blue-400 hover:text-blue-300 underline',
      inputBg: 'bg-gray-800',
      card: 'bg-gray-800 shadow-md',
      highlight: 'bg-gray-700',
      keypoint: 'bg-gray-700 text-green-400 border-gray-600',
      switch: 'bg-gray-700',
      switchActive: 'bg-blue-600',
      panel: 'bg-gray-800',
      notification: 'bg-yellow-900 text-yellow-200 border-yellow-800',
      positive: 'bg-green-900 text-green-200',
      negative: 'bg-red-900 text-red-200',
      neutral: 'bg-gray-700 text-gray-200',
      progressBar: 'bg-gray-700',
      progressFill: 'bg-blue-600'
    },
    sepia: {
      bg: 'bg-amber-50',
      textPrimary: 'text-amber-900',
      textSecondary: 'text-amber-700',
      border: 'border-amber-200',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
      buttonSecondary: 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300',
      buttonTertiary: 'text-amber-700 hover:text-amber-800 underline',
      inputBg: 'bg-amber-100',
      card: 'bg-amber-50 shadow-md',
      highlight: 'bg-amber-100',
      keypoint: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      switch: 'bg-amber-200',
      switchActive: 'bg-amber-600',
      panel: 'bg-amber-100',
      notification: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      positive: 'bg-green-100 text-green-800',
      negative: 'bg-red-100 text-red-800',
      neutral: 'bg-amber-100 text-amber-800',
      progressBar: 'bg-amber-200',
      progressFill: 'bg-amber-600'
    },
    contrast: {
      bg: 'bg-black',
      textPrimary: 'text-white',
      textSecondary: 'text-yellow-300',
      border: 'border-yellow-400',
      button: 'bg-yellow-500 hover:bg-yellow-600 text-black',
      buttonSecondary: 'bg-black hover:bg-gray-900 text-yellow-300 border border-yellow-400',
      buttonTertiary: 'text-yellow-300 hover:text-yellow-200 underline',
      inputBg: 'bg-gray-900',
      card: 'bg-black shadow-md',
      highlight: 'bg-gray-900',
      keypoint: 'bg-yellow-900 text-yellow-200 border-yellow-700',
      switch: 'bg-gray-700',
      switchActive: 'bg-yellow-500',
      panel: 'bg-gray-900',
      notification: 'bg-blue-900 text-white border-blue-500',
      positive: 'bg-green-900 text-white',
      negative: 'bg-red-900 text-white',
      neutral: 'bg-gray-900 text-white',
      progressBar: 'bg-gray-800',
      progressFill: 'bg-yellow-500'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  // Calculate reading time based on word count
  useEffect(() => {
    const calculateReadingTime = () => {
      const wordsPerMinute = 200; // Average reading speed
      const minutes = Math.ceil(wordCount / wordsPerMinute);
      if (minutes < 1) {
        setReadingTime('< 1 min read');
      } else {
        setReadingTime(`${minutes} min read`);
      }
    };
    calculateReadingTime();
  }, [wordCount]);

  // Update word and character count when input changes
  useEffect(() => {
    const updateCounts = () => {
      setCharCount(inputText.length);
      const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
      setWordCount(words);
    };
    updateCounts();
  }, [inputText]);

  // Save to history when summary is generated
  useEffect(() => {
    if (summary && inputText) {
      const timestamp = new Date().toLocaleString();
      const newHistoryItem = {
        id: Date.now(),
        text: inputText.substring(0, 100) + (inputText.length > 100 ? '...' : ''),
        summary: summary.substring(0, 100) + (summary.length > 100 ? '...' : ''),
        mode: outputMode,
        depth: summaryDepth, 
        timestamp,
        fullText: inputText,
        fullSummary: summary,
        keyPoints: keyPoints
      };
      
      // Update history and recent history
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 50));
      setRecentHistory(prev => [newHistoryItem, ...prev].slice(0, 3));
    }
  }, [summary, inputText, outputMode, summaryDepth, keyPoints]);

  // Text analysis functions
  const analyzeText = (text) => {
    // Extract meaningful entities and concepts
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    
    // Extract main concepts
    const stopWords = new Set(['the', 'and', 'a', 'an', 'in', 'to', 'of', 'for', 'with', 'on', 'at', 'from', 'by', 'about', 'as', 'is', 'are', 'was', 'were', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'but', 'or', 'so', 'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'whose', 'when', 'where', 'why', 'how']);
    
    const wordFrequency = {};
    words.forEach(word => {
      if (!stopWords.has(word) && word.length > 2) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });
    
    // Extract key concepts (most frequent meaningful words)
    const keyConcepts = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(item => item[0]);
    
    // Find sentences with most key concepts
    const sentenceScores = sentences.map(sentence => {
      const lowerSentence = sentence.toLowerCase();
      let score = 0;
      let conceptCount = 0;
      
      keyConcepts.forEach(concept => {
        if (lowerSentence.includes(concept)) {
          score += wordFrequency[concept];
          conceptCount++;
        }
      });
      
      // Bonus for sentences with multiple key concepts
      score = score * (1 + 0.1 * conceptCount);
      
      // Position bias - first and last paragraphs often contain important info
      const sentenceIndex = sentences.indexOf(sentence);
      if (sentenceIndex === 0 || sentenceIndex === sentences.length - 1) {
        score *= 1.25;
      }
      
      return { sentence, score };
    });
    
    // Top sentences by importance
    const topSentences = sentenceScores
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.max(5, Math.ceil(sentences.length / 5)))
      .map(item => item.sentence.trim());
    
    // First sentence often contains topic
    const topicSentence = sentences[0].trim();
    
    // Extract likely conclusions (last sentences of paragraphs)
    const conclusionSentences = paragraphs
      .map(p => {
        const paraSentences = p.match(/[^.!?]+[.!?]+/g) || [p];
        return paraSentences[paraSentences.length - 1].trim();
      })
      .filter(s => s.length > 20);
      
    // Simple sentiment analysis
    const positiveWords = new Set(['good', 'great', 'excellent', 'positive', 'best', 'better', 'success', 'successful', 'benefit', 'benefits', 'advantage', 'advantages', 'improve', 'improved', 'effective', 'efficiently', 'recommended', 'solved', 'solved', 'win', 'winning', 'progress', 'easy', 'perfect', 'supported']);
    const negativeWords = new Set(['bad', 'worse', 'worst', 'negative', 'problem', 'problems', 'issue', 'issues', 'difficult', 'difficulty', 'fail', 'failed', 'failure', 'poor', 'poorly', 'unfortunately', 'concern', 'concerns', 'risk', 'risks', 'impossible', 'hard', 'complicated', 'complex', 'challenging']);
    
    let positiveScore = 0;
    let negativeScore = 0;
    words.forEach(word => {
      if (positiveWords.has(word)) positiveScore++;
      if (negativeWords.has(word)) negativeScore++;
    });
    
    // Normalize based on text length
    const textLength = words.length;
    const normalizedPositive = (positiveScore / textLength) * 100;
    const normalizedNegative = (negativeScore / textLength) * 100;
    
    const sentiment = {
      positive: normalizedPositive,
      negative: normalizedNegative,
      neutral: 100 - normalizedPositive - normalizedNegative,
      overall: normalizedPositive > normalizedNegative ? 'positive' : 
               normalizedNegative > normalizedPositive ? 'negative' : 'neutral'
    };

    // Calculate readability (simplified Flesch-Kincaid)
    const totalSentences = sentences.length;
    const totalWords = words.length;
    const syllableEstimate = words.reduce((total, word) => {
      // Very rough syllable estimation
      const vowelMatches = word.match(/[aeiouy]+/gi);
      return total + (vowelMatches ? vowelMatches.length : 1);
    }, 0);
    
    // Calculate readability metrics
    const wordsPerSentence = totalWords / totalSentences;
    const syllablesPerWord = syllableEstimate / totalWords;
    const readabilityScore = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
    
    let readabilityLevel;
    if (readabilityScore > 90) readabilityLevel = 'Very Easy';
    else if (readabilityScore > 80) readabilityLevel = 'Easy';
    else if (readabilityScore > 70) readabilityLevel = 'Fairly Easy';
    else if (readabilityScore > 60) readabilityLevel = 'Standard';
    else if (readabilityScore > 50) readabilityLevel = 'Fairly Difficult';
    else if (readabilityScore > 30) readabilityLevel = 'Difficult';
    else readabilityLevel = 'Very Difficult';
    
    return {
      topicSentence,
      keyConcepts,
      topSentences,
      conclusionSentences,
      paragraphs: paragraphs.length,
      sentences: sentences.length,
      wordCount: words.length,
      sentiment,
      readability: {
        score: readabilityScore,
        level: readabilityLevel,
        wordsPerSentence,
        syllablesPerWord
      }
    };
  };

  // Generate human-like explanation
  const generateExplanation = (analysis, depth) => {
    const { topicSentence, keyConcepts, topSentences, conclusionSentences, paragraphs, sentences, sentiment, readability } = analysis;
    
    // Determine summary length based on depth and text size
    let complexity;
    switch(depth) {
      case 'simple': complexity = Math.min(2, paragraphs); break;
      case 'deep': complexity = Math.min(6, paragraphs); break;
      case 'comprehensive': complexity = Math.min(8, paragraphs); break;
      default: complexity = Math.min(4, paragraphs); // balanced
    }
    
    // Adjust complexity based on text length
    if (analysis.wordCount < 100) {
      complexity = Math.max(1, complexity - 1);
    } else if (analysis.wordCount > 1000) {
      complexity = Math.min(8, complexity + 1);
    }
    
    // Generate introductory sentence
    let explanation = '';
    
    // Start with a variety of opening phrases
    const openingPhrases = [
      "This text discusses ",
      "The content focuses on ",
      "The material explores ",
      "This passage examines ",
      "The text addresses ",
      "This content analyzes ",
      "The document presents ",
      "This writing covers ",
      "The author explores "
    ];
    
    const mainTopics = keyConcepts.slice(0, 3).join(", ");
    explanation += openingPhrases[Math.floor(Math.random() * openingPhrases.length)] + mainTopics + ". ";
    
    // Add topic sentence or first sentence summary
    if (topicSentence.length < 150) {
      explanation += "It begins by stating that " + topicSentence.replace(/^[A-Z]/, c => c.toLowerCase()) + " ";
    }
    
    // Add key points
    const keyPointsList = [];
    
    // Generate unique key points based on top sentences
    // Avoid repetition by checking for significant overlap
    const usedKeywords = new Set();
    
    for (const sentence of topSentences) {
      // Check if this sentence adds new information
      const sentenceWords = new Set(sentence.toLowerCase().match(/\b[a-z]{4,}\b/g) || []);
      const newWords = [...sentenceWords].filter(word => !usedKeywords.has(word));
      
      // If at least 50% new meaningful words, include this sentence
      if (newWords.length > sentenceWords.size * 0.5 || keyPointsList.length < 2) {
        // Add new words to used words
        newWords.forEach(word => usedKeywords.add(word));
        
        // Format the sentence for a key point
        const formattedSentence = sentence
          .trim()
          .replace(/^[A-Z]/, c => c.toLowerCase()) // lowercase first letter
          .replace(/[.!?]$/, ''); // remove ending punctuation
        
        // Add connecting phrases for variety
        const connectors = [
          "The text highlights that ",
          "It points out that ",
          "The author emphasizes that ",
          "A key point is that ",
          "Importantly, ",
          "The content states that ",
          "It's noted that ",
          "The writing demonstrates that ",
          "A significant aspect is that ",
          "The text asserts that "
        ];
        
        keyPointsList.push(connectors[keyPointsList.length % connectors.length] + formattedSentence);
        
        // Limit based on complexity
        if (keyPointsList.length >= complexity + 2) break;
      }
    }
    
    // Add conclusion
    if (conclusionSentences.length > 0) {
      const conclusionConnectors = [
        "In conclusion, ",
        "Finally, ",
        "The text concludes that ",
        "To summarize, ",
        "Overall, ",
        "Ultimately, ",
        "In closing, ",
        "The author concludes by noting that ",
        "The document closes with the observation that ",
        "The final point made is that "
      ];
      
      const conclusionSentence = conclusionSentences[conclusionSentences.length - 1]
        .trim()
        .replace(/^[A-Z]/, c => c.toLowerCase()) // lowercase first letter
        .replace(/[.!?]$/, ''); // remove ending punctuation
      
      keyPointsList.push(conclusionConnectors[Math.floor(Math.random() * conclusionConnectors.length)] + conclusionSentence);
    }
    
    // Create main explanation paragraph
    explanation += keyPointsList[0] + ". ";
    
    // Create appropriate paragraphs based on depth/complexity
    if (depth === 'deep' || depth === 'comprehensive') {
      // For deep analysis, include more detailed explanation in multiple paragraphs
      const additionalPoints = keyPointsList.slice(1);
      
      // Group points into paragraphs
      const paragraphSize = depth === 'comprehensive' ? 2 : 3;
      
      for (let i = 0; i < additionalPoints.length; i += paragraphSize) {
        const paragraphPoints = additionalPoints.slice(i, i + paragraphSize);
        if (paragraphPoints.length > 0) {
          explanation += "\n\n" + paragraphPoints.join(". ") + ".";
        }
      }
      
      // Add readability assessment for comprehensive analysis
      if (depth === 'comprehensive') {
        explanation += "\n\n";
        explanation += `This text has a ${readability.level.toLowerCase()} readability level, with an average of ${readability.wordsPerSentence.toFixed(1)} words per sentence. `;
        
        if (sentiment.overall !== 'neutral') {
          explanation += `The overall tone is primarily ${sentiment.overall}, with ${sentiment.positive.toFixed(1)}% positive and ${sentiment.negative.toFixed(1)}% negative sentiment markers.`;
        } else {
          explanation += `The tone is predominantly neutral, with balanced positive and negative elements.`;
        }
      }
    } else {
      // For simple and balanced, keep it more concise
      const additionalPoints = keyPointsList.slice(1, depth === 'simple' ? 3 : Math.max(3, keyPointsList.length));
      if (additionalPoints.length > 0) {
        explanation += additionalPoints.join(". ") + ".";
      }
    }
    
    // Set key points for separate display
    setKeyPoints(keyConcepts.map(concept => concept.charAt(0).toUpperCase() + concept.slice(1)));
    setSentimentAnalysis(sentiment);
    
    return explanation;
  };

  // Main function to process and summarize text
  const processText = async (text, outputType, depth, lang) => {
    if (!text.trim()) return { summary: '', keyPoints: [] };
    
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // Analyze text
          const analysis = analyzeText(text);
          
          // Generate explanation or summary based on output type
          let result = '';
          if (outputType === 'explain') {
            result = generateExplanation(analysis, depth);
          } else if (outputType === 'outline') {
            // Create structured outline
            result = "# Document Outline\n\n";
            result += "## Main Topics\n";
            analysis.keyConcepts.slice(0, 5).forEach((concept, i) => {
              result += `${i+1}. ${concept.charAt(0).toUpperCase() + concept.slice(1)}\n`;
            });
            
            result += "\n## Key Points\n";
            analysis.topSentences.slice(0, 5).forEach((sentence, i) => {
              result += `${i+1}. ${sentence}\n`;
            });
            
            if (analysis.conclusionSentences.length > 0) {
              result += "\n## Conclusion\n";
              result += analysis.conclusionSentences[analysis.conclusionSentences.length - 1];
            }
          } else {
            // Basic summarization
            const { topSentences } = analysis;
            result = topSentences.join(' ');
          }
          
          resolve({ 
            summary: result, 
            keyPoints: analysis.keyConcepts.map(concept => concept.charAt(0).toUpperCase() + concept.slice(1)),
            sentiment: analysis.sentiment,
            readability: analysis.readability
          });
        } catch (err) {
          console.error("Analysis error:", err);
          resolve({ 
            summary: 'Error analyzing text. Please try with different content.',
            keyPoints: [],
            sentiment: null,
            readability: null
          });
        }
      }, 800); // Simulate processing time
    });
  };

  const handleProcess = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setProcessingStartTime(Date.now());
    
    try {
      const { summary, keyPoints, sentiment, readability } = await processText(inputText, outputMode, summaryDepth, language);
      setSummary(summary);
      setKeyPoints(keyPoints);
      setSentimentAnalysis(sentiment);
      setProcessingTime((Date.now() - processingStartTime) / 1000);
      setLoading(false);
    } catch (err) {
      setError('Failed to analyze text. Please try again.');
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setSummary('');
    setKeyPoints([]);
    setError('');
    setSentimentAnalysis(null);
  };

  const handleExport = () => {
    if (!summary) return;
    
    let exportContent = '';
    const timestamp = new Date().toLocaleString();
    
    if (exportFormat === 'markdown') {
      exportContent = `# AI Text Analysis - ${timestamp}\n\n`;
      exportContent += `## Summary\n${summary}\n\n`;
      
      if (keyPoints.length > 0) {
        exportContent += `## Key Concepts\n`;
        keyPoints.forEach(point => {
          exportContent += `- ${point}\n`;
        });
      }
      
      if (sentimentAnalysis) {
        exportContent += `\n## Sentiment Analysis\n`;
        exportContent += `- Overall: ${sentimentAnalysis.overall}\n`;
        exportContent += `- Positive: ${sentimentAnalysis.positive.toFixed(1)}%\n`;
        exportContent += `- Negative: ${sentimentAnalysis.negative.toFixed(1)}%\n`;
        exportContent += `- Neutral: ${sentimentAnalysis.neutral.toFixed(1)}%\n`;
      }
      
      exportContent += `\n## Original Text\n${inputText}\n`;
    } else if (exportFormat === 'json') {
      const exportObj = {
        timestamp,
        originalText: inputText,
        summary,
        keyPoints,
        sentiment: sentimentAnalysis,
        analysisMode: outputMode,
        depth: summaryDepth
      };
      exportContent = JSON.stringify(exportObj, null, 2);
    } else {
      // Plain text
      exportContent = `AI Text Analysis - ${timestamp}\n\n`;
      exportContent += `SUMMARY:\n${summary}\n\n`;
      
      if (keyPoints.length > 0) {
        exportContent += `KEY CONCEPTS:\n`;
        keyPoints.forEach(point => {
          exportContent += `- ${point}\n`;
        });
      }
      
      if (sentimentAnalysis) {
        exportContent += `\nSENTIMENT:\n`;
        exportContent += `Overall: ${sentimentAnalysis.overall}\n`;
        exportContent += `Positive: ${sentimentAnalysis.positive.toFixed(1)}%\n`;
        exportContent += `Negative: ${sentimentAnalysis.negative.toFixed(1)}%\n`;
        exportContent += `Neutral: ${sentimentAnalysis.neutral.toFixed(1)}%\n`;
      }
      
      exportContent += `\nORIGINAL TEXT:\n${inputText}\n`;
    }
    
    // Create and trigger download
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-analysis-${Date.now()}.${exportFormat === 'json' ? 'json' : exportFormat === 'markdown' ? 'md' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadHistoryItem = (item) => {
    setInputText(item.fullText);
    setSummary(item.fullSummary);
    setKeyPoints(item.keyPoints);
    setOutputMode(item.mode);
    setSummaryDepth(item.depth);
  };

  const renderProgressBar = (value, max = 100) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div className={`w-full h-2 rounded-full overflow-hidden ${currentTheme.progressBar}`}>
        <div 
          className={`h-full ${currentTheme.progressFill}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  const languageOptions = [
    { value: 'auto', label: 'Auto-detect' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ar', label: 'Arabic' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ru', label: 'Russian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'it', label: 'Italian' },
    { value: 'nl', label: 'Dutch' },
    { value: 'ko', label: 'Korean' },
    { value: 'tr', label: 'Turkish' }
  ];

  const outputOptions = [
    { value: 'explain', label: '✍️ Explain & Analyze' },
    { value: 'summarize', label: '📝 Concise Summary' },
    { value: 'outline', label: '📋 Structured Outline' }
  ];

  const depthOptions = [
    { value: 'simple', label: '🔄 Simple' },
    { value: 'balanced', label: '⚖️ Balanced' },
    { value: 'deep', label: '🔍 Deep Analysis' },
    { value: 'comprehensive', label: '📊 Comprehensive' }
  ];

  const exportOptions = [
    { value: 'markdown', label: 'Markdown (.md)' },
    { value: 'text', label: 'Plain Text (.txt)' },
    { value: 'json', label: 'JSON (.json)' }
  ];

  const visualOptions = [
    { value: 'basic', label: 'Basic' },
    { value: 'detailed', label: 'Detailed' },
    { value: 'visual', label: 'Visual Analytics' }
  ];

  return (
    <div className={`${currentTheme.bg} ${currentTheme.textPrimary} min-h-screen mt-16 p-4 font-sans transition-all duration-300`}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">AI Text Summarizer & Analyzer</h1>
          <p className={`${currentTheme.textSecondary}`}>
            Transform complex text into clear summaries with advanced analysis
          </p>
        </header>

        {/* Main Interface */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Input Section */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className={`p-4 rounded-lg mb-4 ${currentTheme.card} ${currentTheme.border} border`}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Input Text</h2>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${currentTheme.textSecondary}`}>
                    {wordCount} words | {charCount} chars | {readingTime}
                  </span>
                </div>
              </div>
              
              <textarea
                className={`w-full h-64 rounded-md p-3 ${currentTheme.inputBg} ${currentTheme.border} border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Paste or type your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              ></textarea>
              
              <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={handleProcess}
                    disabled={loading || !inputText.trim()}
                    className={`px-4 py-2 rounded-md flex items-center gap-1 ${currentTheme.button} transition-all duration-200`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>Analyze</>
                    )}
                  </button>
                  
                  <button 
                    onClick={handleClear}
                    className={`px-4 py-2 rounded-md ${currentTheme.buttonSecondary} transition-all duration-200`}
                  >
                    Clear
                  </button>
                </div>
                
                <div>
                  <button 
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className={`text-sm px-3 py-1 rounded-md ${currentTheme.buttonSecondary} flex items-center gap-1`}
                  >
                    {showAdvancedOptions ? 'Hide Options' : 'Advanced Options'}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Advanced Options Panel */}
              {showAdvancedOptions && (
                <div className={`mt-4 p-3 rounded-md ${currentTheme.panel} ${currentTheme.border} border animate-slideDown`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Output Mode</label>
                      <select 
                        value={outputMode}
                        onChange={(e) => setOutputMode(e.target.value)}
                        className={`w-full p-2 rounded-md ${currentTheme.inputBg} ${currentTheme.border} border`}
                      >
                        {outputOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Analysis Depth</label>
                      <select 
                        value={summaryDepth}
                        onChange={(e) => setSummaryDepth(e.target.value)}
                        className={`w-full p-2 rounded-md ${currentTheme.inputBg} ${currentTheme.border} border`}
                      >
                        {depthOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Language</label>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className={`w-full p-2 rounded-md ${currentTheme.inputBg} ${currentTheme.border} border`}
                      >
                        {languageOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Export Format</label>
                      <select 
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className={`w-full p-2 rounded-md ${currentTheme.inputBg} ${currentTheme.border} border`}
                      >
                        {exportOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium">Extract Keywords</label>
                      <div 
                        className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer ${keywordExtraction ? currentTheme.switchActive : currentTheme.switch}`}
                        onClick={() => setKeywordExtraction(!keywordExtraction)}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${keywordExtraction ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium">Show Key Points</label>
                      <div 
                        className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer ${showKeypoints ? currentTheme.switchActive : currentTheme.switch}`}
                        onClick={() => setShowKeypoints(!showKeypoints)}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${showKeypoints ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Analysis Completeness</label>
                      <select 
                        value={analysisCompleteness}
                        onChange={(e) => setAnalysisCompleteness(e.target.value)}
                        className={`w-full p-2 rounded-md ${currentTheme.inputBg} ${currentTheme.border} border`}
                      >
                        <option value="auto">Auto (Based on Text Length)</option>
                        <option value="concise">Concise</option>
                        <option value="thorough">Thorough</option>
                        <option value="exhaustive">Exhaustive</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Visualization Mode</label>
                      <select 
                        value={visualMode}
                        onChange={(e) => setVisualMode(e.target.value)}
                        className={`w-full p-2 rounded-md ${currentTheme.inputBg} ${currentTheme.border} border`}
                      >
                        {visualOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Recent History */}
            {recentHistory.length > 0 && (
              <div className={`p-4 rounded-lg ${currentTheme.card} ${currentTheme.border} border`}>
                <h3 className="text-lg font-semibold mb-2">Recent Analysis</h3>
                <div className="space-y-2">
                  {recentHistory.map((item) => (
                    <div 
                      key={item.id}
                      className={`p-2 rounded text-sm cursor-pointer hover:bg-opacity-80 ${currentTheme.highlight}`}
                      onClick={() => loadHistoryItem(item)}
                    >
                      <div className="flex justify-between">
                        <div className="truncate">{item.text}</div>
                        <div className={`text-xs ${currentTheme.textSecondary}`}>{item.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Output Section */}
          <div className="w-full md:w-1/2">
            <div className={`p-4 rounded-lg ${currentTheme.card} ${currentTheme.border} border`}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Analysis Results</h2>
                {summary && (
                  <button 
                    onClick={handleExport}
                    className={`px-3 py-1 rounded-md text-sm ${currentTheme.buttonSecondary} flex items-center gap-1`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Export
                  </button>
                )}
              </div>
              
              {error && (
                <div className={`mb-4 p-3 rounded-md ${currentTheme.negative} ${currentTheme.border} border text-sm`}>
                  {error}
                </div>
              )}
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-300 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                  <p className={`mt-4 ${currentTheme.textSecondary}`}>Analyzing your text...</p>
                </div>
              ) : summary ? (
                <div>
                  {/* Key Points */}
                  {showKeypoints && keyPoints.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {keyPoints.slice(0, 8).map((point, index) => (
                          <span key={index} className={`text-xs px-2 py-1 rounded-full ${currentTheme.keypoint} border`}>
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Summary Display */}
                  <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
                    {outputMode === 'outline' ? (
                      <div className="whitespace-pre-line">{summary}</div>
                    ) : (
                      <div className="whitespace-pre-line">{summary}</div>
                    )}
                  </div>
                  
                  {/* Sentiment Analysis */}
                  {sentimentAnalysis && visualMode !== 'basic' && (
                    <div className="mt-6 p-3 rounded-md border border-opacity-50 border-gray-300">
                      <h3 className="text-sm font-semibold mb-3">Sentiment Analysis</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Positive</span>
                            <span>{sentimentAnalysis.positive.toFixed(1)}%</span>
                          </div>
                          {renderProgressBar(sentimentAnalysis.positive)}
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Negative</span>
                            <span>{sentimentAnalysis.negative.toFixed(1)}%</span>
                          </div>
                          {renderProgressBar(sentimentAnalysis.negative)}
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Neutral</span>
                            <span>{sentimentAnalysis.neutral.toFixed(1)}%</span>
                          </div>
                          {renderProgressBar(sentimentAnalysis.neutral)}
                        </div>
                      </div>
                      <div className="mt-3 py-1 px-2 rounded-md inline-block text-xs font-medium border border-opacity-50 border-gray-300">
                        Overall: <span className={`font-semibold ${
                          sentimentAnalysis.overall === 'positive' ? 'text-green-600' : 
                          sentimentAnalysis.overall === 'negative' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {sentimentAnalysis.overall.charAt(0).toUpperCase() + sentimentAnalysis.overall.slice(1)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Processing Info */}
                  {processingTime && (
                    <div className={`mt-4 text-xs ${currentTheme.textSecondary}`}>
                      {processingTime.toFixed(2)}s processing time
                    </div>
                  )}
                </div>
              ) : (
                <div className={`text-center py-12 ${currentTheme.textSecondary}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-3 opacity-50">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <p>Enter text and click "Analyze" to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className={`mt-8 text-center ${currentTheme.textSecondary} text-sm`}>
          <p>AI Text Summarizer & Analyzer • Made with advanced text processing algorithms</p>
        </footer>
      </div>
    </div>
  );
}