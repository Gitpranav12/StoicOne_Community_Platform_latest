import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import "bootstrap/dist/css/bootstrap.min.css";

// ... (LANGUAGES आणि DUMMY_QUESTION_DATA अपरिवर्तित) ...
const LANGUAGES = {
  python: "Python",
  cpp: "C++",
  c: "C",
  java: "Java",
  javascript: "JavaScript",
  sql: "MySQL (SQL)",
  html: "HTML",
  css: "CSS",
};

const CodeCompiler = () => {
  const navigate = useNavigate();

  // ✅ Get contestId & roundId from the URL
  // Example: /events/code/23/200 → contestId=23, roundId=200
  const { contestId, roundId } = useParams();

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(getDefaultCode("python"));
  const [output, setOutput] = useState("Run your code to see the output here.");
  const [customInput, setCustomInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // ✅ Backend question data states
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [evaluationResults, setEvaluationResults] = useState(null);
  const [overallStatus, setOverallStatus] = useState("");

  // ... (getDefaultCode फंक्शन अपरिवर्तित) ...
  function getDefaultCode(lang) {
    switch (lang) {
      case "python":
        // युजरला इनपुट घेण्याची गरज नाही, म्हणून 'input()' काढून टाकले आहे.
        // आता कोड फक्त फंक्शन definetion असावा आणि तो test cases द्वारे कॉल होईल.
        return 'def is_leap(year):\n  # Write your Python code here\n  if year % 400 == 0:\n    return "True"\n  if year % 100 == 0:\n    return "False"\n  if year % 4 == 0:\n    return "True"\n  return "False"';
      case "cpp":
        return '#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello C++";\n  return 0;\n}';
      case "c":
        return '#include <stdio.h>\nint main() {\n  printf("Hello C");\n  return 0;\n}';
      case "java":
        return 'class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello Java");\n  }\n}';
      case "javascript":
        return 'function solve() {\n  console.log("Hello JavaScript");\n}\nsolve();';
      case "sql":
        return "SELECT * FROM users;";
      case "html":
        return '<h1>Web Output</h1>\n<p style="color: green;">Change the CSS language to see real-time styling changes.</p>\n<div class="styled-box">This box has CSS applied.</div>';
      case "css":
        return ".styled-box {\n  background-color: #0d6efd;\n  color: white;\n  padding: 15px;\n  border-radius: 5px;\n}\nh1 { color: #dc3545; }";
      default:
        return `// Start coding in ${lang} here...`;
    }
  }

  // ✅ Fetch coding question from backend
// ✅ Fetch coding question from backend
useEffect(() => {
  const fetchCodingQuestion = async () => {
    try {
      setLoading(true);
      setError("");

      const apiUrl = `http://localhost:8080/api/contests/${contestId}/round/${roundId}/coding`;
      console.log("📡 Fetching:", apiUrl);

      const res = await fetch(apiUrl);

      // 🛠️ Handle non-200 responses
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server error: ${res.status} - ${errText}`);
      }

      // ✅ Parse JSON safely
      const data = await res.json();

      // ✅ Basic validation
      if (!data || !data.questions || data.questions.length === 0) {
        throw new Error("No questions found in response");
      }

      console.log("✅ Coding question loaded:", data);
      setQuestionData(data);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      setError(err.message || "Something went wrong while fetching the question.");
    } finally {
      setLoading(false);
    }
  };

  fetchCodingQuestion();
}, [contestId, roundId]);


  // ✅ Extract first question (for now)
  const question = questionData?.questions?.[0] || null;

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(getDefaultCode(newLang));
    setOutput("");
    setEvaluationResults(null);
    setOverallStatus("");
  };

  // ✅ नवीन: टेस्ट केस इव्हॅल्युएशन logic
  const runEvaluation = async (testCasesToRun, isSubmit = false) => {
    if (testCasesToRun.length === 0) {
      setOutput("No test cases to run.");
      return;
    }

    setIsRunning(true);
    setEvaluationResults(null);
    setOverallStatus("");

    // रन बटण दाबल्यावर, फक्त सॅम्पल टेस्ट केसेससाठी आउटपुटमध्ये हा संदेश दाखवा
    const initialMessage = isSubmit
      ? "Submitting code for full evaluation..."
      : "Running sample test cases...";
    setOutput(initialMessage);

    try {
      const response = await fetch(
        "http://localhost:8080/api/compiler/submit-code",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: code,
            language: language,
            testCases: testCasesToRun,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.output ||
            errorData.message ||
            "Server returned an unexpected error."
        );
      }

      const evaluationData = await response.json();

      setOverallStatus(evaluationData.overallStatus);
      setEvaluationResults(evaluationData.results);

      // Output मध्ये सारांश (Summary) दाखवा
      const statusMessage = `${evaluationData.overallStatus}! Passed: ${evaluationData.passed}/${evaluationData.totalTests} tests.`;
      setOutput(statusMessage);
    } catch (error) {
      console.error("Evaluation Error:", error);
      setOverallStatus("Error");
      setEvaluationResults(null);
      if (error.message.includes("failed to fetch")) {
        setOutput(
          "Evaluation Failed: Could not connect to the backend server (Check Port 8080)."
        );
      } else {
        setOutput(`Evaluation Failed: ${error.message}`);
      }
    } finally {
      setIsRunning(false);
    }
  };

  // ✅ अपडेटेड: Run Code बटण
  const handleRunCode = async () => {
    // 1. HTML/CSS असल्यास, renderOutputContent आपोआप रन होईल, फक्त आउटपुट रिसेट करा.
    if (language === "html" || language === "css") {
      setOutput("HTML/CSS rendered below.");
      setEvaluationResults(null);
      return;
    }

    // 2. जर Custom Input असेल, तर ते वापरून फक्त एकच रन करा (/run-code ला कॉल).
    if (customInput.trim() !== "") {
      // जुना /run-code logic
      setIsRunning(true);
      setOutput("Running code with custom input...");
      setEvaluationResults(null);
      setOverallStatus("");

      try {
        // 💡 /run-code API ला कॉल
        const apiEndpoint = "http://localhost:8080/api/compiler/run-code";
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: language,
            code: code,
            input: customInput,
          }),
        });
        const data = await response.json();

        if (response.ok) {
          setOutput(data.output || "Execution completed successfully.");
        } else {
          setOutput(
            data.output ||
              data.error ||
              "Execution failed with an unknown error."
          );
        }
      } catch (error) {
        setOutput("Server error: Could not reach the code execution service.");
      } finally {
        setIsRunning(false);
      }
      return;
    }

    // 3. जर Custom Input नसेल, तर Sample Test Cases रन करा (/submit-code ला कॉल).
    // हीच तुमची मुख्य मागणी आहे.
   // Construct a test case array safely
  const testCases = question
    ? [
        {
          id: 1,
          input: question.sampleInput || "",
          expectedOutput: question.sampleOutput || "",
        },
      ]
    : [];

  if (testCases.length === 0) {
    setOutput("No sample test cases available.");
    return;
  }

  runEvaluation(testCases, false);
  };

  // ✅ Submit Code बटण (संपूर्ण टेस्ट केसेससाठी)
  //   const handleSubmitCode = async () => {
  //     const allTestCases = [
  //         ...question.sampleTestCases,
  //         ...question.hiddenTestCases
  //     ];
  //     // संपूर्ण इव्हॅल्युएशनसाठी नवीन फंक्शन वापरा
  //     runEvaluation(allTestCases, true);
  //   };

  // ✅ Submit button handler (all test cases)
  const handleSubmitCode = async () => {
    const allTestCases = question
      ? [
          {
            id: 1,
            input: question.sampleInput || "",
            expectedOutput: question.sampleOutput || "",
          },
        ]
      : [];
    runEvaluation(allTestCases, true);
  };

  // ... (renderOutputContent आणि return JSX अपरिवर्तित) ...
  const renderOutputContent = () => {
    if (evaluationResults) {
      return (
        <div
          className="p-3 mb-0"
          style={{ maxHeight: "280px", overflowY: "auto" }}
        >
          <h5
            className={
              overallStatus === "Accepted" ? "text-success" : "text-danger"
            }
            style={{
              color: overallStatus === "Accepted" ? "#198754" : "#dc3545",
            }}
          >
            Final Status: {overallStatus}
          </h5>
          <ul className="list-unstyled">
            {evaluationResults.map((result, index) => (
              // ✅ Pass/Fail लॉजिक (जसे हवे आहे)
              <li
                key={result.id || index}
                className={`mb-2 p-2 rounded ${
                  result.status === "Passed"
                    ? "bg-success text-white"
                    : "bg-danger text-white"
                }`}
              >
                <strong>Test Case {result.id || index + 1}:</strong>{" "}
                {result.status}
                {result.status !== "Passed" &&
                  result.message !== "Runtime/Compilation Error" && (
                    <div className="mt-1 small">
                      Expected:{" "}
                      <span className="fw-bold">{result.expected}</span> |
                      Actual: <span className="fw-bold">{result.actual}</span>
                    </div>
                  )}
                {result.message.includes("Error") && (
                  <div className="mt-1 small">
                    Error: <span className="fw-bold">{result.actual}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (language === "html" || language === "css") {
      const htmlCode = language === "html" ? code : getDefaultCode("html");
      const cssCode = language === "css" ? code : getDefaultCode("css");

      const finalHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>${cssCode}</style>
            </head>
            <body>
                ${htmlCode}
            </body>
            </html>
        `;

      return (
        <iframe
          title="Code Output Render"
          srcDoc={finalHtml}
          style={{
            width: "100%",
            height: "280px",
            border: "none",
            backgroundColor: "white",
          }}
        ></iframe>
      );
    }

    return (
      <pre
        className="p-3 mb-0"
        style={{
          minHeight: "135px",
          whiteSpace: "pre-wrap",
          overflowY: "auto",
          maxHeight: "280px",
        }}
      >
        {output}
      </pre>
    );
  };

  // ✅ SAFE RENDERING: prevent crash while loading
  if (loading) {
    return (
      <div className="p-5 text-center">
        <h5>Loading coding question...</h5>
      </div>
    );
  }

if (error) {
  return (
    <div className="p-5 text-center text-danger">
      <h5>❌ Failed to load coding question</h5>
      <p style={{ whiteSpace: "pre-wrap" }}>{error}</p>
      <button
        className="btn btn-outline-secondary mt-3"
        onClick={() => window.location.reload()}
      >
        🔄 Retry
      </button>
    </div>
  );
}


  if (!question) {
    return (
      <div className="p-5 text-center">
        <h5>No coding question found for this round.</h5>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3">
      <div className="row">
        {/* 1. डावा कॉलम: प्रश्न आणि समस्या */}
        {/* LEFT COLUMN: Question Details */}
        <div
          className="col-lg-5 col-xl-4 border-end"
          style={{ maxHeight: "90vh", overflowY: "auto" }}
        >
          <h4 className="fw-bold">
            {questionData.title}
          </h4>
      

          <hr />
          <h4 className="fw-bold">
            {question.id}. {question.title}
          </h4>
          <p style={{ whiteSpace: "pre-wrap" }}>{question.description}</p>

          <h6 className="mt-4 fw-bold text-primary">Input Format</h6>
          <p>{question.inputFormat || "N/A"}</p>

          <h6 className="fw-bold text-primary">Output Format</h6>
          <p>{question.outputFormat || "N/A"}</p>

          <h6 className="fw-bold text-primary">Sample Input</h6>
          <pre className="bg-light p-2 rounded">
            {question.sampleInput || "—"}
          </pre>

          <h6 className="fw-bold text-primary">Sample Output</h6>
          <pre className="bg-light p-2 rounded">
            {question.sampleOutput || "—"}
          </pre>
        </div>

        {/* 2. मध्य आणि उजवा कॉलम: एडिटर, इनपुट आणि आउटपुट */}
        <div className="col-lg-7 col-xl-8">
          <div className="row mb-3 align-items-center">
            {/* भाषा निवड ड्रॉपडाउन */}
            <div className="col-auto">
              <select
                className="form-select"
                value={language}
                onChange={handleLanguageChange}
                style={{ width: "auto" }}
                disabled={isRunning}
              >
                {Object.entries(LANGUAGES).map(([key, name]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* रन आणि सबमिट बटणे */}
            <div className="col-auto ms-auto">
              <button
                className="btn btn-success me-2"
                onClick={handleRunCode}
                disabled={isRunning}
              >
                {isRunning ? "Running..." : "Run Code (Sample Tests)"}
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmitCode}
                disabled={
                  isRunning || language === "html" || language === "css"
                }
              >
                Submit Code (All Tests)
              </button>
            </div>
          </div>

          <div className="row">
            {/* कोड एडिटर */}
            <div className="col-12 mb-4">
              <div className="card shadow-sm">
                <div className="card-body p-0" style={{ height: "450px" }}>
                  <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={handleEditorChange}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* इनपुट/आउटपुट पॅनल */}
            <div className="col-12">
              <div className="row">
                {/* कस्टम इनपुट */}
                <div className="col-md-6 mb-3">
                  <h5 className="mb-2">
                    Custom Input (Overrides Sample Tests)
                  </h5>
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Enter custom input here to run the code only once, instead of running sample tests..."
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    disabled={isRunning}
                  />
                </div>

                {/* आउटपुट बॉक्स */}
                <div className="col-md-6 mb-3">
                  <h5 className="mb-2">Output / Test Results</h5>
                  <div className="card bg-dark text-white p-0">
                    {renderOutputContent()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeCompiler;
