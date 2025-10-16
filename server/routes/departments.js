const express = require("express");
const pool = require("../db.js");
const router = express.Router();

// 🔹 Get all departments
router.get("/", async (req, res) => {
  try {
    const [departments] = await pool.query("SELECT * FROM departments");
    res.json(departments);
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

// 🔹 Get all departments + their designations
router.get("/all", async (req, res) => {
  try {
    const [departments] = await pool.query("SELECT * FROM departments");
    const [designations] = await pool.query("SELECT * FROM designations");

    const deptMap = {};
    departments.forEach((d) => {
      deptMap[d.name] = designations
        .filter((des) => des.department_id === d.id)
        .map((des) => des.name);
    });

    res.json(deptMap);
  } catch (err) {
    console.error("Error fetching departments with designations:", err);
    res.status(500).json({ error: "Failed to fetch departments with designations" });
  }
});

module.exports = router;
