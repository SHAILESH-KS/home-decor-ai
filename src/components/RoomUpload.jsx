import { useState } from "react";
import axios from "axios";

export default function RoomUpload({ onAnalyzed }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/analyze", formData);
      onAnalyzed({ ...res.data, originalFile: file });
    } catch (err) {
      setError("Backend not running or Gemini key issue. Check your terminal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <label style={{
        display: "inline-block", padding: "12px 28px",
        background: "#6C63FF", color: "#fff", borderRadius: 10,
        cursor: "pointer", fontSize: 15, fontWeight: 600,
        marginBottom: 20, transition: "background 0.2s"
      }}>
        Upload Room Photo
        <input type="file" accept="image/*" onChange={handleUpload}
          style={{ display: "none" }} />
      </label>

      {preview && (
        <div style={{ marginTop: 16 }}>
          <img src={preview} alt="Room"
            style={{ maxWidth: 480, width: "100%", borderRadius: 16,
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }} />
        </div>
      )}

      {loading && (
        <div style={{ marginTop: 20, color: "#6C63FF", fontWeight: 600, fontSize: 16 }}>
          Analyzing your room with Gemini AI...
        </div>
      )}

      {error && (
        <div style={{ marginTop: 16, color: "#e53e3e", background: "#fff5f5",
          padding: "12px 20px", borderRadius: 8, fontSize: 14 }}>
          {error}
        </div>
      )}
    </div>
  );
}