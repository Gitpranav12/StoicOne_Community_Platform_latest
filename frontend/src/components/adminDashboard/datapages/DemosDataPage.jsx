import React, { useState } from "react";
import * as XLSX from "xlsx";
import { FileSpreadsheet } from "lucide-react";

const DemosDataPage = () => {
  const [demos] = useState([
    {
      id: 1,
      fullName: "Raj Thakre",
      workEmail: "raj@example.com",
      companyName: "Tech Innovations",
      phoneNumber: "+91 9876543210",
      expert: "Sarah Mitchell",
      date: "2025-11-05",
      time: "10:00 AM",
      message: "Interested in CRM demo",
    },
    {
      id: 2,
      fullName: "John Doe",
      workEmail: "john@company.com",
      companyName: "CodeLabs",
      phoneNumber: "+1 555-678-2345",
      expert: "Michael Chen",
      date: "2025-11-06",
      time: "03:00 PM",
      message: "Looking for business suite overview",
    },
    {
      id: 3,
      fullName: "Sarah Johnson",
      workEmail: "sarah@techcorp.com",
      companyName: "TechCorp Solutions",
      phoneNumber: "+44 20-7946-0958",
      expert: "David Wilson",
      date: "2025-11-07",
      time: "02:00 PM",
      message: "Need product demonstration",
    },
  ]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(demos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Demos");
    XLSX.writeFile(workbook, "demos_data.xlsx");
  };

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h2 className="mb-3 mb-md-0">Demo Schedules</h2>
            <button
              className="btn btn-success d-flex align-items-center gap-2"
              onClick={exportToExcel}
            >
              <FileSpreadsheet size={18} />
              Export to Excel
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Full Name</th>
                      <th>Work Email</th>
                      <th>Company</th>
                      <th>Phone Number</th>
                      <th>Expert</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demos.map((demo, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td> {/* show 1-based index */}
                        <td
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {demo.fullName}
                        </td>
                        <td>{demo.workEmail}</td>
                        <td>{demo.companyName}</td>
                        <td
                          style={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          {demo.phoneNumber}
                        </td>
                        <td>
                          <span className="badge bg-primary">
                            {demo.expert}
                          </span>
                        </td>
                        <td>{demo.date}</td>
                        <td>{demo.time}</td>
                        <td>
                          <span
                            className="d-inline-block text-truncate"
                            style={{ maxWidth: "200px" }}
                            title={demo.message}
                          >
                            {demo.message}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-3 text-muted">
            <small>Total Demos: {demos.length}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemosDataPage;
