import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Edit2 } from "lucide-react";
import Layout from "../../Layout/Layout";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateContestForm({ onSuccess }) {
  const location = useLocation();
  const editingContest = location.state?.contest; // 🟢 Contest being edited

  // Helper to format date for datetime-local input
  const formatForDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [formData, setFormData] = useState({
    title: editingContest?.title || "",
    description: editingContest?.description || "",
    banner: editingContest?.banner || null,
    startDate: editingContest
      ? formatForDateTimeLocal(editingContest.startDate)
      : "",
    endDate: editingContest
      ? formatForDateTimeLocal(editingContest.endDate)
      : "",
    status: editingContest?.status || "draft",
  });

  const [rounds, setRounds] = useState(
    (editingContest?.rounds || []).map((r) => ({
      roundName: r.round_name || "", // <-- fix here
      type: r.type || "quiz",
      duration: r.duration || 30,
      questions: (r.questions || []).map((q) => {
        if (r.type === "quiz") {
          return {
            text: q.text || "",
            options: [
              q.option_1 || "",
              q.option_2 || "",
              q.option_3 || "",
              q.option_4 || "",
            ],
            correctIndex: q.correct_index ?? 0,
          };
        } else if (r.type === "coding") {
          return {
            title: q.title || "",
            description: q.description || "",
            inputFormat: q.input_format || "",
            outputFormat: q.output_format || "",
            sampleInput: q.sample_input || "",
            sampleOutput: q.sample_output || "",
            sampleInput2: q.sample_input_2 || "", // ✅ added
            sampleOutput2: q.sample_output_2 || "", // ✅ added
          };
        }
        return q;
      }),
    }))
  );

  const [newRound, setNewRound] = useState({
    roundName: "",
    type: "quiz",
    duration: 30,
    questions: [],
  });

  const [loading, setLoading] = useState(false);

  const [editingRoundIndex, setEditingRoundIndex] = useState(null);

  const navigate = useNavigate();

  const handleCancel = () => navigate(-1); // ✅ Go back

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Utility to get current datetime in the right format (YYYY-MM-DDTHH:MM)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for local timezone
    return now.toISOString().slice(0, 16);
  };


  const handleRoundChange = (e) => {
    const { name, value } = e.target;
    setNewRound((prev) => ({ ...prev, [name]: value }));
  };

  // Round/Question handlers
  const addRound = () => {
    if (!newRound.roundName.trim()) return;

    if (editingRoundIndex !== null && rounds[editingRoundIndex]) {
      const updated = [...rounds];
      updated[editingRoundIndex] = {
        ...newRound,
        id: updated[editingRoundIndex]?.id || `r${editingRoundIndex + 1}`,
      };
      setRounds(updated);
      setEditingRoundIndex(null);
    } else {
      // setRounds([...rounds, { ...newRound, id: `r${rounds.length + 1}` }]);
      // Prepend new round to show at top
      setRounds([{ ...newRound, id: `r${rounds.length + 1}` }, ...rounds]);
    }

    setNewRound({ roundName: "", type: "quiz", duration: 30, questions: [] });
  };

  const handleEditRound = (index) => {
    setEditingRoundIndex(index);
    const r = rounds[index];
    setNewRound({
      roundName: r.roundName,
      type: r.type,
      duration: r.duration,
      questions: r.questions,
    });
  };

  const removeRound = (index) => {
    setRounds((prev) => prev.filter((_, i) => i !== index));

    // 🧹 If the deleted round was being edited, reset form and editing index
    if (editingRoundIndex === index) {
      setNewRound({ roundName: "", type: "quiz", duration: 30, questions: [] });
      setEditingRoundIndex(null);
    }

    // 🧠 If you delete a round before the one you're editing, shift the index properly
    else if (editingRoundIndex !== null && index < editingRoundIndex) {
      setEditingRoundIndex((prev) => prev - 1);
    }
  };

  const addQuestion = (roundIndex, question) => {
    const updated = [...rounds];
    updated[roundIndex].questions.push(question);
    setRounds(updated);
  };

  const updateQuestion = (roundIndex, qIndex, updatedQ) => {
    const updated = [...rounds];
    updated[roundIndex].questions[qIndex] = updatedQ;
    setRounds(updated);
  };

  const removeQuestion = (roundIndex, qIndex) => {
    const updated = [...rounds];
    updated[roundIndex].questions.splice(qIndex, 1);
    setRounds(updated);
  };

  // Submit handler - send FormData to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) return;
    if (rounds.length === 0) {
      toast.error("Please add at least one round!");

      return;
    }

    if (rounds.length === 0) {
      toast.error("Please add at least one round!");
      return;
    }

    // 🛑 validate each round
    for (const [index, r] of rounds.entries()) {
      if (!r.roundName || r.roundName.trim() === "") {
        toast.error(`Round ${index + 1} is missing a name.`);
        return;
      }
      if (!r.type) {
        toast.error(`Round ${index + 1} type is missing.`);
        return;
      }
    }

    setLoading(true);
    try {
      const submissionData = {
        title: formData.title,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
        rounds: rounds.map((r) => ({
          round_name: r.roundName,
          type: r.type,
          duration: r.duration,
          questions: r.questions.map((q) => {
            if (r.type === "quiz") {
              return {
                text: q.text,
                option_1: q.options[0],
                option_2: q.options[1],
                option_3: q.options[2],
                option_4: q.options[3],
                correct_index: q.correctIndex,
              };
            } else if (r.type === "coding") {
              return {
                title: q.title,
                description: q.description,
                input_format: q.inputFormat,
                output_format: q.outputFormat,
                sample_input: q.sampleInput,
                sample_output: q.sampleOutput,
                sample_input_2: q.sampleInput2, // 🆕
                sample_output_2: q.sampleOutput2, // 🆕
              };
            }
            return q;
          }),
        })),
      };

      // console.log("Submitting contest data:", submissionData);

      const res = await fetch(
        editingContest
          ? `http://localhost:8080/api/contests/${editingContest.id}`
          : "http://localhost:8080/api/contests",
        {
          method: editingContest ? "PUT" : "POST", // PUT for update
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create contest");

      //  alert(`Contest ${editingContest ? "updated" : "created"} successfully!`);
      toast.success(
        `Contest ${editingContest ? "updated" : "created"} successfully!`
      );

      // 🔒 Safe call (only if passed)
      if (onSuccess) onSuccess(data);

      // Navigate back after successful create/update
      navigate(-1);

      // clear form after successful create
      if (!editingContest) {
        setFormData({
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          status: "upcoming",
        });
        setRounds([]);
      }
    } catch (err) {
      toast.error("Failed to create contest: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (!formData.title) return false;
    if (rounds.length === 0) return false;

    // Check that at least one round has at least one question
    const hasAtLeastOneQuestion = rounds.some((r) => r.questions.length > 0);

    return hasAtLeastOneQuestion;
  };

  return (
    <Layout>
      <div className="create-contest-form">
        <div className="container-fluid py-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">
                {editingContest ? "Edit Contest" : "Create New Contest"}
              </h2>

              <p className="text-muted mb-0">
                Configure a multi-round hiring event (quiz + coding)
              </p>
            </div>

            <button
              className="btn btn-outline-secondary d-flex align-items-center flex-shrink-0"
              // onClick={onCancel}
              type="button"
              onClick={handleCancel}
            >
              <ArrowLeft size={18} className="me-2" />
              Back
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-8">
                {/* Basic Info */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white">
                    <h5 className="card-title mb-0">Basic Information</h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Contest Title *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Description *</label>
                        <textarea
                          className="form-control"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows="3"
                          required
                        />
                      </div>

                      {/* START DATE */}
                      <div className="col-md-6">
                        <label className="form-label">
                          Start Date & Time *
                        </label>
                        <div className="input-group">
                          <input
                            type="datetime-local"
                            className="form-control"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            min={getMinDateTime()}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => {
                              if (!formData.startDate) {
                                toast.error(
                                  "Please select a Start Date & Time first!"
                                );
                              } else {
                                toast.success("Start Date & Time added ✅");
                              }
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      {/* END DATE */}
                      <div className="col-md-6">
                        <label className="form-label">End Date & Time *</label>
                        <div className="input-group">
                          <input
                            type="datetime-local"
                            className="form-control"
                            name="endDate"
                            value={formData.endDate}
                            onChange={(e) => {
                              const { value } = e.target;

                              // prevent selecting end date before start date
                              if (!formData.startDate) {
                                toast.error(
                                  "Please select Start Date & Time first!"
                                );
                                return;
                              }

                              if (
                                new Date(value) <= new Date(formData.startDate)
                              ) {
                                toast.error(
                                  "End Date & Time must be after Start Date!"
                                );
                                return;
                              }

                              setFormData((prev) => ({
                                ...prev,
                                endDate: value,
                              }));
                            }}
                            min={formData.startDate || getMinDateTime()}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => {
                              if (!formData.endDate) {
                                toast.error(
                                  "Please select End Date & Time first!"
                                );
                              } else if (
                                new Date(formData.endDate) <=
                                new Date(formData.startDate)
                              ) {
                                toast.error(
                                  "End Date must be after Start Date!"
                                );
                              } else {
                                toast.success("End Date & Time added ✅");
                              }
                            }}
                          >
                            Add
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Rounds Section */}
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white">
                    <h5 className="card-title mb-0">
                      Rounds ({rounds.length})
                    </h5>
                  </div>
                  <div className="card-body">
                    {/* Add Round */}
                    <div className="border rounded-3 p-4 mb-4 bg-light">
                      <h6 className="mb-3">Add New Round</h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Round Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="roundName"
                            value={newRound.roundName}
                            onChange={handleRoundChange}
                            placeholder="e.g., Aptitude Round"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Round Type *</label>
                          <select
                            className="form-select"
                            name="type"
                            value={newRound.type}
                            onChange={handleRoundChange}
                          >
                            <option value="quiz">Aptitude / Quiz</option>
                            <option value="coding">Coding</option>
                          </select>
                        </div>

                        <div className="col-md-4">
                          <label className="form-label">
                            Duration (minutes)
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="duration"
                            value={newRound.duration}
                            onChange={handleRoundChange}
                            min="5"
                          />
                        </div>

                        <div className="col-md-4 d-flex align-items-end">
                          <button
                            type="button"
                            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm rounded-3 py-2"
                            onClick={addRound}
                            style={{
                              fontWeight: "500",
                              transition: "all 0.2s ease-in-out",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.boxShadow =
                                "0 0 10px rgba(13,110,253,0.4)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.boxShadow =
                                "0 0 0 rgba(0,0,0,0)")
                            }
                          >
                            <Plus size={18} />
                            Add Round
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Existing Rounds */}
                    {rounds.map((round, index) => (
                      <div key={index} className="border rounded-3 p-3 mb-3">
                        <div className="d-flex justify-content-between align-items-center  rounded p-2 mb-2 ">
                          {/* Left Section - Round Info */}
                          <div>
                            <h6 className="mb-1">
                              {index + 1}. {round.roundName}{" "}
                              <span className="badge bg-secondary ms-2">
                                {round.type}
                              </span>
                            </h6>
                            <small className="text-muted">
                              Duration: {round.duration} min |{" "}
                              {round.type === "quiz"
                                ? `${round.questions.length} questions`
                                : `Coding Problems: ${round.questions.length}`}
                            </small>
                          </div>

                          {/* Right Section - Buttons */}
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditRound(index)}
                              title="Edit Round"
                            >
                              <Edit2 size={16} />
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeRound(index)}
                              title="Delete Round"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 ps-2">
                          {round.type === "quiz" ? (
                            <QuizQuestionEditor
                              roundIndex={index}
                              addQuestion={addQuestion}
                              updateQuestion={updateQuestion}
                              removeQuestion={removeQuestion}
                              questions={round.questions}
                            />
                          ) : (
                            <CodingQuestionEditor
                              roundIndex={index}
                              addQuestion={addQuestion}
                              updateQuestion={updateQuestion}
                              removeQuestion={removeQuestion}
                              questions={round.questions}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="card-title mb-0">Contest Settings</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Visibility</label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Published </option>
                      </select>
                      <small className="text-muted d-block mt-2 px-2">
                        Set the contest to “Published” — it’ll go live
                        automatically when the start time comes!
                      </small>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !isFormValid()}
                      >
                        {/* {loading ? "Submitting..." : "Create Contest"} */}
                        {editingContest ? "Update Contest" : "Create Contest"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

/* -------------------------------
  QUIZ QUESTION EDITOR COMPONENT
---------------------------------*/
function QuizQuestionEditor({
  roundIndex,
  addQuestion,
  updateQuestion,
  removeQuestion,
  questions,
}) {
  const [question, setQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correctIndex: 0,
  });
  const [editIndex, setEditIndex] = useState(null);

  // Reset question inputs
  const resetQuestion = () => {
    setQuestion({ text: "", options: ["", "", "", ""], correctIndex: 0 });
    setEditIndex(null);
  };

  // ✅ Effect to reset inputs if question is deleted
  useEffect(() => {
    if (editIndex !== null) {
      if (editIndex >= questions.length || questions[editIndex] === undefined) {
        resetQuestion();
      }
    }
    if (questions.length === 0) {
      resetQuestion();
    }
  }, [questions, editIndex]);

  const handleOptionChange = (i, value) => {
    const newOptions = [...question.options];
    newOptions[i] = value;
    setQuestion({ ...question, options: newOptions });
  };

  const handleSave = () => {
    if (!question.text?.trim() && !question.title?.trim()) return;

    if (editIndex !== null) {
      updateQuestion(roundIndex, editIndex, question);
      setEditIndex(null);
    } else {
      addQuestion(roundIndex, question);
    }

    setQuestion({ text: "", options: ["", "", "", ""], correctIndex: 0 });
  };

  const handleEdit = (i) => {
    const q = questions[i] || {};
    if (!q) return resetQuestion(); // safety check
    setEditIndex(i);
    setQuestion({
      text: q.text || "",
      options: q.options || ["", "", "", ""],
      correctIndex: q.correctIndex || 0,
    });
  };

  return (
    <div className="mt-2">
      <h6>{editIndex !== null ? "Edit Quiz Question" : "Add Quiz Question"}</h6>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter question"
        value={question.text}
        onChange={(e) => setQuestion({ ...question, text: e.target.value })}
      />
      {question.options.map((opt, i) => (
        <div key={i} className="input-group mb-2">
          <input
            type="text"
            className="form-control"
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(i, e.target.value)}
          />
          <div className="input-group-text">
            <input
              type="radio"
              name={`correct-${roundIndex}`}
              checked={question.correctIndex === i}
              onChange={() => setQuestion({ ...question, correctIndex: i })}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-sm btn-success mb-3"
        onClick={handleSave}
      >
        {editIndex !== null ? "Update Question" : "Add Question"}
      </button>

      <ul className="list-group">
        {questions.map((q, i) => (
          <li
            key={i}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{q.text}</span>
            <div>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => handleEdit(i)}
              >
                <Edit2 size={14} />
              </button>

              {/* Hide delete button while editing this question */}
              {editIndex !== i && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeQuestion(roundIndex, i)}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------
  CODING QUESTION EDITOR COMPONENT
---------------------------------*/
function CodingQuestionEditor({
  roundIndex,
  addQuestion,
  updateQuestion,
  removeQuestion,
  questions,
}) {
  const [question, setQuestion] = useState({
    title: "",
    description: "",
    inputFormat: "",
    outputFormat: "",
    sampleInput: "",
    sampleOutput: "",
    sampleInput2: "", // 🆕 second sample input
    sampleOutput2: "", // 🆕 second sample output
  });
  const [editIndex, setEditIndex] = useState(null);

  const resetQuestion = () => {
    setQuestion({
      title: "",
      description: "",
      inputFormat: "",
      outputFormat: "",
      sampleInput: "",
      sampleOutput: "",
      sampleInput2: "", // 🆕 reset
      sampleOutput2: "", // 🆕 reset
    });
    setEditIndex(null);
  };

  // ✅ Reset if edited question is deleted or all questions gone
  useEffect(() => {
    if (editIndex !== null) {
      if (editIndex >= questions.length || questions[editIndex] === undefined) {
        resetQuestion();
      }
    }
    if (questions.length === 0) {
      resetQuestion();
    }
  }, [questions, editIndex]);

  const handleSave = () => {
    // if (!question.title.trim()) return;
    if (!question.text?.trim() && !question.title?.trim()) return;
    if (editIndex !== null) {
      updateQuestion(roundIndex, editIndex, question);
      setEditIndex(null);
    } else {
      addQuestion(roundIndex, question);
    }
    resetQuestion();
  };

  const handleEdit = (i) => {
    const q = questions[i] || {};
    if (!q) return resetQuestion(); // safety check
    setEditIndex(i);
    setQuestion({
      title: q.title || "",
      description: q.description || "",
      inputFormat: q.inputFormat || "",
      outputFormat: q.outputFormat || "",
      sampleInput: q.sampleInput || "",
      sampleOutput: q.sampleOutput || "",
      sampleInput2: q.sampleInput2 || "", // 🆕 load 2nd test case
      sampleOutput2: q.sampleOutput2 || "", // 🆕 load 2nd test case
    });
  };

  return (
    <div className="mt-2">
      <h6>
        {editIndex !== null ? "Edit Coding Question" : "Add Coding Question"}
      </h6>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Problem Title"
        value={question.title}
        onChange={(e) => setQuestion({ ...question, title: e.target.value })}
      />
      <textarea
        className="form-control mb-2"
        placeholder="Problem Description"
        rows="3"
        value={question.description}
        onChange={(e) =>
          setQuestion({ ...question, description: e.target.value })
        }
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Input Format"
        value={question.inputFormat}
        onChange={(e) =>
          setQuestion({ ...question, inputFormat: e.target.value })
        }
      />
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Output Format"
        value={question.outputFormat}
        onChange={(e) =>
          setQuestion({ ...question, outputFormat: e.target.value })
        }
      />


      {/* ✅ Sample Test Case 1 */}
      <textarea
        className="form-control mb-2"
        placeholder="Sample Input 1"
        rows="2"
        value={question.sampleInput}
        onChange={(e) =>
          setQuestion({ ...question, sampleInput: e.target.value })
        }
      />
      <textarea
        className="form-control mb-2"
        placeholder="Sample Output 1"
        rows="2"
        value={question.sampleOutput}
        onChange={(e) =>
          setQuestion({ ...question, sampleOutput: e.target.value })
        }
      />

      {/* ✅ Sample Test Case 2 */}
      <textarea
        className="form-control mb-2"
        placeholder="Sample Input 2"
        rows="2"
        value={question.sampleInput2}
        onChange={(e) =>
          setQuestion({ ...question, sampleInput2: e.target.value })
        }
      />
      <textarea
        className="form-control mb-2"
        placeholder="Sample Output 2"
        rows="2"
        value={question.sampleOutput2}
        onChange={(e) =>
          setQuestion({ ...question, sampleOutput2: e.target.value })
        }
      />

      <button
        type="button"
        className="btn btn-sm btn-success mb-3"
        onClick={handleSave}
      >
        {editIndex !== null ? "Update Problem" : "Add Problem"}
      </button>

      <ul className="list-group">
        {questions.map((q, i) => (
          <li
            key={i}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{q.title}</span>
            <div>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => handleEdit(i)}
              >
                <Edit2 size={14} />
              </button>

              {/* Hide delete button while editing this question */}
              {editIndex !== i && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeQuestion(roundIndex, i)}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
