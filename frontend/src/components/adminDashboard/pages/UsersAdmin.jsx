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
import { Search, Filter } from "lucide-react";
import Layout from "../../../Layout/Layout";
import axios from "axios"; // npm i axios

import { useCustomAlert } from "../../customAlert/useCustomAlert";
import toast from "react-hot-toast";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showAlert, AlertComponent] = useCustomAlert();

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:8080/api/users"); // adjust base URL if needed
  //       setUsers(res.data);
  //     } catch (err) {
  //       console.error("Error fetching users:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchUsers();
  // }, []);

  //..new
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        const res = await axios.get("http://localhost:8080/api/users");
        let allUsers = res.data;

        if (currentUser?.id) {
          // remove logged-in user
          allUsers = allUsers.filter((u) => u.id !== currentUser.id);
        }

        setUsers(allUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on search and department
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment =
      departmentFilter === "all" || user.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const handleDelete = (userId) => {
    showAlert({
      title: "Delete User",
      message: "Are you sure you want to delete this user?",
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:8080/api/users/${userId}`);
          setUsers((prev) => prev.filter((u) => u.id !== userId));
           toast.success("User deleted successfully!");
        } catch (err) {
          console.error("Failed to delete user", err);
          toast.error("Failed to delete user");
        }
      },
    });
  };

  const departments = [
    "all",
    ...Array.from(new Set(users.map((u) => u.department).filter(Boolean))),
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl">Users Management</h1>
        </div>

        {/* <div className="flex gap-4 mb-6 users-filters"> */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 users-filters">
          <div className="relative flex-1">
            <Search className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 mr-2" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-10 my-5">
            <h5>No users available.</h5>
            <p className="text-muted">
              Once users register or are added, they will appear
            </p>
          </div>
        ) : (
          // <div className="bg-white rounded-lg border">
          <div
            className="overflow-x-auto sm:overflow-x-visible"
            style={{
              width: "100%", // full width by default
            }}
          >
            <div
              style={{
                minWidth: "100%", // desktop/table normal behavior
                maxWidth: "31ch", // only on mobile, approximate Layout width
              }}
              className="sm:max-w-full"
            >
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>{index + 1}</TableCell>

                      <TableCell className="flex items-center">
                        <img
                          src={user.avatar || "/images/default-avatar.png"} // 👈 fallback image
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover"
                          onError={(e) => {
                            // 👇 If the image fails to load, use fallback too
                            e.target.src = "/images/default-avatar.png";
                          }}
                        />
                      </TableCell>

                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email || "-"}</TableCell>
                      <TableCell>{user.designation || "-"}</TableCell>
                      <TableCell>{user.department || "-"}</TableCell>
                      <TableCell>
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>{user.score || 0}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {AlertComponent}
      </div>
    </Layout>
  );
}
