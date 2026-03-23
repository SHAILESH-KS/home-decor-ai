import { useState } from "react";
import axios from "axios";

export default function ObjectUpload({ onObjectUploaded }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/remove-background", formData, {
        responseType: "blob"
      });
      const imageUrl = URL.createObjectURL(res.data);
      onObjectUploaded(imageUrl);
    } catch (err) {
      console.error("Background removal failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <h3>Upload an Object (e.g., Furniture)</h3>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {loading && <p>Removing background...</p>}
      {preview && !loading && (
        <img 
          src={preview} 
          alt="Object Preview" 
          style={{ maxWidth: 200, marginTop: 16, borderRadius: 8 }} 
        />
      )}
    </div>
  );
}
