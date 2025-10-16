import React from "react";
import Layout from "../../Layout/Layout"; // 1. Import the standard Layout
import AskQuestionPage from "./AskQuestionPage";

export default function AskQuestionWrapper() {
  return (
    // 2. Wrap your page content in the Layout component
    <Layout>
      <AskQuestionPage />
    </Layout>
  );
}