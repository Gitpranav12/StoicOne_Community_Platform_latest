import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Search, Filter, Eye, Flag, Trash2 } from "lucide-react";
import Layout from "../../../Layout/Layout";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { useCustomAlert } from "../../customAlert/useCustomAlert";
import toast from "react-hot-toast";

export default function QuestionsAdmin() {
  const [questions, setQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  const [flagReason, setFlagReason] = useState("");
  const [flaggingQuestion, setFlaggingQuestion] = useState(null);

  const currentUserData = JSON.parse(localStorage.getItem("currentUser"));
  const currentUser = currentUserData.name;

  const [showAlert, AlertComponent] = useCustomAlert();

  // 🔹 replace with logged-in user id

  // Fetch questions and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qRes, tRes] = await Promise.all([
          axios.get("http://localhost:8080/api/questions"),
          axios.get("http://localhost:8080/api/tags/all"),
        ]);
        setQuestions(qRes.data);
        setTags(tRes.data);
      } catch (err) {
        console.error("Error fetching questions or tags:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter questions by search & tag
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.author && q.author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag =
      tagFilter === "all" ||
      (q.tags &&
        q.tags.some((t) => t.toLowerCase() === tagFilter.toLowerCase()));
    return matchesSearch && matchesTag;
  });

  const handleDelete = (id) => {
    showAlert({
      title: "Delete Question",
      message: "Are you sure you want to delete this question?",
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:8080/api/questions/${id}`);
          setQuestions(questions.filter((q) => q.id !== id));
          if (selectedQuestion?.id === id) setSelectedQuestion(null);

 // ✅ Show success toast
      toast.success("Question deleted successfully!");

        } catch (err) {
          console.error("Failed to delete question:", err);
         toast.error("Failed to delete question");
        }
      },
    });
  };

  const handleFlagQuestion = async () => {
    // if (!flagReason.trim()) return alert("Please enter a reason");
    if (!flagReason.trim()) {
      // Close flagging dialog first
      setFlaggingQuestion(null);
      showAlert({
        title: "Validation Error",
        message: "Please enter a reason for flagging.",
        onConfirm: () => {},
      });
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/questions/${flaggingQuestion.id}/flag`,
        {
          flagged_by: currentUser,
          reason: flagReason,
        }
      );

      // Update frontend state
      const updatedQuestions = questions.map((item) =>
        item.id === flaggingQuestion.id
          ? { ...item, flagged: 1, flag_reason: flagReason }
          : item
      );
      setQuestions(updatedQuestions);

      if (selectedQuestion?.id === flaggingQuestion.id) {
        setSelectedQuestion((prev) => ({
          ...prev,
          flagged: 1,
          flag_reason: flagReason,
        }));
      }

      setFlagReason("");
      setFlaggingQuestion(null); // close dialog
      // alert("Question flagged successfully");
        toast.success("Question flagged successfully");
    } catch (err) {
      console.error(err);
        toast.error("Failed to flag question");
      setFlaggingQuestion(null); // close dialog in case of error
    }
  };

  const handleUnflagQuestion = (question) => {
    showAlert({
      title: "Unflag Question",
      message: "Are you sure you want to unflag this question?",
      onConfirm: async () => {
        try {
          await axios.post(
            `http://localhost:8080/api/questions/${question.id}/unflag`,
            { unflagged_by: currentUser }
          );

          const updatedQuestions = questions.map((q) =>
            q.id === question.id ? { ...q, flagged: 0, flag_reason: null } : q
          );
          setQuestions(updatedQuestions);

          if (selectedQuestion?.id === question.id) {
            setSelectedQuestion((prev) => ({
              ...prev,
              flagged: 0,
              flag_reason: null,
            }));
          }

          // showAlert({
          //   title: "Success",
          //   message: "Question unflagged successfully",
          //   onConfirm: () => {},
          // });
           toast.success("Question unflagged successfully");
        } catch (err) {
          console.error(err);
           toast.error("Failed to unflag question");
        }
      },
    });
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl">Questions Management</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6 questions-filters">
          <div className="relative flex-1">
            <Search className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p>Loading questions...</p>
        ) : (
          <div className="grid grid-cols-1  gap-6">
            <div>
              <div className="bg-white rounded-lg border">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-10 my-5">
                    <h5>No questions available.</h5>
                    <p className="text-muted">
                      Once users start posting questions, they’ll appear here.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Votes</TableHead>
                        <TableHead>Answers</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuestions.map((q, qIndex) => (
                        <TableRow
                          key={q.id}
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <TableCell
                            onClick={() => setSelectedQuestion(q)}
                            data-label="Title"
                            style={{
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              wordBreak: "break-word",
                            }}
                          >
                            {" "}
                            {/* onclick added ---------26 sep */}
                            <div>
                              <div className="font-medium">{qIndex + 1}. {q.title}</div>
                              <div className="flex gap-1 mt-1">
                                {q.tags?.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs text-white"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell data-label="Author">{q.author}</TableCell>
                          <TableCell data-label="Votes">{q.votes}</TableCell>
                          <TableCell data-label="Answers">
                            {q.answers}
                          </TableCell>
                          <TableCell data-label="Views">{q.views}</TableCell>
                          <TableCell data-label="Created">
                            {new Date(q.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell data-label="Actions">
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedQuestion(q)}
                                className="p-2"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>

                              {/* <Button
                              variant="outline"
                              size="sm"
                              className="p-2 bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                            >
                              <Flag className="h-3 w-3" />
                            </Button> */}

                              {q.flagged === 1 ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="p-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                  onClick={() => handleUnflagQuestion(q)}
                                >
                                  Unflag
                                </Button>
                              ) : (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="p-2 bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
                                      onClick={() => setFlaggingQuestion(q)}
                                    >
                                      <Flag className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>

                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Flag Question</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="flagReason">
                                          Reason
                                        </Label>
                                        <Input
                                          id="flagReason"
                                          value={flagReason}
                                          onChange={(e) =>
                                            setFlagReason(e.target.value)
                                          }
                                          placeholder="Enter reason for flagging"
                                        />
                                      </div>
                                      {!flagReason.trim() && (
                                        <p className="text-red-600 text-sm mt-1">
                                          Please enter a reason for flagging.
                                        </p>
                                      )}

                                      <Button
                                        className="w-full"
                                        onClick={handleFlagQuestion}
                                        disabled={!flagReason.trim()}
                                      >
                                        Submit Flag
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(q.id)}
                                className="p-2 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>

            <div>
              {selectedQuestion && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Question Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedQuestion.flagged === 1 && (
                      <Badge variant="destructive" className="mb-2">
                        Flagged:{" "}
                        {selectedQuestion.flag_reason || "No reason provided"}
                      </Badge>
                    )}
                    {/* Question Title */}
                    <h3 className="font-medium mb-2">
                      {" "}
                      {selectedQuestion.title}{" "}
                    </h3>

                    {/* Question Body */}
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedQuestion.bodyText}
                    </p>
                    <div className="text-sm text-gray-600 mb-3">
                      by {selectedQuestion.author} •{" "}
                      {new Date(
                        selectedQuestion.createdAt
                      ).toLocaleDateString()}
                    </div>
                    <div className="flex gap-1 mb-3">
                      {selectedQuestion.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs text-white"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 text-sm justify-start">
                      <div className="w-24 text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">
                          {selectedQuestion.votes}
                        </div>
                        <div className="text-gray-600">Votes</div>
                      </div>
                      <div className="w-24 text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">
                          {selectedQuestion.answers}
                        </div>
                        <div className="text-gray-600">Answers</div>
                      </div>
                      <div className="w-24 text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium">
                          {selectedQuestion.views}
                        </div>
                        <div className="text-gray-600">Views</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {AlertComponent}
      </div>
    </Layout>
  );
}
