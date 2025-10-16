import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css"; // import bootstrap icons
import "./Article.css";

function SearchBar({ onSearch }) {
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search articles..."
      />
      <button type="submit" className="search-button">
        <i className="bi bi-search"></i>
      </button>
    </form>
  );
}

export default SearchBar;
