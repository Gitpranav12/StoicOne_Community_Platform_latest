import React, { useEffect, useState } from 'react';
import ContestHeader from './ContestHeader';
import Rankings from './Rankings';
import { fetchResult } from './apiData';
import { Spinner } from 'react-bootstrap';
import Layout from "../../../Layout/Layout";

import * as XLSX from "xlsx";



export default function ResultPage({ contestId, type }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contestId || !type) return;
    setLoading(true);
    fetchResult(contestId, type).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [contestId, type]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!data) return <div className="text-center mt-5 text-muted">No results found for this contest and type.</div>;

  const { meta, leaders } = data;

  const handleExportResults = () => {
  if (!leaders || leaders.length === 0) return;

  // Prepare data rows
  const rows = leaders.map((item, index) => ({
    Rank: index + 1,
    Name: item.name,
    Email: item.email,
    Score: item.score,
    Qualification: item.score >= 70 ? "Pass" : "Fail", // ✅ adjust as per your passing logic
  }));

  // Create worksheet & workbook
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

  // Create Excel file and trigger download
  XLSX.writeFile(workbook, `${meta.title}_Results.xlsx`);
};


  return (
    <Layout>
      <>
        <div className="py-4">
          <ContestHeader title={meta.title} stats={meta.stats} type={type} onBack={() => window.history.back() }
          onExport={handleExportResults}
          />
          <Rankings leaders={leaders} type={type} />
        </div>
      </>
    </Layout>
  );
}
