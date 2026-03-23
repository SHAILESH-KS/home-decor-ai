export default function StyleSuggestions({ data, onStyleSelect, selectedStyle, onColorChange, selectedColor }) {
  if (!data) return null;

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 24,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <span style={{ background: "#6C63FF", color: "#fff", borderRadius: 8,
            padding: "4px 14px", fontWeight: 700, fontSize: 13 }}>
            {data.detected_style.toUpperCase()}
          </span>
          <span style={{ color: "#888", fontSize: 13 }}>
            {Math.round(data.confidence * 100)}% confidence
          </span>
        </div>
        <p style={{ color: "#555", fontSize: 14, margin: 0 }}>
          Gemini detected your room style. Select a style below to redesign it.
        </p>
      </div>

      <h3 style={{ fontWeight: 700, marginBottom: 12, color: "#2D2D2D" }}>Choose a Style</h3>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
        {[data.detected_style, ...data.suggested_styles].map(style => (
          <button key={style} onClick={() => onStyleSelect(style)}
            style={{
              padding: "10px 22px", borderRadius: 30, border: "2px solid",
              borderColor: selectedStyle === style ? "#6C63FF" : "#e0e0e0",
              background: selectedStyle === style ? "#6C63FF" : "#fff",
              color: selectedStyle === style ? "#fff" : "#444",
              fontWeight: 600, fontSize: 14, cursor: "pointer",
              transition: "all 0.2s", textTransform: "capitalize"
            }}>
            {style}
          </button>
        ))}
      </div>

      <h3 style={{ fontWeight: 700, marginBottom: 12, color: "#2D2D2D" }}>Color Palette</h3>
      <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
        {data.color_palette.map(color => (
          <div key={color} onClick={() => onColorChange("wall", color)}
            style={{
              width: 52, height: 52, borderRadius: 12, background: color,
              cursor: "pointer", border: selectedColor === color ? "3px solid #6C63FF" : "3px solid transparent",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)", transition: "transform 0.2s",
            }}
            title={color}
          />
        ))}
      </div>

      <h3 style={{ fontWeight: 700, marginBottom: 12, color: "#2D2D2D" }}>Furniture Suggestions</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
        {data.furniture_suggestions.map((item, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 12, padding: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)", display: "flex",
            alignItems: "center", gap: 12
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 8,
              background: item.color, flexShrink: 0,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, textTransform: "capitalize" }}>{item.item}</div>
              <div style={{ color: "#888", fontSize: 12 }}>{item.style}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}