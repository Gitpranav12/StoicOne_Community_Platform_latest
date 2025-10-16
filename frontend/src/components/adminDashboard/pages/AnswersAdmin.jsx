import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  ChevronDown,
  ChevronRight,
  Flag,
  Trash2,
  Check,
  X,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import Layout from "../../../Layout/Layout";
import AnswerCell from "../ui/AnswerCell";

import { useCustomAlert } from "../../customAlert/useCustomAlert";
import Dropdown from 'react-bootstrap/Dropdown';
import toast from "react-hot-toast";


export default function AnswersAdmin() {
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [topUsers, setTopUsers] = useState([]);
  const [showAlert, AlertComponent] = useCustomAlert();

  // 1. Fetch all questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/questions"); // adjust base URL if needed
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    // recompute top users whenever answers change
    const counts = {};
    Object.values(answers).forEach((ansArray) => {
      ansArray.forEach((a) => {
        counts[a.author] = (counts[a.author] || 0) + 1;
      });
    });

    const chartData = Object.entries(counts).map(([name, count]) => ({
      name,
      answers: count,
    }));

    // sort top 5
    chartData.sort((a, b) => b.answers - a.answers);
    setTopUsers(chartData.slice(0, 5));
  }, [answers]);

  // useEffect(() => {
  //   const fetchAllAnswers = async () => {
  //     try {
  //       const res = await fetch("http://localhost:8080/api/answers"); // create backend endpoint
  //       const data = await res.json(); // should return all answers
  //       // group by question
  //       const grouped = data.reduce((acc, a) => {
  //         if (!acc[a.question_id]) acc[a.question_id] = [];
  //         acc[a.question_id].push(a);
  //         return acc;
  //       }, {});
  //       setAnswers(grouped);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchAllAnswers();
  // }, []);

  // 2. Toggle expand → fetch answers if not already loaded
  const toggleQuestion = async (questionId) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
      if (!answers[questionId]) {
        try {
          const res = await fetch(
            `http://localhost:8080/api/questions/${questionId}/answers`
          );
          const data = await res.json();
          setAnswers((prev) => ({ ...prev, [questionId]: data }));
        } catch (err) {
          console.error("Error fetching answers:", err);
        }
      }
    }
    setExpandedQuestions(newExpanded);
  };

  const deleteAnswer = (answerId, questionId) => {
    showAlert({
      title: "Delete Answer",
      message: "Are you sure you want to delete this answer?",
      onConfirm: async () => {
        try {
          const res = await fetch(
            `http://localhost:8080/api/questions/answers/${answerId}`,
            { method: "DELETE" }
          );
          const data = await res.json();
          if (data.success) {
            setAnswers((prev) => ({
              ...prev,
              [questionId]: prev[questionId].filter((a) => a.id !== answerId),
            }));
             toast.success("Answer deleted successfully!");
          }
        } catch (err) {
          console.error("Error deleting answer:", err);
          // Optional: show an error alert
          toast.error("Failed to delete answer.");
        }
      },
    });
  };

  const updateApproval = async (answerId, questionId, status) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/admin/answers/${answerId}/approve`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ approved: status }),
        }
      );
      const data = await res.json();

      if (data.success) {
        // ✅ Update state instantly
        setAnswers((prev) => ({
          ...prev,
          [questionId]: prev[questionId].map((a) =>
            a.id === answerId ? { ...a, approved: status } : a
          ),
        }));
        if(status==1){
           toast.success("Answer is Approved.");
        }else{
         toast.success("Answer is Rejected.");
        }
      }
    } catch (err) {
      console.error("Error updating approval:", err);
      toast.error("Failed to Update Answer Status ");
    }
  };

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <>
      <Layout>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl">Answers Management</h1>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {/* Questions + Answers */}
              <div>
                <div className="bg-white rounded-lg border p-2 table-container">
                  {questions.filter((q) => (q.answers || 0) > 0).length ===
                  0 ? (
                    <div className="text-center py-10 my-5">
                      <h5>No answers found.</h5>
                      <p className="text-muted">
                        Answers will be shown here when users respond to
                        questions.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Question / Answer</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Answers</TableHead>{" "}
                          {/* ✅ answers column added -------26 sep */}
                          <TableHead>Votes</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {questions
                          .filter((q) => (q.answers || 0) > 0) // ✅ only show if 1+ answers
                          .map((question, qIndex) => (
                            <React.Fragment key={question.id}>
                              {/* Question row */}
                              <TableRow className="bg-gray-50">
                                <TableCell data-label="">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleQuestion(question.id)}
                                    className="p-0 h-6 w-6 items-start"
                                  >
                                    {expandedQuestions.has(question.id) ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TableCell>

                                <TableCell
                                  className="font-medium"
                                  onClick={() => toggleQuestion(question.id)} //  answers toggle added on question-------26 sep
                                  data-label="Question / Answer"
                                >
                                  <div
                                    className="flex items-start gap-2"
                                    style={{
                                      whiteSpace: "normal",
                                      overflowWrap: "break-word",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Q
                                    </Badge>
                                    <span className="font-medium">
                                      {qIndex + 1}. {question.title}
                                    </span>
                                  </div>
                                </TableCell>

                                <TableCell data-label="Author">
                                  {question.author}
                                </TableCell>
                                <TableCell data-label="Answers">
                                  {" "}
                                  {question.answers || 0}
                                </TableCell>
                                {/* ✅ answers column added -------26 sep */}
                                <TableCell data-label="Votes">
                                  {question.votes || 0}
                                </TableCell>
                                <TableCell data-label="Date">
                                  {new Date(
                                    question.createdAt
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell data-label="Actions"></TableCell>
                              </TableRow>

                              {/* Answers rows */}
                              {expandedQuestions.has(question.id) &&
                                (answers[question.id] || []).map((answer) => (
                                  <TableRow
                                    key={answer.id}
                                    className="bg-blue-50/30"
                                  >
                                    <TableCell data-label=""></TableCell>
                                    <TableCell>
                                        <AnswerCell content={answer.content} approved={answer.approved} />
                                    </TableCell>
                                    <TableCell data-label="Author">
                                      {answer.author}
                                    </TableCell>
                                    <TableCell></TableCell>{" "}
                                    {/* ✅ empty answers column added -------26 sep */}
                                    <TableCell data-label="Votes">
                                      {answer.votes || 0}
                                    </TableCell>
                                    <TableCell data-label="Date">
                                      {new Date(
                                        answer.createdAt
                                      ).toLocaleDateString()}
                                    </TableCell>
                                    {/* <TableCell data-label="Actions">
                                    <div className="flex gap-1">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="p-2 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                        onClick={() =>
                                          deleteAnswer(answer.id, question.id)
                                        }
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </TableCell> */}
                                    <TableCell data-label="Actions">
                                      <div className="flex gap-1">
                                        <Dropdown>
                                          <Dropdown.Toggle
                                            variant="outline-secondary"
                                            size="sm"
                                            id={`dropdown-${answer.id}`}
                                          >
                                            {answer.approved === 1
                                              ? "Approved"
                                              : answer.approved === 0
                                              ? "Rejected"
                                              : "Approve / Reject"}
                                          </Dropdown.Toggle>

                                          <Dropdown.Menu>
                                            <Dropdown.Item
                                              onClick={() =>
                                                updateApproval(
                                                  answer.id,
                                                  question.id,
                                                  1
                                                )
                                              }
                                            >
                                              Approve
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                              onClick={() =>
                                                updateApproval(
                                                  answer.id,
                                                  question.id,
                                                  0
                                                )
                                              }
                                            >
                                              Reject
                                            </Dropdown.Item>
                                          </Dropdown.Menu>
                                        </Dropdown>

                                        {/* 🗑️ Delete */}
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="p-2 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                          onClick={() =>
                                            deleteAnswer(answer.id, question.id)
                                          }
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </React.Fragment>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>

              {/* Sidebar: Top Users by Answers */}
              {expandedQuestions.size > 0 && ( // ✅ show only if at least one is expanded
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Top 5 Users Who Answered This Question
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topUsers} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            type="category"
                            width={80}
                            fontSize={12}
                          />{" "}
                          {/* user names */}
                          <YAxis type="number" /> {/* answers count */}
                          <Tooltip /> {/* Hover details */}
                          {/* <Bar dataKey="answers" fill="#0056D2" /> */}
                          <Bar dataKey="answers">
                            {topUsers.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={colors[index % colors.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
          {AlertComponent} {/* <-- Add this here */}
        </div>
      </Layout>
    </>
  );
}
