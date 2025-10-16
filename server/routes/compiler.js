// routes/compiler.js

const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // Make sure you have 'node-fetch@2' installed

// ⚠️ IMPORTANT: These runtimes are based on the Piston API specifications.
const LANGUAGE_RUNTIMES = {
    python: { name: "python", version: "3.10.0" },
    javascript: { name: "javascript", version: "18.15.0" },
    java: { name: "java", version: "15.0.2" },
    cpp: { name: "c++", version: "10.2.0" },
    // C ॲड केला
    c: { name: "c", version: "10.2.0" },
    sql: { name: "sqlite", version: "3.37.2" }, // SQL runtime update केला
    // HTML/CSS ला Piston API द्वारे रन करण्याची गरज नाही, 
    // पण कंपाइलरचा भाग म्हणून येथे ठेवला आहे
    html: { name: "html", version: "5.0.0" },
    css: { name: "css", version: "3.0.0" },
};

// =========================================================
// 💡 HELPER FUNCTION: Executes code using the Piston API
// =========================================================
async function executeCode(code, language, input) {
    const runtime = LANGUAGE_RUNTIMES[language];

    if (!runtime) {
        return { output: null, error: "Unsupported language." };
    }

    // HTML आणि CSS साठी, आम्ही Piston API वापरत नाही, कारण ते ब्राउझरमध्ये रन होतात.
    // परंतु /submit-code मध्ये ते आले तर एक त्रुटी परत पाठवू.
    if (language === 'html' || language === 'css' || language === 'sql') {
        return {
            output: null,
            error: `Language ${language} does not support backend test case evaluation.`
        };
    }

    const submissionPayload = {
        language: runtime.name,
        version: runtime.version,
        files: [{ content: code }],
        stdin: input,
    };

    try {
        // Piston API URL
        const apiResponse = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionPayload),
        });

        const data = await apiResponse.json();

        if (data.run) {
            // Trim and return output. If there's an stderr, treat it as an error.
            return {
                output: data.run.output ? data.run.output.trim() : '',
                error: data.run.stderr ? data.run.stderr.trim() : null
            };
        }
        return { output: null, error: "Execution service failed." };

    } catch (error) {
        return { output: null, error: "External compiler connection failed." };
    }
}

// =========================================================
// ✅ नवीन HELPER FUNCTION: आऊटपुट तुलना
// =========================================================
function compareOutputs(actual, expected) {
    // 1. दोन्ही आऊटपुट 'String' मध्ये रूपांतरित करा.
    const cleanActual = String(actual || '').trim();
    const cleanExpected = String(expected || '').trim();

    // 2. सर्व व्हाईटस्पेस (spaces, tabs, newlines) एकाच स्पेसने बदला.
    // अनेक प्रोग्रामिंग प्रॉब्लेम्समध्ये हा फरक ग्राह्य धरला जातो.
    const normalizedActual = cleanActual.replace(/\s+/g, ' ').toLowerCase();
    const normalizedExpected = cleanExpected.replace(/\s+/g, ' ').toLowerCase();

    // 3. तुलना करा.
    return normalizedActual === normalizedExpected;
}


// 🛑 CODE EXECUTION API ROUTE (Simplified using the helper)
router.post('/run-code', async(req, res) => {
    const { code, language, input } = req.body;

    const result = await executeCode(code, language, input);

    if (result.error && result.error.includes("does not support backend")) {
        // HTML/CSS साठी विशेष त्रुटी संदेश
        return res.status(400).json({
            error: "Feature Not Supported",
            output: `The run feature is not supported for ${language.toUpperCase()}. Please use the Run button only for compiled languages (Python, C++, Java, etc.).`
        });
    }

    if (result.error) {
        return res.status(400).json({
            error: "Compilation/Runtime Error",
            output: result.error
        });
    }

    if (result.output === null) {
        return res.status(500).json({ output: "Execution failed or timed out." });
    }

    // Success response
    return res.json({
        output: result.output,
    });
});


// =========================================================
// 🛑 SUBMIT CODE ROUTE (TEST CASE EVALUATION LOGIC)
// =========================================================
router.post('/submit-code', async(req, res) => {
    const { code, language, testCases } = req.body;
    const finalResults = [];

    if (!testCases || testCases.length === 0) {
        return res.status(400).json({ overallStatus: "Error", message: "No test cases provided." });
    }

    let overallStatus = "Accepted"; // Default to Accepted

    // 1. Each test case is run sequentially
    for (const testCase of testCases) {

        // Execute the code using the current test case input
        const executionResult = await executeCode(code, language, testCase.input);

        // अपेक्षित आऊटपुट नेहमी trim केले जाईल
        const expectedOutput = String(testCase.expectedOutput).trim();

        const testResult = {
            id: testCase.id,
            input: testCase.input,
            expected: expectedOutput,
            actual: executionResult.output || executionResult.error || "No Output",
            status: "Error", // Default status
            message: ""
        };

        if (executionResult.error) {
            // 2. Handle Compilation or Runtime Error
            testResult.status = "Failed";
            testResult.message = `Runtime/Compilation Error: ${executionResult.error}`;
            finalResults.push(testResult);
            overallStatus = "Error"; // Final status is Error
            // पहिल्या major error वर थांबण्याची गरज नाही, पण फ्रन्टएंडला हाच स्टेटस पाठवावा
            break;
        } else {
            // 3. Compare Actual Output vs Expected Output (Improved Logic)
            if (compareOutputs(testResult.actual, expectedOutput)) { // ✅ नवीन हेल्पर फंक्शन वापरले
                testResult.status = "Passed";
                testResult.message = "Output matched.";
            } else {
                testResult.status = "Failed";
                testResult.message = "Wrong Answer";
                // ❌ जर एखादी टेस्ट केस फेल झाली, तर अंतिम स्टेटस 'Wrong Answer' होईल.
                if (overallStatus !== "Error") {
                    overallStatus = "Wrong Answer";
                }
            }
            finalResults.push(testResult);
        }
    }

    // 4. Final Summary Calculation
    const totalPassed = finalResults.filter(r => r.status === "Passed").length;

    // 5. Return the evaluation summary to the frontend
    res.json({
        totalTests: testCases.length,
        passed: totalPassed,
        results: finalResults,
        overallStatus: overallStatus
    });
});

module.exports = router;