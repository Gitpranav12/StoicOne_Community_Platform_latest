import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import Layout from "../../../Layout/Layout";
import toast from "react-hot-toast";

import { useCustomAlert } from "../../customAlert/useCustomAlert";

export default function TagsAdmin() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState("");
  const [newTagDescription, setNewTagDescription] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false); // ✅ control Add Tag dialog
  const [editTag, setEditTag] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [showAlert, AlertComponent] = useCustomAlert();

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:8080/api/tags?sort=popular&limit=50"
      );
      const json = await res.json();
      setTags(json.data);
    } catch (err) {
      console.error("Error fetching tags:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTagName,
          description: newTagDescription,
        }),
      });
      if (res.ok) {
        await fetchTags(); // refresh after adding
        setNewTagName("");
        setNewTagDescription("");
        setIsAddDialogOpen(false); // ✅ Close dialog after success
        toast.success("Tag Added successfully!");
      }
    } catch (err) {
      console.error("Error adding tag:", err);
      toast.error("Failed to Add tag.");
    }
  };

  const handleEditTag = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/tags/${editTag.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDescription }),
      });

      if (res.ok) {
        await fetchTags();
        setEditTag(null); // close modal
        toast.success("Tag Updated successfully!");
      }
    } catch (err) {
      console.error("Error updating tag:", err);
      toast.error("Failed to updating tag.");
    }
  };

  const handleDeleteTag = (id) => {
    showAlert({
      title: "Delete Tag",
      message: "Are you sure you want to delete this tag?",
      onConfirm: async () => {
        try {
          const res = await fetch(`http://localhost:8080/api/tags/${id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            await fetchTags();
              toast.success("Tag deleted successfully!");
          }
        } catch (err) {
          console.error("Error deleting tag:", err);
          // Optional: show an error alert
         toast.error("Failed to delete tag.");
        }
      },
    });
  };

  const topTags = tags.slice(0, 6);

  return (
    <Layout>
      <div className="p-6">
        {/* <div className="tags-header flex justify-between items-center mb-6"> */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
          <h1 className="text-2xl">Tags Management</h1>
         
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Tag
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Tag</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tagName">Tag Name</Label>
                  <Input
                    id="tagName"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Enter tag name"
                  />
                </div>
                <div>
                  <Label htmlFor="tagDescription">Description</Label>
                  <Input
                    id="tagDescription"
                    value={newTagDescription}
                    onChange={(e) => setNewTagDescription(e.target.value)}
                    placeholder="Enter tag description"
                  />
                </div>
                <Button onClick={handleAddTag} className="w-full">
                  Create Tag
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {editTag && (
            <Dialog open={true} onOpenChange={() => setEditTag(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Tag</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="editName">Tag Name</Label>
                    <Input
                      id="editName"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editDescription">Description</Label>
                    <Input
                      id="editDescription"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleEditTag} className="w-full">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        {/* When no data */}
        {!loading && tags.length === 0 ? (
          <div className="text-center py-10 my-5">
            <h5>No tags added yet.</h5>
            <p className="text-muted">
              Create new tags to help organize questions and answers.
            </p>
          </div>
        ) : (
          <>
            {/* Popular Tags */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Top 6 Popular Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {topTags.map((tag) => (
                          <div
                            key={tag.id}
                            className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge>{tag.name}</Badge>
                          
                            </div>
                            <p className="text-xs text-gray-500">
                              {tag.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Tag Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Total Tags
                        </span>
                        <span className="font-medium">{tags.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Most Popular
                        </span>
                        {tags[0] && <Badge>{tags[0].name}</Badge>}
                      </div>
                  
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Tags Table */}
            {/* <div className="bg-white rounded-lg border">
              {loading ? (
                <p className="p-4">Loading tags...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tags.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell data-label="Tag Name">
                          <Badge>{tag.name}</Badge>
                        </TableCell>
                        <TableCell
                          data-label="Description"
                          className="text-gray-600"
                        >
                          {tag.description}
                        </TableCell>
                       
                        <TableCell data-label="Actions">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                             
                              className="p-2"
                              onClick={() => {
                                setEditTag(tag);
                                setEditName(tag.name);
                                setEditDescription(tag.description);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                              onClick={() => handleDeleteTag(tag.id)}
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
            </div> */}

            {/* Tags Table */}
            <div
              className="overflow-x-auto sm:overflow-x-visible"
              style={{ width: "100%" }} // full width by default
            >
              <div
                style={{
                  minWidth: "100%", // desktop/table normal behavior
                  maxWidth: "31ch", // mobile width, matches Layout/footer
                }}
                className="sm:max-w-full"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tags.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell data-label="Tag Name">
                          <Badge>{tag.name}</Badge>
                        </TableCell>
                        <TableCell
                          data-label="Description"
                          className="text-gray-600"
                        >
                          {tag.description}
                        </TableCell>
                        <TableCell data-label="Actions">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="p-2"
                              onClick={() => {
                                setEditTag(tag);
                                setEditName(tag.name);
                                setEditDescription(tag.description);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                              onClick={() => handleDeleteTag(tag.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}
        {AlertComponent} {/* <-- Add this */}
      </div>
    </Layout>
  );
}
