import express from "express";
import Report from "../models/report.js";

const router = express.Router();

// POST: Add new report
router.post("/", async (req, res) => {
  try {
    const newReport = new Report(req.body);
    await newReport.save();
    res.status(201).json({ message: "Report added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add report" });
  }
});

// GET: Get all reports
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find();
    console.log("Fetched reports:", reports);
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

export default router;
