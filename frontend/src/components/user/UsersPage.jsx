import React from "react";
import Layout from "../../Layout/Layout"; // 1. Import the standard Layout
 
import UsersContent from "./UsersContent";

export default function UsersPage() {
  return (
    // 2. Wrap the page content and Footer in the Layout component
    <Layout>
      <UsersContent />
 
    </Layout>
  );
}