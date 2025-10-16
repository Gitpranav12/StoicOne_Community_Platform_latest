import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Plus, Users, MessageSquare, HelpCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import Layout from "../../../Layout/Layout";
import "./styles/CollectivesAdmin.css"; // custom css import
import { useCustomAlert } from "../../customAlert/useCustomAlert";
import toast from "react-hot-toast";

export default function CollectivesAdmin() {
  const [collectives, setCollectives] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newCollectiveName, setNewCollectiveName] = useState("");
  const [newCollectiveDescription, setNewCollectiveDescription] = useState("");
  const [newCollectiveIcon, setNewCollectiveIcon] = useState(null);
  const [newCollectiveTags, setNewCollectiveTags] = useState([]);

  // ✅ tag suggestions from DB
  const [tagSuggestions, setTagSuggestions] = useState([]);

  // --- Edit collective states ---
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCollectiveId, setEditCollectiveId] = useState(null);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [showAlert, AlertComponent] = useCustomAlert();

  useEffect(() => {
    fetchCollectives();
    fetchTagSuggestions();
  }, []);

  const fetchCollectives = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/collectives");
      setCollectives(res.data.data);
    } catch (err) {
      console.error("Error fetching collectives:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTagSuggestions = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/tags/all");
      setTagSuggestions(res.data); // ["javascript","reactjs","mysql",...]
    } catch (err) {
      console.error("Failed to load tag suggestions", err);
    }
  };

  // Add new collective
  const handleAddCollective = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newCollectiveName);
      formData.append("description", newCollectiveDescription);
      formData.append("icon", newCollectiveIcon); // file upload
      formData.append("tags", JSON.stringify(newCollectiveTags));
      formData.append("members", 0);

      await axios.post("http://localhost:8080/api/collectives", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchCollectives(); // refresh list
      setNewCollectiveName("");
      setNewCollectiveDescription("");
      setNewCollectiveIcon(null);
      setNewCollectiveTags([]);

       // ✅ Close dialog after success
    setCreateDialogOpen(false);

       toast.success("Collective Added successfully!");
    } catch (err) {
      console.error("Error adding collective:", err);
       toast.error("Error adding collective");
    }
  };

  // --- Edit handler ---
  const handleEditCollective = (c) => {
    setEditCollectiveId(c.id);
    setNewCollectiveName(c.name);
    setNewCollectiveDescription(c.description);
    setNewCollectiveTags(c.tags || []);
    setEditDialogOpen(true);
  };

  const handleUpdateCollective = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newCollectiveName);
      formData.append("description", newCollectiveDescription);
      formData.append("tags", JSON.stringify(newCollectiveTags));
      if (newCollectiveIcon) formData.append("icon", newCollectiveIcon);

      await axios.put(
        `http://localhost:8080/api/collectives/${editCollectiveId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      fetchCollectives();
      setEditDialogOpen(false);
      setEditCollectiveId(null);
      setNewCollectiveName("");
      setNewCollectiveDescription("");
      setNewCollectiveIcon(null);
      setNewCollectiveTags([]);

       toast.success("Collective Updated successfully!");
    } catch (err) {
      console.error("Error updating collective:", err);
       toast.error("Error updating collective");
    }
  };

  const handleDeleteCollective = (id) => {
    showAlert({
      title: "Delete Collective",
      message: "Are you sure you want to delete this collective?",
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:8080/api/collectives/${id}`);
          fetchCollectives();
           toast.success("Collective Deleted successfully!");
        } catch (err) {
          console.error("Error deleting collective:", err);
            toast.error("Failed to delete collective.");
         
        }
      },
    });
  };

  const toggleTag = (tag) => {
    if (newCollectiveTags.includes(tag)) {
      setNewCollectiveTags(newCollectiveTags.filter((t) => t !== tag));
    } else {
      setNewCollectiveTags([...newCollectiveTags, tag]);
    }
  };

  const activityData = collectives.map((c) => ({
    name: c.name.split(" ")[0],
    questions: c.questionsCount || 0,
    answers: c.answersCount || 0,
  }));

  return (
    <Layout>
      <div className="p-6">
        {/* <div className="flex justify-between items-center mb-6"> */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3 ">
          <h1 className="text-2xl">Collectives Management</h1>
          {/* --- CREATE COLLECTIVE DIALOG --- */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  // Reset form before opening
                  setEditCollectiveId(null);
                  setNewCollectiveName("");
                  setNewCollectiveDescription("");
                  setNewCollectiveIcon(null);
                  setNewCollectiveTags([]);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Collective
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collective</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={newCollectiveName}
                    onChange={(e) => setNewCollectiveName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Icon (Upload)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewCollectiveIcon(e.target.files[0])}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newCollectiveDescription}
                    onChange={(e) =>
                      setNewCollectiveDescription(e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Select Tags</Label>
                  {tagSuggestions.length === 0 ? (
                    <p className="text-gray-500 text-sm mt-2">No tags found</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tagSuggestions.map((tag) => (
                        <Badge
                          key={tag}
                          variant={
                            newCollectiveTags.includes(tag)
                              ? "default"
                              : "secondary"
                          }
                          className="cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <Button onClick={handleAddCollective} className="w-full">
                  Create Collective
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* --- EDIT COLLECTIVE DIALOG --- */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Collective</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={newCollectiveName}
                    onChange={(e) => setNewCollectiveName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Icon (Upload)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewCollectiveIcon(e.target.files[0])}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newCollectiveDescription}
                    onChange={(e) =>
                      setNewCollectiveDescription(e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Select Tags</Label>
                   {tagSuggestions.length === 0 ? (
                    <p className="text-gray-500 text-sm mt-2">No tags found</p>
                  ) : (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tagSuggestions.map((tag) => (
                      <Badge
                        key={tag}
                        variant={
                          newCollectiveTags.includes(tag)
                            ? "default"
                            : "secondary"
                        }
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  )}
                </div>
                <Button onClick={handleUpdateCollective} className="w-full">
                  Update Collective
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* ✅ Handle loading / no data states */}
        {loading ? (
          <p>Loading...</p>
        ) : collectives.length === 0 ? (
          <div className="text-center py-10 my-5">
            <h5>No collectives created yet.</h5>
            <p className="text-muted">
           Start by creating a new collective to group related topics.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {collectives.map((c) => (
                <Card key={c.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <img
                        src={c.icon}
                        alt={c.name}
                        className="w-8 h-8 rounded"
                      />
                      <div>
                        <CardTitle className="text-lg">{c.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Users className="h-3 w-3 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {c.members} members
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {c.description}
                    </p>

                    {/* ✅ Questions + Answers counts */}
                    <div className="grid grid-cols-2 gap-4 mb-4 qa-stats">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                          <HelpCircle className="h-3 w-3" />
                          <span className="text-xs">Questions</span>
                        </div>
                        <div className="font-medium">{c.questionsCount}</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                          <MessageSquare className="h-3 w-3" />
                          <span className="text-xs">Answers</span>
                        </div>
                        <div className="font-medium">{c.answersCount}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Linked Tags:</Label>
                      <div className="flex flex-wrap gap-1 collective-tags">
                        {c.tags?.map((tag) => (
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

                    <div className="mt-4 pt-3 border-t flex gap-2 ">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditCollective(c)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDeleteCollective(c.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Collective Activity</CardTitle>
              </CardHeader>

              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <Legend />
                    <YAxis />
                    <Bar dataKey="questions" fill="#0056D2" />
                    <Bar dataKey="answers" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {AlertComponent}
      </div>
    </Layout>
  );
}
