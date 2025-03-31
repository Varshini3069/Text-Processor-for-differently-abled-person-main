import { useState } from "react";
import axios from "axios";
import "../styles/Notes.scss";
import { backend_url } from "../constants/backend";

const brailleMap: { [key: string]: string } = {
  a: "⠁",
  b: "⠃",
  c: "⠉",
  d: "⠙",
  e: "⠑",
  f: "⠋",
  g: "⠛",
  h: "⠓",
  i: "⠊",
  j: "⠚",
  k: "⠅",
  l: "⠇",
  m: "⠍",
  n: "⠝",
  o: "⠕",
  p: "⠏",
  q: "⠟",
  r: "⠗",
  s: "⠎",
  t: "⠞",
  u: "⠥",
  v: "⠧",
  w: "⠺",
  x: "⠭",
  y: "⠽",
  z: "⠵",
  " ": " ",
  ".": "⠲",
  ",": "⠂",
  "?": "⠦",
  "!": "⠖",
};

const textToBraille = (text: string): string => {
  return text
    .toLowerCase()
    .split("")
    .map((char) => brailleMap[char] || char)
    .join("");
};

const Notes = () => {
  const [notes, setNotes] = useState("Your notes will appear here...");
  const [fetchedNotes, setFetchedNotes] = useState("");
  const [brailleText, setBrailleText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const url = `${backend_url}/generate-notes`;
      const data: Record<string, string> = {};
      data["input_data"] = notes;
      const res = await axios.post(url, data);
      setBrailleText(textToBraille(res.data?.notes));
      setFetchedNotes(res.data?.notes);
    } catch (error) {
      setFetchedNotes("Failed to fetch notes. Please try again.");
      setBrailleText("");
    } finally {
      setLoading(false);
    }
  };

  const printBraille = () => {
    const printWindow = window.open("", "", "width=600,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <pre style="font-size: 24px; padding: 20px;">
          ${brailleText}
        </pre>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="notes-container">
      <h2>Notes</h2>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={6}
      />

      <button onClick={fetchNotes} disabled={loading}>
        {loading ? "Loading..." : "Make Notes"}
      </button>

      <textarea
        value={fetchedNotes}
        readOnly
        rows={6}
        className="readonly-textarea"
      />

      <textarea
        value={brailleText}
        readOnly
        rows={6}
        className="readonly-textarea"
      />

      <button onClick={printBraille} disabled={!brailleText}>
        Print Braille
      </button>
    </div>
  );
};

export default Notes;
