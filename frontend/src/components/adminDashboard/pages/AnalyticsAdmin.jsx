import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  HelpCircle,
  MessageSquare,
  TrendingUp,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  Legend,
} from "recharts";
import Layout from "../../../Layout/Layout";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "./styles/AnalyticsAdmin.css"; // custom css import

export default function AnalyticsAdmin() {
  const [statsCards, setStatsCards] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const [topContributors, setTopContributors] = useState([]);
  const [monthlyActivity, setMonthlyActivity] = useState([]);

  // inside your component
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return "N/A";
    let change = ((current - previous) / previous) * 100;
    if (change > 100) change = 100;
    if (change < -100) change = -100;
    return (change > 0 ? "+" : "") + change.toFixed(1) + "%";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get(
          "http://localhost:8080/api/admin/stats"
        );

        const changeTotalUsers = calculateChange(
          statsRes.data.totalUsers,
          statsRes.data.prevMonthUsers
        );

        const changeQuestions = calculateChange(
          statsRes.data.totalQuestions,
          statsRes.data.prevMonthQuestions
        );

        const changeAnswers = calculateChange(
          statsRes.data.totalAnswers,
          statsRes.data.prevMonthAnswers
        );

        setStatsCards([
          {
            title: "Total Users",
            value: statsRes.data.totalUsers,
            change: changeTotalUsers,
            changeType: changeTotalUsers.startsWith("-")
              ? "negative"
              : "positive",
            icon: Users,
            description: "Active community members",
          },
          {
            title: "New Users (30d)",
            value: statsRes.data.newUsers,
            change: calculateChange(
              statsRes.data.newUsers,
              statsRes.data.prevMonthUsers
            ),
            changeType:
              statsRes.data.newUsers - statsRes.data.prevMonthUsers < 0
                ? "negative"
                : "positive",
            icon: TrendingUp,
            description: "New registrations this month",
          },
          {
            title: "Total Questions",
            value: statsRes.data.totalQuestions,
            change: changeQuestions,
            changeType: changeQuestions.startsWith("-")
              ? "negative"
              : "positive",
            icon: HelpCircle,
            description: "Questions asked to date",
          },
          {
            title: "Total Answers",
            value: statsRes.data.totalAnswers,
            change: changeAnswers,
            changeType: changeAnswers.startsWith("-") ? "negative" : "positive",
            icon: MessageSquare,
            description: "Answers provided by community",
          },
        ]);

        const tagsRes = await axios.get(
          "http://localhost:8080/api/admin/trending-tags"
        );
        setTrendingTags(tagsRes.data);

        const contributorsRes = await axios.get(
          "http://localhost:8080/api/admin/top-contributors"
        );
        setTopContributors(contributorsRes.data);

        const monthlyRes = await axios.get(
          "http://localhost:8080/api/admin/monthly-activity"
        );
        setMonthlyActivity(monthlyRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const exportData = (format) => {
    const stats = statsCards.map((card) => ({
      Title: card.title,
      Value: card.value,
      Change: card.change,
      Description: card.description,
    }));

    const contributors = topContributors.map((user) => ({
      Name: user.name,
      Department: user.department,
      Contributions: user.contributions,
    }));

    const monthly = monthlyActivity.map((item) => ({
      Month: item.month,
      Questions: item.questions,
      Answers: item.answers,
    }));

    switch (format) {
      case "csv":
      case "excel":
        const wb = XLSX.utils.book_new();
        const ws1 = XLSX.utils.json_to_sheet(stats);
        XLSX.utils.book_append_sheet(wb, ws1, "Stats");
        const ws2 = XLSX.utils.json_to_sheet(contributors);
        XLSX.utils.book_append_sheet(wb, ws2, "Top Contributors");
        const ws3 = XLSX.utils.json_to_sheet(monthly);
        XLSX.utils.book_append_sheet(wb, ws3, "Monthly Activity");
        XLSX.writeFile(
          wb,
          format === "csv" ? "dashboard.csv" : "dashboard.xlsx"
        );
        break;

      case "pdf":
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Dashboard Stats", 14, 20);
        autoTable(doc, {
          startY: 25,
          head: [["Title", "Value", "Change", "Description"]],
          body: stats.map((c) => [c.Title, c.Value, c.Change, c.Description]),
        });
        autoTable(doc, {
          startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 50,
          head: [["Name", "Department", "Contributions"]],
          body: contributors.map((c) => [
            c.Name,
            c.Department,
            c.Contributions,
          ]),
        });
        autoTable(doc, {
          startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 100,
          head: [["Month", "Questions", "Answers"]],
          body: monthly.map((c) => [c.Month, c.Questions, c.Answers]),
        });
        doc.save("dashboard.pdf");
        break;

      default:
        console.error("Unknown format:", format);
    }
  };

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <Layout>
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>Analytics Dashboard</h1>
          <div className="export-buttons">
            <button onClick={() => exportData("csv")} className="btna">
              <Download size={16} /> CSV
            </button>
            <button onClick={() => exportData("excel")} className="btna">
              <Download size={16} /> Excel
            </button>
            <button onClick={() => exportData("pdf")} className="btna">
              <Download size={16} /> PDF
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="card">
                <div className="card-content">
                  <div className="card-left">
                    <p className="card-title">{stat.title}</p>
                    <p className="card-value">{stat.value}</p>
                    <div className="card-change">
                      <span
                        className={`badge ${
                          stat.changeType === "positive"
                            ? "badge-green"
                            : "badge-red"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="card-desc">{stat.description}</span>
                    </div>
                  </div>
                  <div className="card-icon">
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="charts-grid">
          {trendingTags.length > 0 && (
            <div className="card">
              <h2>Top 5 Trending Tags</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trendingTags}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    label={({ name, count }) => `${name}: ${count}`}
                  >
                    {trendingTags.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Contributors Bar Chart */}
          {topContributors.length > 0 && (
            <div className="card">
              <h2>Top 5 Contributors</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topContributors}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="id" hide />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name, props) => [value, "Contributions"]}
                    labelFormatter={(label) => {
                      // Find contributor name instead of id
                      const contributor = topContributors.find(
                        (u) => u.id === label
                      );
                      return contributor ? contributor.name : "";
                    }}
                  />
                  <Bar dataKey="contributions">
                    {topContributors.map((entry, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Custom Legend */}
              <div className="contributors-legend">
                {topContributors.map((entry, index) => (
                  <div key={entry.id} className="legend-item">
                    <div
                      className="legend-color"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span>{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Monthly Activity */}
        {/* Monthly Activity Trend */}
        {monthlyActivity.length > 0 && (
          <div className="card">
            <h2>Monthly Activity Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                // data={monthlyActivity}
                data={
                  windowWidth < 768
                    ? monthlyActivity.slice(-5) // last 5 months on mobile
                    : monthlyActivity // all months on web
                }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(monthStr) => {
                    const monthNum = parseInt(monthStr.split("-")[1], 10) - 1;
                    const monthNames = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ];
                    return monthNames[monthNum];
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="questions"
                  stroke="#0056D2"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="answers"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Contributors Table */}
        {/* Top Contributors Details */}
        {topContributors.length > 0 && (
          <div className="card">
            <h2>Top 5 Contributors Details</h2>
            <div className="contrib-list">
              {topContributors.map((contributor, index) => (
                <div key={index} className="contrib-item">
                  <div className="contrib-left">
                    <div className="contrib-rank">{index + 1}</div>
                    <div>
                      <p className="contrib-name">{contributor.name}</p>
                      <p className="contrib-dept">{contributor.department}</p>
                    </div>
                  </div>
                  <div className="contrib-right">
                    <p className="contrib-score">{contributor.contributions}</p>
                    <p className="contrib-label">contributions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {trendingTags.length === 0 &&
          topContributors.length === 0 &&
          monthlyActivity.length === 0 && (
            <div className="text-center my-5">
              <h5>No analytics data available.</h5>
              <p className="text-muted">
                Charts and insights will appear once users start engaging with
                the platform.
              </p>
            </div>
          )}
      </div>
    </Layout>
  );
}
