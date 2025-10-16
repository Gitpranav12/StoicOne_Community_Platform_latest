import React from "react";
import Layout from "../../Layout/Layout"; // 1. Import the standard Layout
import QuestionDetailsPage from "./QuestionDetailsPage";

export default function QuestionDetailsWrapper() {
  return (
    // 2. Wrap your page content in the Layout component
    <Layout>
      <QuestionDetailsPage />
    </Layout>
  );
}