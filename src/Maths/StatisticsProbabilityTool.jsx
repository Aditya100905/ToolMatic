import { useState, useEffect } from 'react';
import * as math from 'mathjs';
import { LineChart, BarChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Line, Bar, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell } from 'recharts';

export default function StatisticsProbabilityTool({ theme = "dark" }) {
  const [activeTab, setActiveTab] = useState('descriptive');
  const [dataInput, setDataInput] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [results, setResults] = useState({});
  const [probabilityType, setProbabilityType] = useState('binomial');
  const [binomialParams, setBinomialParams] = useState({ n: 10, p: 0.5, k: 5 });
  const [normalParams, setNormalParams] = useState({ mean: 0, stdDev: 1, x: 0 });
  const [poissonParams, setPoissonParams] = useState({ lambda: 5, k: 3 });
  const [chartType, setChartType] = useState('bar');
  const [errorMessage, setErrorMessage] = useState('');
  const [histogramBins, setHistogramBins] = useState(10);
  const [showBoxPlot, setShowBoxPlot] = useState(false);
  const [correlationData, setCorrelationData] = useState({ x: '', y: '' });
  const [correlationResults, setCorrelationResults] = useState(null);
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [hypothesis, setHypothesis] = useState({ test: 'ttest', nullValue: 0, alternative: 'two-sided' });
  
  // Enhanced color scheme for dark theme
  const colors = {
    dark: {
      bg: 'bg-[#0e0e0e]',
      cardBg: 'bg-[#121212]',
      input: 'bg-[#1e1e1e]',
      border: 'border-[#2a2a2a]',
      text: 'text-gray-100',
      primaryButton: 'bg-[#4a5feb]',
      secondaryButton: 'bg-[#2a2a2a]',
      activeTab: 'bg-[#1a1a1a]',
      inactiveTab: 'bg-[#161616]',
      accent: '#4a5feb',
      chartColors: ['#4a5feb', '#ff6b6b', '#48dbfb', '#feca57', '#1dd1a1', '#5f27cd', '#ff9ff3'],
      success: 'bg-[#10ac84] text-white',
      error: 'bg-[#ee5253] text-white',
      warning: 'bg-[#ff9f43] text-white',
      hover: 'hover:bg-[#2a2a2a]'
    },
    light: {
      bg: 'bg-white',
      cardBg: 'bg-gray-50',
      input: 'bg-gray-100',
      border: 'border-gray-300',
      text: 'text-gray-900',
      primaryButton: 'bg-blue-600',
      secondaryButton: 'bg-gray-200',
      activeTab: 'bg-blue-100',
      inactiveTab: 'bg-gray-200',
      accent: '#3B82F6',
      chartColors: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#8B5CF6'],
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      hover: 'hover:bg-gray-100'
    }
  };
  
  const themeColors = theme === 'dark' ? colors.dark : colors.light;
  
  useEffect(() => {
    if (dataInput.trim()) {
      try {
        const data = dataInput.split(/[,\s\n]+/).map(Number).filter(num => !isNaN(num));
        setParsedData(data);
        if (activeTab === 'descriptive') {
          calculateDescriptiveStats(data);
        }
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Error parsing data. Please enter numbers separated by commas, spaces, or new lines.');
      }
    }
  }, [dataInput, activeTab]);

  const calculateDescriptiveStats = (data) => {
    if (!data.length) return;

    try {
      const mean = math.mean(data);
      const median = math.median(data);
      const mode = calculateMode(data);
      const variance = math.variance(data);
      const stdDev = math.std(data);
      const min = math.min(data);
      const max = math.max(data);
      const range = max - min;
      const sum = math.sum(data);
      const q1 = calculateQuantile(data, 0.25);
      const q3 = calculateQuantile(data, 0.75);
      const iqr = q3 - q1;
      const skewness = calculateSkewness(data);
      const kurtosis = calculateKurtosis(data);
      const geometricMean = data.every(x => x > 0) ? math.exp(math.mean(data.map(x => math.log(x)))) : 'N/A (requires positive data)';
      const harmonicMean = data.every(x => x > 0) ? data.length / math.sum(data.map(x => 1 / x)) : 'N/A (requires positive data)';
      const cv = stdDev / mean * 100; // Coefficient of variation
      
      // Confidence interval for mean
      const ciMean = calculateConfidenceInterval(data, confidenceLevel);
      
      setResults({
        mean: mean.toFixed(4),
        median: median.toFixed(4),
        mode: mode.join(', '),
        variance: variance.toFixed(4),
        stdDev: stdDev.toFixed(4),
        min: min.toFixed(4),
        max: max.toFixed(4),
        range: range.toFixed(4),
        sum: sum.toFixed(4),
        count: data.length,
        q1: q1.toFixed(4),
        q3: q3.toFixed(4),
        iqr: iqr.toFixed(4),
        skewness: skewness.toFixed(4),
        kurtosis: kurtosis.toFixed(4),
        geometricMean: typeof geometricMean === 'string' ? geometricMean : geometricMean.toFixed(4),
        harmonicMean: typeof harmonicMean === 'string' ? harmonicMean : harmonicMean.toFixed(4),
        cv: cv.toFixed(2) + '%',
        ci: `${ciMean.lower.toFixed(4)} - ${ciMean.upper.toFixed(4)} (${confidenceLevel}%)`,
        boxPlotData: generateBoxPlotData(data)
      });
    } catch (error) {
      setErrorMessage('Error calculating statistics: ' + error.message);
    }
  };

  const calculateMode = (data) => {
    const frequency = {};
    data.forEach(value => {
      frequency[value] = (frequency[value] || 0) + 1;
    });
    
    let maxFrequency = 0;
    let modes = [];
    
    for (const key in frequency) {
      if (frequency[key] > maxFrequency) {
        maxFrequency = frequency[key];
        modes = [parseFloat(key)];
      } else if (frequency[key] === maxFrequency) {
        modes.push(parseFloat(key));
      }
    }
    
    return modes;
  };

  const calculateQuantile = (data, q) => {
    const sorted = [...data].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
      return sorted[base];
    }
  };

  const calculateSkewness = (data) => {
    const n = data.length;
    const mean = math.mean(data);
    const stdDev = math.std(data);
    
    // Skewness formula
    const sum = data.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0);
    const skewness = n / ((n - 1) * (n - 2)) * sum;
    
    return skewness;
  };

  const calculateKurtosis = (data) => {
    const n = data.length;
    const mean = math.mean(data);
    const stdDev = math.std(data);
    
    // Kurtosis formula
    const sum = data.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0);
    const kurtosis = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3)) * sum - 
                      3 * Math.pow(n - 1, 2) / ((n - 2) * (n - 3));
    
    return kurtosis;
  };

  const calculateConfidenceInterval = (data, level) => {
    const n = data.length;
    const mean = math.mean(data);
    const stdDev = math.std(data);
    const stderr = stdDev / Math.sqrt(n);
    
    // Calculate t-critical value based on confidence level
    const alpha = (100 - level) / 100;
    const tCritical = calculateTCritical(n - 1, alpha / 2);
    
    return {
      lower: mean - tCritical * stderr,
      upper: mean + tCritical * stderr
    };
  };

  // Simple t-critical value approximation (for a more accurate version, you'd use a library)
  const calculateTCritical = (df, alpha) => {
    // Approximation of t-distribution critical values
    // This is a simplified version; for exact values, use statistical tables or specialized libraries
    if (df > 30) {
      // For large df, use normal approximation
      if (alpha === 0.025) return 1.96;      // 95% CI
      else if (alpha === 0.005) return 2.576; // 99% CI
      else if (alpha === 0.0005) return 3.291; // 99.9% CI
      else return 2; // Default approximation
    } else {
      // For smaller df, use higher values
      if (alpha === 0.025) return 2.1;      // 95% CI, small sample
      else if (alpha === 0.005) return 2.8; // 99% CI, small sample
      else if (alpha === 0.0005) return 3.5; // 99.9% CI, small sample
      else return 2.2; // Default approximation for small sample
    }
  };

  const generateBoxPlotData = (data) => {
    const sorted = [...data].sort((a, b) => a - b);
    const q1 = calculateQuantile(sorted, 0.25);
    const median = calculateQuantile(sorted, 0.5);
    const q3 = calculateQuantile(sorted, 0.75);
    const iqr = q3 - q1;
    const lowerWhisker = Math.max(sorted[0], q1 - 1.5 * iqr);
    const upperWhisker = Math.min(sorted[sorted.length - 1], q3 + 1.5 * iqr);
    
    // Find outliers
    const outliers = sorted.filter(x => x < lowerWhisker || x > upperWhisker);
    
    return {
      q1, median, q3, lowerWhisker, upperWhisker, outliers,
      chartData: [
        { name: 'Min', value: sorted[0] },
        { name: 'Q1', value: q1 },
        { name: 'Median', value: median },
        { name: 'Q3', value: q3 },
        { name: 'Max', value: sorted[sorted.length - 1] }
      ]
    };
  };

  const calculateBinomialProbability = () => {
    const { n, p, k } = binomialParams;
    try {
      const exactProb = math.combinations(n, k) * Math.pow(p, k) * Math.pow(1-p, n-k);
      const cumulativeLower = Array.from({length: k+1}, (_, i) => 
        math.combinations(n, i) * Math.pow(p, i) * Math.pow(1-p, n-i)
      ).reduce((sum, prob) => sum + prob, 0);
      
      const cumulativeUpper = 1 - Array.from({length: k}, (_, i) => 
        math.combinations(n, i) * Math.pow(p, i) * Math.pow(1-p, n-i)
      ).reduce((sum, prob) => sum + prob, 0);
      
      const distribution = Array.from({length: n+1}, (_, i) => ({
        k: i,
        probability: math.combinations(n, i) * Math.pow(p, i) * Math.pow(1-p, n-i)
      }));
      
      // Calculate expected value and variance
      const expectedValue = n * p;
      const variance = n * p * (1 - p);
      
      setResults({
        exactProbability: exactProb.toFixed(6),
        cumulativeLowerProbability: cumulativeLower.toFixed(6),
        cumulativeUpperProbability: cumulativeUpper.toFixed(6),
        expectedValue: expectedValue.toFixed(4),
        variance: variance.toFixed(4),
        stdDev: Math.sqrt(variance).toFixed(4),
        distribution
      });
    } catch (error) {
      setErrorMessage('Error calculating binomial probability: ' + error.message);
    }
  };

  const calculateNormalProbability = () => {
    const { mean, stdDev, x } = normalParams;
    try {
      const z = (x - mean) / stdDev;
      const lessThanX = (1 + math.erf(z / Math.sqrt(2))) / 2;
      const greaterThanX = 1 - lessThanX;
      
      const distribution = Array.from({length: 100}, (_, i) => {
        const value = mean - 4 * stdDev + i * (8 * stdDev / 99);
        const z = (value - mean) / stdDev;
        const density = Math.exp(-0.5 * z * z) / (stdDev * Math.sqrt(2 * Math.PI));
        return { x: value, density };
      });
      
      // Calculate critical values for common confidence levels
      const criticalValues = {
        '90': {
          z: 1.645,
          lower: mean - 1.645 * stdDev,
          upper: mean + 1.645 * stdDev
        },
        '95': {
          z: 1.96,
          lower: mean - 1.96 * stdDev,
          upper: mean + 1.96 * stdDev
        },
        '99': {
          z: 2.576,
          lower: mean - 2.576 * stdDev,
          upper: mean + 2.576 * stdDev
        }
      };
      
      setResults({
        lessThanX: lessThanX.toFixed(6),
        greaterThanX: greaterThanX.toFixed(6),
        standardizedZ: z.toFixed(4),
        distribution,
        criticalValues
      });
    } catch (error) {
      setErrorMessage('Error calculating normal probability: ' + error.message);
    }
  };

  const calculatePoissonProbability = () => {
    const { lambda, k } = poissonParams;
    try {
      const exactProb = (Math.exp(-lambda) * Math.pow(lambda, k)) / math.factorial(k);
      let cumulativeLower = 0;
      for (let i = 0; i <= k; i++) {
        cumulativeLower += (Math.exp(-lambda) * Math.pow(lambda, i)) / math.factorial(i);
      }
      
      let cumulativeUpper = 1;
      for (let i = 0; i < k; i++) {
        cumulativeUpper -= (Math.exp(-lambda) * Math.pow(lambda, i)) / math.factorial(i);
      }
      
      const maxK = Math.min(50, Math.max(20, lambda * 3));
      const distribution = Array.from({length: maxK + 1}, (_, i) => ({
        k: i,
        probability: (Math.exp(-lambda) * Math.pow(lambda, i)) / math.factorial(i)
      }));
      
      setResults({
        exactProbability: exactProb.toFixed(6),
        cumulativeLowerProbability: cumulativeLower.toFixed(6),
        cumulativeUpperProbability: cumulativeUpper.toFixed(6),
        expectedValue: lambda.toFixed(4),
        variance: lambda.toFixed(4),
        stdDev: Math.sqrt(lambda).toFixed(4),
        distribution
      });
    } catch (error) {
      setErrorMessage('Error calculating Poisson probability: ' + error.message);
    }
  };

  const handleCorrelationAnalysis = () => {
    try {
      const xValues = correlationData.x.split(/[,\s\n]+/).map(Number).filter(num => !isNaN(num));
      const yValues = correlationData.y.split(/[,\s\n]+/).map(Number).filter(num => !isNaN(num));
      
      if (xValues.length !== yValues.length) {
        setErrorMessage('Both datasets must have the same number of values.');
        return;
      }
      
      if (xValues.length < 2) {
        setErrorMessage('At least 2 data points are required for correlation analysis.');
        return;
      }
      
      // Calculate correlation coefficient
      const meanX = math.mean(xValues);
      const meanY = math.mean(yValues);
      
      let numerator = 0;
      let denominatorX = 0;
      let denominatorY = 0;
      
      for (let i = 0; i < xValues.length; i++) {
        const xDiff = xValues[i] - meanX;
        const yDiff = yValues[i] - meanY;
        
        numerator += xDiff * yDiff;
        denominatorX += xDiff * xDiff;
        denominatorY += yDiff * yDiff;
      }
      
      const r = numerator / Math.sqrt(denominatorX * denominatorY);
      
      // Calculate coefficient of determination (r-squared)
      const rSquared = r * r;
      
      // Simple linear regression
      const slope = numerator / denominatorX;
      const intercept = meanY - slope * meanX;
      
      // Create paired data for scatter plot
      const scatterData = xValues.map((x, i) => ({
        x,
        y: yValues[i]
      }));
      
      // Create regression line data
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const regressionLine = [
        { x: minX, y: slope * minX + intercept },
        { x: maxX, y: slope * maxX + intercept }
      ];
      
      setCorrelationResults({
        r: r.toFixed(4),
        rSquared: rSquared.toFixed(4),
        slope: slope.toFixed(4),
        intercept: intercept.toFixed(4),
        equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
        scatterData,
        regressionLine
      });
      
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error calculating correlation: ' + error.message);
    }
  };

  const calculateHypothesisTest = () => {
    try {
      if (parsedData.length < 2) {
        setErrorMessage('At least 2 data points are required for hypothesis testing.');
        return;
      }
      
      const { test, nullValue, alternative } = hypothesis;
      const mean = math.mean(parsedData);
      const stdDev = math.std(parsedData);
      const n = parsedData.length;
      const stderr = stdDev / Math.sqrt(n);
      
      let testStatistic, pValue, criticalValue, conclusion;
      
      if (test === 'ttest') {
        // One-sample t-test
        testStatistic = (mean - nullValue) / stderr;
        
        // Approximate p-value calculation for t-test
        // This is a simplified approximation; a more accurate calculation would use the t-distribution
        const tAbs = Math.abs(testStatistic);
        
        // Rough p-value approximation
        if (alternative === 'two-sided') {
          pValue = 2 * (1 - approximateNormalCDF(tAbs));
          criticalValue = calculateTCritical(n-1, 0.025);
          conclusion = tAbs > criticalValue ? 'Reject H₀' : 'Fail to reject H₀';
        } else if (alternative === 'greater') {
          pValue = 1 - approximateNormalCDF(testStatistic);
          criticalValue = calculateTCritical(n-1, 0.05);
          conclusion = testStatistic > criticalValue ? 'Reject H₀' : 'Fail to reject H₀';
        } else { // less
          pValue = approximateNormalCDF(testStatistic);
          criticalValue = -calculateTCritical(n-1, 0.05);
          conclusion = testStatistic < criticalValue ? 'Reject H₀' : 'Fail to reject H₀';
        }
      } else if (test === 'ztest') {
        // One-sample z-test (assuming known population std dev - we'll use sample for simplicity)
        testStatistic = (mean - nullValue) / stderr;
        
        // p-value calculation based on standard normal distribution
        if (alternative === 'two-sided') {
          pValue = 2 * (1 - approximateNormalCDF(Math.abs(testStatistic)));
          criticalValue = 1.96; // 95% confidence
          conclusion = Math.abs(testStatistic) > criticalValue ? 'Reject H₀' : 'Fail to reject H₀';
        } else if (alternative === 'greater') {
          pValue = 1 - approximateNormalCDF(testStatistic);
          criticalValue = 1.645; // 95% confidence, one-tailed
          conclusion = testStatistic > criticalValue ? 'Reject H₀' : 'Fail to reject H₀';
        } else { // less
          pValue = approximateNormalCDF(testStatistic);
          criticalValue = -1.645; // 95% confidence, one-tailed
          conclusion = testStatistic < criticalValue ? 'Reject H₀' : 'Fail to reject H₀';
        }
      }
      
      setResults({
        ...results,
        hypothesisTest: {
          test,
          nullHypothesis: `μ = ${nullValue}`,
          alternativeHypothesis: getAlternativeHypothesisText(alternative, nullValue),
          testStatistic: testStatistic.toFixed(4),
          pValue: pValue.toFixed(6),
          criticalValue: criticalValue.toFixed(4),
          conclusion,
          alpha: 0.05,
          sampleMean: mean.toFixed(4),
          sampleStdDev: stdDev.toFixed(4),
          sampleSize: n
        }
      });
      
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error in hypothesis testing: ' + error.message);
    }
  };
  
  const getAlternativeHypothesisText = (alternative, nullValue) => {
    switch(alternative) {
      case 'two-sided': return `μ ≠ ${nullValue}`;
      case 'greater': return `μ > ${nullValue}`;
      case 'less': return `μ < ${nullValue}`;
      default: return '';
    }
  };
  
  // Approximation of standard normal CDF
  const approximateNormalCDF = (x) => {
    // This is a simple approximation of the normal CDF
    // For more accuracy, you should use a proper statistical library
    if (x < -8) return 0;
    if (x > 8) return 1;
    
    let sum = 0;
    let term = x;
    for (let i = 3; sum + term !== sum; i += 2) {
      sum += term;
      term = term * x * x / i;
    }
    
    return 0.5 + sum * Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  };

  const generateHistogramData = () => {
    if (!parsedData.length) return [];
    
    const min = Math.min(...parsedData);
    const max = Math.max(...parsedData);
    const binWidth = (max - min) / histogramBins;
    
    const bins = Array(histogramBins).fill(0).map((_, i) => ({
      binStart: min + i * binWidth,
      binEnd: min + (i + 1) * binWidth,
      frequency: 0
    }));
    
    parsedData.forEach(value => {
      const binIndex = Math.min(
        histogramBins - 1,
        Math.floor((value - min) / binWidth)
      );
      bins[binIndex].frequency++;
    });
    
    return bins.map(bin => ({
      name: `${bin.binStart.toFixed(2)}-${bin.binEnd.toFixed(2)}`,
      frequency: bin.frequency,
      relativeFrequency: (bin.frequency / parsedData.length).toFixed(3)
    }));
  };

  const renderBoxPlot = () => {
    if (!results.boxPlotData) return null;
    
    const { boxPlotData } = results;
    const dataMin = Math.min(boxPlotData.lowerWhisker, ...(boxPlotData.outliers || []));
    const dataMax = Math.max(boxPlotData.upperWhisker, ...(boxPlotData.outliers || []));
    const range = dataMax - dataMin;
    const padding = range * 0.1;
    
    return (
      <div className="h-64 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            layout="vertical"
            data={[{
              q1: boxPlotData.q1,
              median: boxPlotData.median,
              q3: boxPlotData.q3,
              lowerWhisker: boxPlotData.lowerWhisker,
              upperWhisker: boxPlotData.upperWhisker
            }]}
            margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              domain={[dataMin - padding, dataMax + padding]}
              label={{ value: 'Value', position: 'insideBottom', offset: -5 }}
            />
            <YAxis type="category" dataKey="name" tick={false} />
            <Tooltip 
              formatter={(value) => value.toFixed(4)}
              contentStyle={{ backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff' }}
            />
            <Legend />
            
            {/* Box from Q1 to Q3 */}
            <Bar 
              dataKey="q3" 
              fill={themeColors.accent} 
              stackId="stack"
              name="Q3" 
              background={{ fill: 'transparent' }}
            />
            <Bar 
              dataKey="median" 
              fill={theme === 'dark' ? '#fff' : '#000'} 
              stackId="stack" 
              name="Median"
            />
            <Bar 
              dataKey="q1" 
              fill={themeColors.accent} 
              stackId="stack" 
              name="Q1"
            />
            
            {/* Whiskers */}
            <Bar 
              dataKey="lowerWhisker" 
              fill="transparent" 
              stroke={themeColors.accent}
              strokeWidth={2}
              name="Min"
            />
            <Bar 
              dataKey="upperWhisker" 
              fill="transparent"
              stroke={themeColors.accent}
              strokeWidth={2}
              name="Max"
            />
            
            {/* Outliers - would be better as scatter points */}
            {boxPlotData.outliers && boxPlotData.outliers.map((value, i) => (
              <Bar 
                key={i}
                dataKey={() => value}
                fill="red"
                name={`Outlier ${i+1}`}
                stackId={`outlier-${i}`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const handleCalculate = () => {
    if (activeTab === 'probability') {
      if (probabilityType === 'binomial') {
        calculateBinomialProbability();
      } else if (probabilityType === 'normal') {
        calculateNormalProbability();
      } else if (probabilityType === 'poisson') {
        calculatePoissonProbability();
      }
    } else if (activeTab === 'descriptive' && parsedData.length) {
      calculateDescriptiveStats(parsedData);
    } else if (activeTab === 'correlationRegression') {
      handleCorrelationAnalysis();
    } else if (activeTab === 'hypothesisTesting') {
      calculateHypothesisTest();
    }
  };

  return (
    <div className={`p-4 mt-20 ${themeColors.bg} ${themeColors.text} min-h-screen font-sans`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Statistics & Probability Tool</h1>
        </div>
        
        {/* Tabs Navigation */}
        <div className="flex flex-wrap flex-col gap-2 md:flex-row border-b mb-6 overflow-x-auto">
          {['descriptive', 'probability', 'correlationRegression', 'hypothesisTesting'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 mr-2 font-medium rounded-t-lg ${
                activeTab === tab 
                  ? `${themeColors.activeTab} ${themeColors.text} border-b-2 border-${themeColors.accent}`
                  : `${themeColors.inactiveTab} ${themeColors.hover}`
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'descriptive' ? 'Descriptive Statistics' : 
               tab === 'probability' ? 'Probability Distribution' :
               tab === 'correlationRegression' ? 'Correlation & Regression' :
               'Hypothesis Testing'}
            </button>
          ))}
        </div>
        
        {/* Error Message */}
        {errorMessage && (
          <div className={`p-3 rounded mb-4 ${themeColors.error}`}>
            {errorMessage}
          </div>
        )}
        
        {/* Descriptive Statistics Panel */}
        {activeTab === 'descriptive' && (
          <div className={`${themeColors.cardBg} p-6 rounded-lg shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">Descriptive Statistics</h2>
            
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                Enter Data (numbers separated by commas, spaces, or new lines):
              </label>
              <textarea
                className={`w-full px-4 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                rows="4"
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                placeholder="e.g., 12, 15, 18, 22, 30, 35, 38"
              />
            </div>
            
            <div className="mb-6">
              <div className="flex flex-wrap gap-4 mb-4">
                <div>
                  <label className="block mb-1 font-medium">Chart Type:</label>
                  <select
                    className={`px-3 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="histogram">Histogram</option>
                    <option value="pie">Pie Chart</option>
                  </select>
                </div>
                
                {chartType === 'histogram' && (
                  <div>
                    <label className="block mb-1 font-medium">Number of Bins:</label>
                    <input
                      type="number"
                      className={`px-3 py-2 w-24 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                      value={histogramBins}
                      min="2"
                      max="50"
                      onChange={(e) => setHistogramBins(parseInt(e.target.value) || 10)}
                    />
                  </div>
                )}
                
                <div>
                  <label className="block mb-1 font-medium">Confidence Level (%):</label>
                  <select
                    className={`px-3 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(Number(e.target.value))}
                  >
                    <option value="90">90%</option>
                    <option value="95">95%</option>
                    <option value="99">99%</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    className={`px-4 py-2 rounded-md ${themeColors.primaryButton} text-white hover:opacity-90`}
                    onClick={handleCalculate}
                  >
                    Calculate
                  </button>
                </div>
                
                <div className="flex items-end">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5"
                      checked={showBoxPlot}
                      onChange={(e) => setShowBoxPlot(e.target.checked)}
                    />
                    <span className="ml-2">Show Box Plot</span>
                  </label>
                </div>
              </div>
            </div>
            
            {parsedData.length > 0 && results.mean && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-md ${themeColors.input}`}>
                    <h3 className="text-lg font-semibold mb-2">Central Tendency</h3>
                    <p><span className="font-medium">Mean:</span> {results.mean}</p>
                    <p><span className="font-medium">Median:</span> {results.median}</p>
                    <p><span className="font-medium">Mode:</span> {results.mode}</p>
                    <p><span className="font-medium">Geometric Mean:</span> {results.geometricMean}</p>
                    <p><span className="font-medium">Harmonic Mean:</span> {results.harmonicMean}</p>
                  </div>
                  
                  <div className={`p-4 rounded-md ${themeColors.input}`}>
                    <h3 className="text-lg font-semibold mb-2">Dispersion</h3>
                    <p><span className="font-medium">Variance:</span> {results.variance}</p>
                    <p><span className="font-medium">Std. Deviation:</span> {results.stdDev}</p>
                    <p><span className="font-medium">Range:</span> {results.range}</p>
                    <p><span className="font-medium">IQR:</span> {results.iqr}</p>
                    <p><span className="font-medium">CV:</span> {results.cv}</p>
                  </div>
                  
                  <div className={`p-4 rounded-md ${themeColors.input}`}>
                    <h3 className="text-lg font-semibold mb-2">Summary</h3>
                    <p><span className="font-medium">Min:</span> {results.min}</p>
                    <p><span className="font-medium">Q1:</span> {results.q1}</p>
                    <p><span className="font-medium">Q3:</span> {results.q3}</p>
                    <p><span className="font-medium">Max:</span> {results.max}</p>
                    <p><span className="font-medium">Count:</span> {results.count}</p>
                  </div>
                  
                  <div className={`p-4 rounded-md ${themeColors.input}`}>
                    <h3 className="text-lg font-semibold mb-2">Shape</h3>
                    <p><span className="font-medium">Skewness:</span> {results.skewness}</p>
                    <p><span className="font-medium">Kurtosis:</span> {results.kurtosis}</p>
                  </div>
                  
                  <div className={`p-4 rounded-md ${themeColors.input}`}>
                    <h3 className="text-lg font-semibold mb-2">Confidence Interval</h3>
                    <p><span className="font-medium">Mean CI ({confidenceLevel}%):</span> {results.ci}</p>
                  </div>
                </div>
                
                {/* Visualization */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Visualization</h3>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'bar' && (
                        <BarChart data={parsedData.map((val, i) => ({ name: i+1, value: val }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" label={{ value: 'Index', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
                          <Tooltip 
                            formatter={(value) => value.toFixed(4)}
                            contentStyle={{ backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff' }}
                          />
                          <Bar dataKey="value" fill={themeColors.accent} name="Value" />
                        </BarChart>
                      )}
                      
                      {chartType === 'line' && (
                        <LineChart data={parsedData.map((val, i) => ({ name: i+1, value: val }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" label={{ value: 'Index', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft' }} />
                          <Tooltip 
                            formatter={(value) => value.toFixed(4)}
                            contentStyle={{ backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff' }}
                          />
                          <Line type="monotone" dataKey="value" stroke={themeColors.accent} dot={{ fill: themeColors.accent }} name="Value" />
                        </LineChart>
                      )}
                      
                      {chartType === 'histogram' && (
                        <BarChart data={generateHistogramData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" label={{ value: 'Bin Range', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
                          <Tooltip 
                            formatter={(value, name, props) => [value, name === 'frequency' ? 'Frequency' : 'Relative Frequency']}
                            contentStyle={{ backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff' }}
                          />
                          <Bar dataKey="frequency" fill={themeColors.accent} name="Frequency" />
                        </BarChart>
                      )}
                      
                      {chartType === 'pie' && (
                        <PieChart>
                          <Pie
                            data={generateHistogramData()}
                            dataKey="frequency"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                          >
                            {generateHistogramData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={themeColors.chartColors[index % themeColors.chartColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => value}
                            contentStyle={{ backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff' }}
                          />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Box Plot */}
                  {showBoxPlot && renderBoxPlot()}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Probability Distribution Panel */}
        {activeTab === 'probability' && (
          <div className={`${themeColors.cardBg} p-6 rounded-lg shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">Probability Distribution</h2>
            
            <div className="mb-6">
              <label className="block mb-2 font-medium">Distribution Type:</label>
              <div className="flex flex-wrap gap-3">
                {['binomial', 'normal', 'poisson'].map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 rounded-md ${
                      probabilityType === type 
                        ? themeColors.primaryButton + ' text-white' 
                        : themeColors.secondaryButton + ' ' + themeColors.hover
                    }`}
                    onClick={() => setProbabilityType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {probabilityType === 'binomial' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block mb-2 font-medium">Number of trials (n):</label>
                  <input
                    type="number"
                    className={`w-full px-4 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                    value={binomialParams.n}
                    min="1"
                    max="1000"
                    onChange={(e) => setBinomialParams({...binomialParams, n: parseInt(e.target.value) || 10})}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Probability of success (p):</label>
                  <input
                    type="number"
                    className={`w-full px-4 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                    value={binomialParams.p}
                    min="0"
                    max="1"
                    step="0.01"
                    onChange={(e) => setBinomialParams({...binomialParams, p: parseFloat(e.target.value) || 0.5})}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Number of successes (k):</label>
                  <input
                    type="number"
                    className={`w-full px-4 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                    value={binomialParams.k}
                    min="0"
                    max={binomialParams.n}
                    onChange={(e) => setBinomialParams({...binomialParams, k: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            )}
            
            {probabilityType === 'normal' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block mb-2 font-medium">Mean (μ):</label>
                  <input
                    type="number"
                    className={`w-full px-4 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                    value={normalParams.mean}
                    step="0.1"
                    onChange={(e) => setNormalParams({...normalParams, mean: parseFloat(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Standard Deviation (σ):</label>
                  <input
                    type="number"
                    className={`w-full px-4 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                    value={normalParams.stdDev}
                    min="0.1"
                    step="0.1"
                    onChange={(e) => setNormalParams({...normalParams, stdDev: parseFloat(e.target.value) || 1})}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Value (x):</label>
                  <input
                    type="number"
                    className={`w-full px-4 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                    value={normalParams.x}
                    step="0.1"
                    onChange={(e) => setNormalParams({...normalParams, x: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
            )}
            
            {probabilityType === 'poisson' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-2 font-medium">Mean rate (λ):</label>
                  <input
                    type="number"
                    className={`w-full px-4 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                    value={poissonParams.lambda}
                    min="0.1"
                    step="0.1"
                    onChange={(e) => setPoissonParams({...poissonParams, lambda: parseFloat(e.target.value) || 1})}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Number of events (k):</label>
                  <input
                    type="number"
                    className={`w-full px-4 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                    value={poissonParams.k}
                    min="0"
                    onChange={(e) => setPoissonParams({...poissonParams, k: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            )}
            
            <div className="mt-4 mb-8">
              <button
                className={`px-6 py-2 rounded-md ${themeColors.primaryButton} text-white hover:opacity-90`}
                onClick={handleCalculate}
              >
                Calculate
              </button>
            </div>
            
            {/* Probability Results */}
            {results.distribution && (
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {probabilityType === 'binomial' && (
                    <>
                      <div className={`p-4 rounded-md ${themeColors.input}`}>
                        <h3 className="text-lg font-semibold mb-2">Binomial Probability</h3>
                        <p><span className="font-medium">P(X = {binomialParams.k}):</span> {results.exactProbability}</p>
                        <p><span className="font-medium">P(X ≤ {binomialParams.k}):</span> {results.cumulativeLowerProbability}</p>
                        <p><span className="font-medium">P(X ≥ {binomialParams.k}):</span> {results.cumulativeUpperProbability}</p>
                      </div>
                      
                      <div className={`p-4 rounded-md ${themeColors.input}`}>
                        <h3 className="text-lg font-semibold mb-2">Distribution Properties</h3>
                        <p><span className="font-medium">Expected Value:</span> {results.expectedValue}</p>
                        <p><span className="font-medium">Variance:</span> {results.variance}</p>
                        <p><span className="font-medium">Std. Deviation:</span> {results.stdDev}</p>
                      </div>
                    </>
                  )}
                  
                  {probabilityType === 'normal' && (
                    <>
                      <div className={`p-4 rounded-md ${themeColors.input}`}>
                        <h3 className="text-lg font-semibold mb-2">Normal Probability</h3>
                        <p><span className="font-medium">P(X ≤ {normalParams.x}):</span> {results.lessThanX}</p>
                        <p><span className="font-medium">P(X ≥ {normalParams.x}):</span> {results.greaterThanX}</p>
                        <p><span className="font-medium">Z-score:</span> {results.standardizedZ}</p>
                      </div>
                      
                      <div className={`p-4 rounded-md ${themeColors.input}`}>
                        <h3 className="text-lg font-semibold mb-2">Critical Values</h3>
                        <p><span className="font-medium">90% CI:</span> {results.criticalValues && `${results.criticalValues['90'].lower.toFixed(4)} to ${results.criticalValues['90'].upper.toFixed(4)}`}</p>
                        <p><span className="font-medium">95% CI:</span> {results.criticalValues && `${results.criticalValues['95'].lower.toFixed(4)} to ${results.criticalValues['95'].upper.toFixed(4)}`}</p>
                        <p><span className="font-medium">99% CI:</span> {results.criticalValues && `${results.criticalValues['99'].lower.toFixed(4)} to ${results.criticalValues['99'].upper.toFixed(4)}`}</p>
                      </div>
                    </>
                  )}
                  
                  {probabilityType === 'poisson' && (
                    <>
                      <div className={`p-4 rounded-md ${themeColors.input}`}>
                        <h3 className="text-lg font-semibold mb-2">Poisson Probability</h3>
                        <p><span className="font-medium">P(X = {poissonParams.k}):</span> {results.exactProbability}</p>
                        <p><span className="font-medium">P(X ≤ {poissonParams.k}):</span> {results.cumulativeLowerProbability}</p>
                        <p><span className="font-medium">P(X ≥ {poissonParams.k}):</span> {results.cumulativeUpperProbability}</p>
                      </div>
                      
                      <div className={`p-4 rounded-md ${themeColors.input}`}>
                        <h3 className="text-lg font-semibold mb-2">Distribution Properties</h3>
                        <p><span className="font-medium">Expected Value:</span> {results.expectedValue}</p>
                        <p><span className="font-medium">Variance:</span> {results.variance}</p>
                        <p><span className="font-medium">Std. Deviation:</span> {results.stdDev}</p>
                      </div>
                    </>
                  )}
                </div>
                
                {/* Distribution Visualization */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Distribution Plot</h3>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      {(probabilityType === 'binomial' || probabilityType === 'poisson') && (
                        <BarChart data={results.distribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="k" 
                            label={{ value: probabilityType === 'binomial' ? 'Number of Successes (k)' : 'Number of Events (k)', position: 'insideBottom', offset: -5 }} 
                          />
                          <YAxis 
                            label={{ value: 'Probability', angle: -90, position: 'insideLeft' }} 
                          />
                          <Tooltip 
                            formatter={(value) => value.toFixed(6)}
                            contentStyle={{ backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff' }}
                          />
                          <Bar 
                            dataKey="probability" 
                            fill={themeColors.accent} 
                            name="Probability"
                            // Highlight the selected k value
                            { ...probabilityType === 'binomial' 
                                ? { fillOpacity: (entry) => entry.k === binomialParams.k ? 1 : 0.6 }
                                : { fillOpacity: (entry) => entry.k === poissonParams.k ? 1 : 0.6 }
                            }
                          />
                        </BarChart>
                      )}
                      
                      {probabilityType === 'normal' && (
                        <LineChart data={results.distribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="x" 
                            domain={[
                              normalParams.mean - 4 * normalParams.stdDev,
                              normalParams.mean + 4 * normalParams.stdDev
                            ]}
                            label={{ value: 'X Value', position: 'insideBottom', offset: -5 }} 
                          />
                          <YAxis 
                            label={{ value: 'Density', angle: -90, position: 'insideLeft' }} 
                          />
                          <Tooltip 
                            formatter={(value) => value.toFixed(6)}
                            labelFormatter={(value) => `x = ${parseFloat(value).toFixed(4)}`}
                            contentStyle={{ backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff' }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="density" 
                            stroke={themeColors.accent} 
                            dot={false} 
                            name="Density" 
                          />
                          
                          {/* Vertical line at x */}
                          <ReferenceLine 
                            x={normalParams.x} 
                            stroke="red" 
                            strokeDasharray="3 3"
                            label={{ value: `x = ${normalParams.x}`, position: 'top' }} 
                          />
                          
                          {/* Lines for mean and +/- 1 std dev */}
                          <ReferenceLine 
                            x={normalParams.mean} 
                            stroke={theme === 'dark' ? '#fff' : '#000'} 
                            label={{ value: 'μ', position: 'top' }} 
                          />
                          <ReferenceLine 
                            x={normalParams.mean + normalParams.stdDev} 
                            stroke="gray" 
                            strokeDasharray="3 3"
                            label={{ value: 'μ+σ', position: 'top' }} 
                          />
                          <ReferenceLine 
                            x={normalParams.mean - normalParams.stdDev} 
                            stroke="gray" 
                            strokeDasharray="3 3"
                            label={{ value: 'μ-σ', position: 'top' }} 
                          />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Correlation and Regression Panel */}
        {activeTab === 'correlationRegression' && (
          <div className={`${themeColors.cardBg} p-6 rounded-lg shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">Correlation & Regression Analysis</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium">X Variable Data:</label>
                <textarea
                  className={`w-full px-4 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                  rows="4"
                  value={correlationData.x}
                  onChange={(e) => setCorrelationData({...correlationData, x: e.target.value})}
                  placeholder="e.g., 3.2, 4.5, 6.7, 8.1, 9.3"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Y Variable Data:</label>
                <textarea
                  className={`w-full px-4 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                  rows="4"
                  value={correlationData.y}
                  onChange={(e) => setCorrelationData({...correlationData, y: e.target.value})}
                  placeholder="e.g., 28, 32, 47, 51, 60"
                />
              </div>
            </div>
            
            <div className="mt-4 mb-8">
              <button
                className={`px-6 py-2 rounded-md ${themeColors.primaryButton} text-white hover:opacity-90`}
                onClick={handleCorrelationAnalysis}
              >
                Analyze
              </button>
            </div>
            
            {correlationResults && (
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-4 rounded-md ${themeColors.input}`}>
                    <h3 className="text-lg font-semibold mb-2">Correlation Analysis</h3>
                    <p><span className="font-medium">Correlation Coefficient (r):</span> {correlationResults.r}</p>
                    <p><span className="font-medium">Coefficient of Determination (r²):</span> {correlationResults.rSquared}</p>
                  </div>

                  <div className={`p-4 rounded-md ${themeColors.input}`}>
                    <h3 className="text-lg font-semibold mb-2">Linear Regression</h3>
                    <p><span className="font-medium">Slope (b):</span> {correlationResults.slope}</p>
                    <p><span className="font-medium">Intercept (a):</span> {correlationResults.intercept}</p>
                    <p><span className="font-medium">Regression Equation:</span> {correlationResults.equation}</p>
                  </div>
                </div>
                
                {/* Scatter Plot */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Scatter Plot with Regression Line</h3>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          dataKey="x" 
                          name="X" 
                          label={{ value: 'X', position: 'insideBottom', offset: -5 }} 
                        />
                        <YAxis 
                          type="number" 
                          dataKey="y" 
                          name="Y" 
                          label={{ value: 'Y', angle: -90, position: 'insideLeft' }} 
                        />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          formatter={(value) => value.toFixed(4)}
                          contentStyle={{ backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff' }}
                        />
                        <Legend />
                        
                        {/* Scatter points */}
                        <Scatter 
                          name="Data Points" 
                          data={correlationResults.scatterData} 
                          fill={themeColors.accent} 
                        />
                        
                        {/* Regression line */}
                        <Line 
                          name="Regression Line" 
                          data={correlationResults.regressionLine} 
                          type="linear" 
                          dataKey="y" 
                          stroke="red" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Hypothesis Testing Panel */}
        {activeTab === 'hypothesisTesting' && (
          <div className={`${themeColors.cardBg} p-6 rounded-lg shadow-lg`}>
            <h2 className="text-2xl font-semibold mb-4">Hypothesis Testing</h2>
            
            <div className="mb-6">
              <label className="block mb-2 font-medium">
                Enter Sample Data (numbers separated by commas, spaces, or new lines):
              </label>
              <textarea
                className={`w-full px-4 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                rows="4"
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                placeholder="e.g., 12, 15, 18, 22, 30, 35, 38"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium">Test Type:</label>
                <select
                  className={`w-full px-4 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                  value={hypothesis.test}
                  onChange={(e) => setHypothesis({...hypothesis, test: e.target.value})}
                >
                  <option value="ttest">t-Test</option>
                  <option value="ztest">z-Test</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Null Hypothesis Value:</label>
                <input
                  type="number"
                  className={`w-full px-4 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                  value={hypothesis.nullValue}
                  step="0.1"
                  onChange={(e) => setHypothesis({...hypothesis, nullValue: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Alternative Hypothesis:</label>
                <select
                  className={`w-full px-4 py-2 rounded-md ${themeColors.input} ${themeColors.text} ${themeColors.border} border`}
                  value={hypothesis.alternative}
                  onChange={(e) => setHypothesis({...hypothesis, alternative: e.target.value})}
                >
                  <option value="two-sided">Two-sided (≠)</option>
                  <option value="greater">Greater than {`>`}</option>
                  <option value="less">Less than {`<`}</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 mb-8">
              <button
                className={`px-6 py-2 rounded-md ${themeColors.primaryButton} text-white hover:opacity-90`}
                onClick={calculateHypothesisTest}
              >
                Run Test
              </button>
            </div>
            
            {results.hypothesisTest && (
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className={`p-4 rounded-md ${themeColors.input}`}>
                    <h3 className="text-lg font-semibold mb-2">Hypothesis</h3>
                    <p><span className="font-medium">Test Type:</span> {results.hypothesisTest.test === 'ttest' ? 'One-sample t-test' : 'One-sample z-test'}</p>
                    <p><span className="font-medium">Null Hypothesis (H₀):</span> {results.hypothesisTest.nullHypothesis}</p>
                    <p><span className="font-medium">Alternative Hypothesis (H₁):</span> {results.hypothesisTest.alternativeHypothesis}</p>
                    <p><span className="font-medium">Significance Level {`α`}:</span> {results.hypothesisTest.alpha}</p>
                  </div>
                  
                  <div className={`p-4 rounded-md ${themeColors.input}`}>
                    <h3 className="text-lg font-semibold mb-2">Test Results</h3>
                    <p><span className="font-medium">Test Statistic:</span> {results.hypothesisTest.testStatistic}</p>
                    <p><span className="font-medium">p-value:</span> {results.hypothesisTest.pValue}</p>
                    <p><span className="font-medium">Critical Value:</span> {results.hypothesisTest.criticalValue}</p>
                    <p className={`font-bold ${results.hypothesisTest.conclusion === 'Reject H₀' ? 'text-red-500' : 'text-green-500'}`}>
                      {results.hypothesisTest.conclusion}
                    </p>
                  </div>
                  
                  <div className={`p-4 rounded-md ${themeColors.input}`}>
                    <h3 className="text-lg font-semibold mb-2">Sample Statistics</h3>
                    <p><span className="font-medium">Sample Mean:</span> {results.hypothesisTest.sampleMean}</p>
                    <p><span className="font-medium">Sample Std. Dev:</span> {results.hypothesisTest.sampleStdDev}</p>
                    <p><span className="font-medium">Sample Size:</span> {results.hypothesisTest.sampleSize}</p>
                    <p><span className="font-medium">Std. Error:</span> {(results.hypothesisTest.sampleStdDev / Math.sqrt(results.hypothesisTest.sampleSize)).toFixed(4)}</p>
                  </div>
                  
                  <div className={`p-4 rounded-md ${themeColors.input}`}>
                    <h3 className="text-lg font-semibold mb-2">Interpretation</h3>
                    <p>
                      {results.hypothesisTest.conclusion === 'Reject H₀' 
                        ? `There is sufficient evidence to reject the null hypothesis at α = ${results.hypothesisTest.alpha}. The sample mean is ${results.hypothesisTest.alternativeHypothesis.includes('>') ? 'significantly greater than' : results.hypothesisTest.alternativeHypothesis.includes('<') ? 'significantly less than' : 'significantly different from'} ${hypothesis.nullValue}.`
                        : `There is not sufficient evidence to reject the null hypothesis at α = ${results.hypothesisTest.alpha}. The sample mean is not ${results.hypothesisTest.alternativeHypothesis.includes('>') ? 'significantly greater than' : results.hypothesisTest.alternativeHypothesis.includes('<') ? 'significantly less than' : 'significantly different from'} ${hypothesis.nullValue}.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
  );
}