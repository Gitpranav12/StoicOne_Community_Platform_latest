import { useState, useCallback } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { LanguageSelector, LANGUAGES } from './components/LanguageSelector';
import { Timer } from './components/Timer';
import { TestCasePanel } from './components/TestCasePanel';
import { OutputConsole } from './components/OutputConsole';
import { ExamSecurityProvider } from './components/ExamSecurityProvider';
import { ProblemDescription } from './components/ProblemDescription';
import { 
  FaPlay, 
  FaPaperPlane, 
  FaShieldAlt, 
  FaUser, 
  FaCode,
  FaChartLine,
  FaCog,
  FaTrophy
} from 'react-icons/fa';
import { toast } from 'sonner';
// import 'bootstrap/dist/css/bootstrap.min.css';

// Mock test cases
const INITIAL_TEST_CASES = [
  {
    id: 0,
    input: '1990',
    expectedOutput: 'False',
  },
  {
    id: 1,
    input: '2000',
    expectedOutput: 'True',
  },
];

export default function CodeEditorPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState(
    LANGUAGES.find((l) => l.id === 'python')?.template || ''
  );
  const [customInput, setCustomInput] = useState('');
  const [testCases, setTestCases] = useState(INITIAL_TEST_CASES);
  const [executionResult, setExecutionResult] = useState(null);
  const [testResults, setTestResults] = useState(undefined);
  const [securityEnabled, setSecurityEnabled] = useState(false);
  const [violations, setViolations] = useState([]);
  const [examStarted, setExamStarted] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });

  // Handle language change
  const handleLanguageChange = (langId) => {
    const language = LANGUAGES.find((l) => l.id === langId);
    if (language) {
      setSelectedLanguage(langId);
      setCode(language.template);
    }
  };

  // Mock code execution
  const executeCode = useCallback(
    (input, isTestCase = false) => {
      const executionTime = Math.floor(Math.random() * 200) + 50;

      try {
        let output = '';

        if (selectedLanguage === 'python') {
          if (input.trim()) {
            const year = parseInt(input.trim());
            if (!isNaN(year) && year >= 1900) {
              const isLeap = (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
              output = isLeap ? 'True' : 'False';
            } else {
              output = 'Invalid input';
            }
          } else {
            output = 'Hello World';
          }
        } else {
          if (input.trim()) {
            const year = parseInt(input.trim());
            if (!isNaN(year) && year >= 1900) {
              const isLeap = (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
              output = isLeap ? 'true' : 'false';
            } else {
              output = 'Invalid input';
            }
          } else {
            output = 'Hello World';
          }
        }

        return {
          stdout: output,
          stderr: '',
          executionTime,
          status: 'success',
        };
      } catch (error) {
        return {
          stdout: '',
          stderr: error instanceof Error ? error.message : 'Execution error',
          executionTime,
          status: 'error',
        };
      }
    },
    [selectedLanguage]
  );

  // Handle run code
  const handleRunCode = () => {
    toast.info('Running code...');
    
    setExecutionResult({ stdout: '', stderr: '', executionTime: 0, status: 'running' });

    setTimeout(() => {
      const result = executeCode(customInput);
      setExecutionResult(result);
      setTestResults(undefined);
      
      if (result.status === 'success') {
        toast.success('Code executed successfully!');
      } else {
        toast.error('Execution failed!');
      }
    }, 500);
  };

  // Handle run all test cases
  const handleRunTestCases = () => {
    toast.info('Running test cases...');
    
    setExecutionResult({ stdout: '', stderr: '', executionTime: 0, status: 'running' });

    setTimeout(() => {
      let passedCount = 0;
      const updatedTestCases = testCases.map((testCase) => {
        const result = executeCode(testCase.input, true);
        const passed = result.stdout.trim() === testCase.expectedOutput.trim();
        if (passed) passedCount++;

        return {
          ...testCase,
          actualOutput: result.stdout,
          passed,
          executionTime: result.executionTime,
        };
      });

      setTestCases(updatedTestCases);
      setTestResults({ passed: passedCount, total: testCases.length });

      const summaryOutput = `Test Cases: ${passedCount}/${testCases.length} passed\n\n` +
        updatedTestCases
          .map((tc) => `Test Case ${tc.id}: ${tc.passed ? '✓ PASS' : '✗ FAIL'}`)
          .join('\n');

      setExecutionResult({
        stdout: summaryOutput,
        stderr: '',
        executionTime: updatedTestCases.reduce((sum, tc) => sum + (tc.executionTime || 0), 0),
        status: 'success',
      });

      if (passedCount === testCases.length) {
        toast.success('All test cases passed! 🎉');
      } else {
        toast.error(`${testCases.length - passedCount} test case(s) failed`);
      }
    }, 1000);
  };

  // Handle submit
  const handleSubmit = () => {
    toast.success('Code submitted successfully! 🎉', {
      description: 'Your solution has been recorded.',
    });
  };

  // Handle security violations
  const handleViolation = (type) => {
    const timestamp = new Date().toLocaleTimeString();
    setViolations((prev) => [...prev, `[${timestamp}] ${type}`]);
    console.warn('Security violation:', type);
  };

  // Handle timer end
  const handleTimeUp = () => {
    toast.error('Time is up!', {
      description: 'Your exam session has ended.',
    });
    setSecurityEnabled(false);
  };

  // Start exam
  const handleStartExam = () => {
    setExamStarted(true);
    setSecurityEnabled(true);
    toast.success('Exam started!', {
      description: 'Security features are now active.',
    });
  };

  return (
    <ExamSecurityProvider enabled={securityEnabled} onViolation={handleViolation}>
      <div className="d-flex flex-column vh-100 bg-light">
        {/* Header */}
        <header className="border-bottom bg-white shadow-sm px-4 py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-4">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary p-2 rounded">
                  <FaCode className="text-white" size={20} />
                </div>
                <h1 className="h4 mb-0 text-primary fw-bold">
                  Stoic Browser
                </h1>
              </div>
              <div className="vr"></div>
              <span className="badge bg-light text-dark border d-flex align-items-center gap-2 px-3 py-2">
                <FaUser size={14} />
                Student ID: 2024001
              </span>
              <span className="badge bg-success bg-opacity-10 text-success border border-success d-flex align-items-center gap-2 px-3 py-2">
                <FaTrophy size={14} />
                850 XP
              </span>
            </div>

            <div className="d-flex align-items-center gap-3">
              {examStarted && <Timer duration={90} onTimeUp={handleTimeUp} />}
              
              <div className="vr"></div>
              
              <div className="form-check form-switch d-flex align-items-center gap-2 bg-light rounded px-3 py-2 mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="security-mode"
                  checked={securityEnabled}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleStartExam();
                    } else {
                      setSecurityEnabled(false);
                      setExamStarted(false);
                      toast.info('Security features disabled');
                    }
                  }}
                />
                <label className="form-check-label d-flex align-items-center gap-2" htmlFor="security-mode">
                  <FaShieldAlt className={securityEnabled ? 'text-success' : 'text-secondary'} />
                  <span className="small">Exam Mode</span>
                </label>
              </div>

              {violations.length > 0 && (
                <span className="badge bg-danger d-flex align-items-center gap-2">
                  <FaChartLine size={12} />
                  {violations.length} violations
                </span>
              )}
              
              <button className="btn btn-light btn-sm rounded-circle p-2">
                <FaCog size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-fill overflow-hidden">
          <div className="row g-0 h-100">
            {/* Problem Description Panel */}
            <div className="col-lg-4 col-md-5 border-end h-100 overflow-auto">
              <ProblemDescription />
            </div>

            {/* Code Editor & Results Panel */}
            <div className="col-lg-8 col-md-7 h-100 d-flex flex-column">
              {/* Code Editor */}
              <div className="flex-fill d-flex flex-column" style={{ minHeight: '60%', maxHeight: '60%' }}>
                <div className="bg-white h-100 d-flex flex-column">
                  {/* Editor Header */}
                  <div className="border-bottom bg-light px-3 py-2 d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <LanguageSelector
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                      />
                    </div>
                    
                    <div className="small text-muted font-monospace">
                      Line: {cursorPosition.line} Col: {cursorPosition.col}
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="flex-fill overflow-hidden">
                    <CodeEditor
                      value={code}
                      onChange={setCode}
                      language={selectedLanguage}
                      onCursorChange={(line, col) => setCursorPosition({ line, col })}
                    />
                  </div>

                  {/* Editor Actions */}
                  <div className="border-top bg-light px-3 py-2 d-flex align-items-center justify-content-between">
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2" onClick={handleRunCode}>
                        <FaPlay size={12} />
                        Test against custom input
                      </button>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2" onClick={handleRunTestCases}>
                        <FaPlay size={12} />
                        Run Code
                      </button>
                      <button 
                        className="btn btn-sm btn-success d-flex align-items-center gap-2"
                        onClick={handleSubmit}
                      >
                        <FaPaperPlane size={12} />
                        Submit Code
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Cases & Output Panel */}
              <div className="flex-fill border-top" style={{ minHeight: '40%', maxHeight: '40%' }}>
                <div className="row g-0 h-100">
                  {/* Test Cases */}
                  <div className="col-6 border-end p-3 h-100 overflow-auto">
                    <TestCasePanel
                      testCases={testCases}
                      customInput={customInput}
                      onCustomInputChange={setCustomInput}
                    />
                  </div>

                  {/* Output Console */}
                  <div className="col-6 p-3 h-100 overflow-auto">
                    <OutputConsole result={executionResult} testResults={testResults} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-top bg-white px-4 py-2">
          <div className="d-flex align-items-center justify-content-between">
            <p className="small text-muted mb-0">
              © 2025 CodeExam - Secure Coding Platform
            </p>
            <div className="d-flex align-items-center gap-3 small text-muted">
              <span>{LANGUAGES.find(l => l.id === selectedLanguage)?.name}</span>
              <div className="vr"></div>
              <span>{code.split('\n').length} lines</span>
              <div className="vr"></div>
              <span>{code.length} characters</span>
            </div>
          </div>
        </footer>
      </div>
    </ExamSecurityProvider>
  );
}
