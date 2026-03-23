import { useState } from "react";
import axios from "axios";
import RoomUpload from "./components/RoomUpload";
import StyleSuggestions from "./components/StyleSuggestions";
import Viewer3D from "./components/Viewer3D";
import ObjectUpload from "./components/ObjectUpload";

export default function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [colors, setColors] = useState({ wall: "#F5F0EB", floor: "#C8B89A" });
  const [renderedImage, setRenderedImage] = useState(null);
  const [rendering, setRendering] = useState(false);
  const [objects, setObjects] = useState([]);

  const handleColorChange = (part, color) =>
    setColors(prev => ({ ...prev, [part]: color }));

  const handleRender = async () => {
    if (!analysisData?.originalFile) return;
    setRendering(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const b64 = e.target.result.split(",")[1];
      const res = await axios.post("http://localhost:8000/render", {
        image: b64, style: selectedStyle, colors
      });
      setRenderedImage(`data:image/png;base64,${res.data.rendered_image}`);
      setRendering(false);
    };
    reader.readAsDataURL(analysisData.originalFile);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F4F6FB", fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* Header */}
      <div style={{ background: "#6C63FF", padding: "20px 40px",
        boxShadow: "0 2px 12px rgba(108,99,255,0.3)" }}>
        <h1 style={{ color: "#fff", margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: 0.5 }}>
          AI Home Interior Designer
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", margin: "4px 0 0", fontSize: 14 }}>
          Upload your room photo and let Gemini AI redesign it
        </p>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>

        {/* Upload Card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 32,
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)", marginBottom: 28 }}>
          <h2 style={{ marginTop: 0, color: "#2D2D2D", fontWeight: 700 }}>Step 1 — Upload Your Room</h2>
          <RoomUpload onAnalyzed={(data) => {
            setAnalysisData(data);
            setSelectedStyle(data.detected_style);
            setColors({ wall: data.color_palette[0], floor: "#C8B89A" });
          }} />
        </div>

        {analysisData && (
          <>
            {/* Style & Color */}
            <div style={{ background: "#fff", borderRadius: 20, padding: 32,
              boxShadow: "0 4px 24px rgba(0,0,0,0.07)", marginBottom: 28 }}>
              <h2 style={{ marginTop: 0, color: "#2D2D2D", fontWeight: 700 }}>Step 2 — Style & Colors</h2>
              <StyleSuggestions
                data={analysisData}
                onStyleSelect={setSelectedStyle}
                selectedStyle={selectedStyle}
                onColorChange={handleColorChange}
                selectedColor={colors.wall}
              />
            </div>

            {/* Furniture Upload */}
            <div style={{ background: "#fff", borderRadius: 20, padding: 32,
              boxShadow: "0 4px 24px rgba(0,0,0,0.07)", marginBottom: 28 }}>
              <h2 style={{ marginTop: 0, color: "#2D2D2D", fontWeight: 700 }}>Step 3 — Add Furniture (Sofa, etc.)</h2>
              <ObjectUpload onObjectUploaded={(url) => setObjects(prev => [...prev, url])} />
              
              {objects.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                  {objects.map((obj, idx) => (
                    <img key={idx} src={obj} alt={`uploaded-${idx}`} style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 8, border: '1px solid #eee' }} />
                  ))}
                </div>
              )}
            </div>

            {/* 3D Viewer */}
            <div style={{ background: "#fff", borderRadius: 20, padding: 32,
              boxShadow: "0 4px 24px rgba(0,0,0,0.07)", marginBottom: 28 }}>
              <h2 style={{ marginTop: 0, color: "#2D2D2D", fontWeight: 700 }}>Step 4 — 3D Preview</h2>
              <p style={{ color: "#888", fontSize: 14, marginTop: -8 }}>
                Drag to rotate · Scroll to zoom · Colors update in real time
              </p>
              <Viewer3D wallColor={colors.wall} floorColor={colors.floor} uploadedObjects={objects} />
            </div>

            {/* Render */}
            <div style={{ background: "#fff", borderRadius: 20, padding: 32,
              boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
              <h2 style={{ marginTop: 0, color: "#2D2D2D", fontWeight: 700 }}>Step 5 — Generate Render</h2>
              <button onClick={handleRender} disabled={rendering}
                style={{
                  padding: "14px 36px", background: rendering ? "#aaa" : "#6C63FF",
                  color: "#fff", border: "none", borderRadius: 12,
                  fontSize: 16, fontWeight: 700, cursor: rendering ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 14px rgba(108,99,255,0.4)", transition: "all 0.2s"
                }}>
                {rendering ? "Generating..." : "Generate Styled Render"}
              </button>

              {renderedImage && (
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ color: "#2D2D2D" }}>Your styled room</h3>
                  <img src={renderedImage} alt="Rendered"
                    style={{ width: "100%", borderRadius: 16,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}