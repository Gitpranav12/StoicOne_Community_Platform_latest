import React, { useEffect, useState } from 'react';
import ContestHeader from './ContestHeader';
import Rankings from './Rankings';
import { fetchResult } from './apiData';
import { Spinner } from 'react-bootstrap';
import Layout from "../../../Layout/Layout";


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

  return (
    <Layout>
      <>
        <div className="py-4">
          <ContestHeader title={meta.title} stats={meta.stats} type={type} onBack={() => window.history.back()} />
          <Rankings leaders={leaders} type={type} />
        </div>
      </>
    </Layout>
  );
}
