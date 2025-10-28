import React, { useState } from "react";
import * as XLSX from "xlsx";
import { FileSpreadsheet } from "lucide-react";

const ContactsDataPage = () => {
  const [contactData] = useState([
    {
      id: 1,
      salutation: "Mr",
      first_name: "Raj",
      last_name: "Thakre",
      phone_prefix: "+91",
      phone: "9876543210",
      email: "raj@example.com",
      country: "India",
      message: "Interested in demo",
      legal_consent: "Yes",
    },
    {
      id: 2,
      salutation: "Ms",
      first_name: "Priya",
      last_name: "Patil",
      phone_prefix: "+1",
      phone: "7654321098",
      email: "priya@example.com",
      country: "USA",
      message: "Need more details",
      legal_consent: "Yes",
    },
    {
      id: 3,
      salutation: "Mr",
      first_name: "Amit",
      last_name: "Sharma",
      phone_prefix: "+91",
      phone: "8765432109",
      email: "amit@example.com",
      country: "India",
      message: "Looking for pricing information",
      legal_consent: "Yes",
    },
  ]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(contactData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
    XLSX.writeFile(workbook, "contacts_data.xlsx");
  };

  return (
    <div className="container-fluid py-4">
      
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h2 className="mb-3 mb-md-0">Contact Submissions</h2>
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
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Country</th>
                      <th>Message</th>
                      <th>Consent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactData.map((contact , index ) => (
                      <tr key={index}>
                         <td>{index + 1}</td> {/* show 1-based index */}
                        <td
                         style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                        >
                    
                          {contact.salutation} {contact.first_name}{" "}
                          {contact.last_name}
                        </td>

                        <td
                         style={{
                        whiteSpace: "nowrap",
                      }}
                        >
                          {contact.phone_prefix} {contact.phone}
                        </td>
                        <td>{contact.email}</td>
                        <td>{contact.country}</td>
                        <td>
                          <span
                            className="d-inline-block text-truncate"
                            style={{ maxWidth: "200px" }}
                            title={contact.message}
                          >
                            {contact.message}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success">
                            {contact.legal_consent}
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
            <small>Total Contacts: {contactData.length}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsDataPage;
