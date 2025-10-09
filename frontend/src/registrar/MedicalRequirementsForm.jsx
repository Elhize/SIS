import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Button, Select, MenuItem } from "@mui/material";

const MedicalRequirementsForm = () => {
  const [question, setQuestion] = useState("");
  const [answerType, setAnswerType] = useState("yes_no");
  const [requirements, setRequirements] = useState([]);

  const fetchMedicalRequirements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/medical-requirements");
      setRequirements(res.data);
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  useEffect(() => {
    fetchMedicalRequirements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      await axios.post("http://localhost:5000/medical-requirements", {
        question,
        answer_type: answerType,
      });
      setQuestion("");
      setAnswerType("yes_no");
      fetchMedicalRequirements();
    } catch (err) {
      console.error("Error saving medical requirement:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/medical-requirements/${id}`);
      fetchMedicalRequirements();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  return (
    <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", paddingRight: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, mb: 2, px: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "maroon", fontSize: "36px" }}>
          MANAGE MEDICAL REQUIREMENTS
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
        {/* Left Side - Form */}
        <div style={{ border: "2px solid maroon" }} className="md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 style={{ color: "maroon" }} className="text-xl font-semibold mb-4">
            Add a New Medical Question
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter medical question"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
            />

            <Select
              fullWidth
              value={answerType}
              onChange={(e) => setAnswerType(e.target.value)}
              sx={{ backgroundColor: "white" }}
            >
              <MenuItem value="yes_no">Yes / No (Checkbox)</MenuItem>
              <MenuItem value="text">Text Answer</MenuItem>
              <MenuItem value="multiple_choice">Multiple Choice (Future)</MenuItem>
            </Select>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ backgroundColor: "#800000", "&:hover": { backgroundColor: "#5c0000" } }}
            >
              Save Medical Question
            </Button>
          </form>
        </div>

        {/* Right Side - Display Saved Questions */}
        <div style={{ border: "2px solid maroon" }} className="md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-sm max-h-96 overflow-y-auto">
          <h3 style={{ color: "maroon" }} className="text-xl font-semibold mb-4">
            Saved Medical Requirements
          </h3>
          <ul className="space-y-2">
            {requirements.map((req) => (
              <li
                key={req.id}
                className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm flex justify-between items-center"
              >
                <span className="text-gray-800">
                  {req.question} — <strong>{req.answer_type.toUpperCase()}</strong>
                </span>
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => handleDelete(req.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Box>
  );
};

export default MedicalRequirementsForm;
