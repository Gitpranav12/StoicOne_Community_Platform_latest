import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContext } from "../UserProfilePage/context/UserContext";
import toast from "react-hot-toast";

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
  const { user: contextUser } = useContext(UserContext);
  const currentUserId = contextUser?.profile?.id;
  // ✅ Get contestId & roundId from the URL
  // Example: /events/code/23/200 → contestId=23, roundId=200
  const { contestId, roundId: roundIdFromUrl } = useParams(); // ✅ CHANGE: removed roundId from here; we handle currentRoundIndex dynamically
  const [rounds, setRounds] = useState([]); // ✅ CHANGE: store all rounds
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0); // ✅ CHANGE: track which round is active
  const [roundId, setRoundId] = useState(null); // ✅ CHANGE: current roundId derived from rounds[currentRoundIndex]

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(getDefaultCode("python"));
  const [output, setOutput] = useState("Run your code to see the output here.");
  const [customInput, setCustomInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // ✅ Backend question data states
  const [questionData, setQuestionData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // ✅ CHANGE: track current question
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

  // ✅ CHANGE: Fetch all rounds first
  useEffect(() => {
    const fetchRounds = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `http://localhost:8080/api/contests/${contestId}`
        );
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();

        if (!data || !data.rounds || data.rounds.length === 0) {
          throw new Error("No rounds found for this contest");
        }

        // ✅ Filter only coding rounds
        const codingRounds = data.rounds.filter((r) => r.type === "coding");

        if (codingRounds.length === 0) {
          throw new Error("No coding rounds found for this contest");
        }

        setRounds(codingRounds);
        // ✅ Determine which round to start from
        let selectedIndex = codingRounds.findIndex(
          (r) => String(r.id) === String(roundIdFromUrl)
        );
        if (selectedIndex === -1) selectedIndex = 0; // fallback if invalid roundId

        setCurrentRoundIndex(selectedIndex);
        setRoundId(codingRounds[selectedIndex].id);

        console.log("✅ Coding rounds:", codingRounds);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRounds();
  }, [contestId]);

  // ✅ CHANGE: Fetch questions whenever roundId changes
  useEffect(() => {
    if (!roundId) return;

    const fetchCodingQuestion = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = `http://localhost:8080/api/contests/${contestId}/round/${roundId}/coding`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();

        if (!data || !data.questions || data.questions.length === 0) {
          throw new Error("No questions found in this round");
        }

        setQuestionData(data);
        setCurrentQuestionIndex(0); // ✅ CHANGE: start from first question in round
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCodingQuestion();
  }, [contestId, roundId]);

  // Timer
  const [timer, setTimer] = useState(0);
  const storageKey = `contest_end_time_${contestId}_${currentUserId}`;

  useEffect(() => {
    if (!questionData) return;

    // Get round duration from API or default to 30 minutes
    const durationInMinutes = questionData.duration || 30;
    let endTime = localStorage.getItem(storageKey);

    if (!endTime) {
      endTime = Date.now() + durationInMinutes * 60 * 1000;
      localStorage.setItem(storageKey, endTime);
    } else {
      endTime = parseInt(endTime, 10);
    }

    const interval = setInterval(() => {
      const remaining = Math.floor((endTime - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(interval);
        localStorage.removeItem(storageKey);
        alert("Time is over!"); // or any custom behavior
      } else {
        setTimer(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [questionData, storageKey]);

  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // ✅ CHANGE: current question derived dynamically
  const question = questionData?.questions?.[currentQuestionIndex] || null;

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
    // const testCases = question
    //   ? [
    //       {
    //         id: 1,
    //         input: question.sampleInput || "",
    //         expectedOutput: question.sampleOutput || "",
    //       },
    //     ]
    //   : [];

    const testCases = [];

    if (question?.sampleInput && question?.sampleOutput) {
      testCases.push({
        id: 1,
        input: question.sampleInput,
        expectedOutput: question.sampleOutput,
      });
    }

    if (question?.sampleInput2 && question?.sampleOutput2) {
      testCases.push({
        id: 2,
        input: question.sampleInput2,
        expectedOutput: question.sampleOutput2,
      });
    }

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
    const allTestCases = [];

    if (question?.sampleInput && question?.sampleOutput) {
      allTestCases.push({
        id: 1,
        input: question.sampleInput,
        expectedOutput: question.sampleOutput,
      });
    }

    if (question?.sampleInput2 && question?.sampleOutput2) {
      allTestCases.push({
        id: 2,
        input: question.sampleInput2,
        expectedOutput: question.sampleOutput2,
      });
    }

    if (allTestCases.length === 0) {
      setOutput("No available test cases for this question.");
      return;
    }
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

  // ✅ CHANGE: Save & Submit → move to next question or round
  const handleSaveAndSubmit = async () => {
    if (!question || !evaluationResults) {
      toast.error("⚠️ Please run or submit your code first to get results!");
      return;
    }

    const passedCount = evaluationResults.filter(
      (t) => t.status === "Passed"
    ).length;
    const totalCount = evaluationResults.length || 1;
    const autoScore = (passedCount / totalCount) * 100;

    try {
      await fetch("http://localhost:8080/api/contests/coding_submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contest_id: contestId,
          round_id: roundId,
          user_id: currentUserId,
          question_id: question.id,
          code,
          language,
          auto_score: autoScore,
        }),
      });

      console.log("✅ Coding submission saved successfully.");

      // ✅ Mark current round as completed in localStorage
      const key = `contest_${contestId}_rounds_complete`;
      let completedRounds = JSON.parse(localStorage.getItem(key) || "[]");

      const roundIndex = rounds.findIndex(
        (r) => String(r.id) === String(roundId)
      );
      if (roundIndex !== -1 && !completedRounds.includes(roundId)) {
        completedRounds.push(roundId);
        localStorage.setItem(key, JSON.stringify(completedRounds));
        console.log(`✅ Round ${roundId} marked as complete.`);
      }

      // ✅ CHANGE: Move to next question in same round
      if (currentQuestionIndex + 1 < questionData.questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCode(getDefaultCode(language));
        setEvaluationResults(null);
        setOutput("");
        toast.success("Next Question Loaded.");
      } else {
        // ✅ Find next *incomplete* coding round (even if earlier ones are pending)
        const key = `contest_${contestId}_rounds_complete`;
        const completedRounds = JSON.parse(localStorage.getItem(key) || "[]");

        const nextIncompleteIndex = rounds.findIndex(
          (r) => !completedRounds.includes(r.id)
        );

        if (nextIncompleteIndex !== -1) {
          const nextRound = rounds[nextIncompleteIndex];
          setCurrentRoundIndex(nextIncompleteIndex);
          setRoundId(nextRound.id);
          setCode(getDefaultCode(language));
          setEvaluationResults(null);
          setOutput("");
          toast.success("Next Incomplete Round Started.");
          navigate(`/events/code/${contestId}/${nextRound.id}`); // ✅ update URL too
        } else {
          // ✅ All coding rounds completed
          toast.success("🎉 You have completed all Coding Rounds!");
          navigate(`/events/progress/${contestId}`);
        }
      }
    } catch (err) {
      console.error("❌ Error saving submission:", err);
      toast.error("Error saving your submission. Please try again.");
    }
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
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h4 className="fw-bold">{questionData.title}</h4>
            <span style={{ color: "#cf2a17", fontWeight: 400 }}>
              <span style={{ fontSize: 18 }}>&#128337;</span>
              {formatTime(timer)}
            </span>
          </div>

          <hr />
          <h4 className="fw-bold">
            {question.id}. {question.title}
          </h4>
          <p style={{ whiteSpace: "pre-wrap" }}>{question.description}</p>

          <h6 className="mt-4 fw-bold text-primary">Input Format</h6>
          <p>{question.inputFormat || "N/A"}</p>

          <h6 className="fw-bold text-primary">Output Format</h6>
          <p>{question.outputFormat || "N/A"}</p>

          <h6 className="fw-bold text-primary">Sample Input 1</h6>
          <pre className="bg-light p-2 rounded">
            {question.sampleInput || "—"}
          </pre>

          <h6 className="fw-bold text-primary">Sample Output 1</h6>
          <pre className="bg-light p-2 rounded">
            {question.sampleOutput || "—"}
          </pre>

             <h6 className="fw-bold text-primary">Sample Input 2</h6>
          <pre className="bg-light p-2 rounded">
            {question.sampleInput2 || "—"}
          </pre>

          <h6 className="fw-bold text-primary">Sample Output 2</h6>
          <pre className="bg-light p-2 rounded">
            {question.sampleOutput2 || "—"}
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

              <button
                className="btn btn-warning ms-2"
                onClick={handleSaveAndSubmit}
                disabled={
                  isRunning || language === "html" || language === "css"
                }
              >
                Save & Submit
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
