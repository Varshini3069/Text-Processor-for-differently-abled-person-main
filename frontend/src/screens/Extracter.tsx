import React, { useState } from "react";
import axios from "axios";
import "../styles/Extractor.scss";
import { backend_url } from "../constants/backend";

const Extractor = () => {
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await axios.post(`${backend_url}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setExtractedText(response.data?.extracted_text || "No text extracted.");
    } catch (error) {
      console.error("Error extracting text:", error);
      setExtractedText("Failed to extract text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="extractor-container">
      <h2>Upload Image for Text Extraction</h2>

      <label className="custom-file-upload">
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        Choose File
      </label>

      {loading ? <p>Extracting text...</p> : null}

      <textarea
        value={extractedText}
        readOnly
        rows={6}
        placeholder="Extracted content will appear here..."
        className="readonly-textarea"
      />
    </div>
  );
};

export default Extractor;
