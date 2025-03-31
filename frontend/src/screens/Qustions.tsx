import { useState } from "react";
import "../styles/Questions.scss";
import axios from "axios";
import { backend_url } from "../constants/backend";

const Questions = () => {
  const [inputText, setInputText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestion = async () => {
    if (!inputText.trim()) return;
    setLoading(true);

    try {
      const url = `${backend_url}/generate-questions`;
      const data = {
        input_data: inputText,
      };
      const res = await axios.post(url, data);
      console.log(res.data);
      setQuestions(res.data?.questions || []);
    } catch (error) {
      console.error("Error fetching question:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="questions-container">
      <h2>Question Generator</h2>
      <textarea
        placeholder="Enter a topic..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={fetchQuestion} disabled={loading}>
        {loading ? "Loading..." : "Generate Question"}
      </button>

      <div className="question-list">
        {questions.length > 0 && <h3>Generated Questions:</h3>}
        {questions.map((q, index) => (
          <div key={index} className="question-item">
            {q}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
