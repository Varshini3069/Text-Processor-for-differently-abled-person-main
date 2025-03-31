import React, { useState } from "react";
import axios from "axios";

const FileUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              setUploadProgress(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              );
            }
          },
        }
      );

      if (response.status === 200) {
        alert("File uploaded successfully!");
        setSelectedFile(null);
        setUploadProgress(0);
      } else {
        alert("Upload failed!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading.");
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-md mx-auto">
      <input type="file" onChange={handleFileChange} className="mb-4" />
      {selectedFile && (
        <div className="mb-4">
          <p>Selected File: {selectedFile.name}</p>
          {selectedFile.type.startsWith("image/") && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="w-32 h-32 object-cover mt-2"
            />
          )}
        </div>
      )}
      {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Upload
      </button>
    </div>
  );
};

export default FileUploader;
