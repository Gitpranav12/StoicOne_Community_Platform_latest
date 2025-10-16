import { useEffect, useState } from "react";
import AdminEvents from "./AdminEvents";
import Layout from "../../Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";

export default function EventsAdminPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all contests from backend
  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/contests"); // new endpoint to get all contests
      const data = response.data;

      // Map data to match frontend structure
      const formattedContests = data.map((contest) => ({
        id: contest.id,
        title: contest.title,
        description: contest.description,
        startDate: contest.start_date,
        endDate: contest.end_date,
        status: contest.status,
        rounds: contest.rounds,
        participants: contest.participants || 0, // default to 0 if not present
      }));

      setContests(formattedContests);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contests:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  // Create new contest
  const handleCreateContest = async (newContest) => {
    try {
      const response = await axios.post("http://localhost:8080/api/contests", newContest);
      if (response.data.success) {
        // Fetch latest contests again
        fetchContests();
      }
    } catch (error) {
      console.error("Error creating contest:", error);
    }
  };

  // Update contest
  const handleUpdateContest = async (id, updates) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/contests/${id}`, updates);
      if (response.data.success) {
        fetchContests();
      }
    } catch (error) {
      console.error("Error updating contest:", error);
    }
  };

  // Delete contest
  const handleDeleteContest = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/contests/${id}`);
    if (response.data.success) {
      setContests(contests.filter((contest) => contest.id !== id));

       toast.success("Contest deleted successfully!");
    }
  } catch (error) {
    console.error("Error deleting contest:", error);
    toast.error("Error deleting contest!");
  }
};


  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <AdminEvents
          contests={contests}
          loading={loading}
          onCreateContest={handleCreateContest}
          onUpdateContest={handleUpdateContest}
          onDeleteContest={handleDeleteContest}
        />
      </div>
    </Layout>
  );
}
