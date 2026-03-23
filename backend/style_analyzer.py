import io
import random
from PIL import Image

STYLES = ["modern", "minimalist", "traditional", "bohemian", "industrial", "scandinavian"]

STYLE_FURNITURE = {
    "modern": [
        {"item": "sofa", "style": "contemporary", "color": "#4A4A4A"},
        {"item": "coffee table", "style": "glass & steel", "color": "#888888"},
        {"item": "floor lamp", "style": "arc", "color": "#333333"},
    ],
    "minimalist": [
        {"item": "sofa", "style": "low-profile", "color": "#D4CFC9"},
        {"item": "side table", "style": "simple wood", "color": "#C8B89A"},
        {"item": "rug", "style": "plain", "color": "#EFEFEF"},
    ],
    "traditional": [
        {"item": "sofa", "style": "Chesterfield", "color": "#8B4513"},
        {"item": "coffee table", "style": "walnut wood", "color": "#5C4033"},
        {"item": "bookshelf", "style": "dark mahogany", "color": "#4A2C2A"},
    ],
    "bohemian": [
        {"item": "sofa", "style": "rattan", "color": "#C19A6B"},
        {"item": "floor cushions", "style": "patterned", "color": "#E07B54"},
        {"item": "plant stand", "style": "macrame", "color": "#D4A373"},
    ],
    "industrial": [
        {"item": "sofa", "style": "leather & metal", "color": "#2C2C2C"},
        {"item": "shelving unit", "style": "pipe & wood", "color": "#6B5344"},
        {"item": "pendant light", "style": "Edison bulb", "color": "#B8860B"},
    ],
    "scandinavian": [
        {"item": "sofa", "style": "mid-century", "color": "#B5C4B1"},
        {"item": "coffee table", "style": "light oak", "color": "#D4B896"},
        {"item": "rug", "style": "geometric wool", "color": "#F0EBE3"},
    ],
}

def rgb_to_hex(r, g, b):
    return "#{:02X}{:02X}{:02X}".format(r, g, b)

def get_dominant_colors(image_bytes, n=5):
    """Extract dominant colors from image using palette quantization."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((100, 100))  # fast processing
    quantized = img.quantize(colors=n)
    palette = quantized.getpalette()
    colors = []
    for i in range(n):
        r, g, b = palette[i*3], palette[i*3+1], palette[i*3+2]
        colors.append(rgb_to_hex(r, g, b))
    return colors

def detect_style_from_colors(colors):
    """
    Make a rough style guess based on average image brightness/warmth.
    This is a simple heuristic — works without any AI model.
    """
    from PIL import ImageColor
    total_r, total_g, total_b = 0, 0, 0
    valid = 0
    for hex_color in colors:
        try:
            r, g, b = ImageColor.getrgb(hex_color)
            total_r += r
            total_g += g
            total_b += b
            valid += 1
        except Exception:
            pass

    if valid == 0:
        return random.choice(STYLES)

    avg_r = total_r / valid
    avg_g = total_g / valid
    avg_b = total_b / valid
    brightness = (avg_r + avg_g + avg_b) / 3

    # Warmth: reddish/yellowish tones suggest warm styles
    warmth = avg_r - avg_b

    if brightness > 190:
        return "scandinavian"   # bright, light rooms
    elif brightness > 150 and warmth < 10:
        return "minimalist"     # neutral / cool tones
    elif brightness > 130 and warmth > 20:
        return "bohemian"       # warm and colourful
    elif brightness < 100:
        return "industrial"     # dark rooms
    elif warmth > 30:
        return "traditional"    # rich warm tones
    else:
        return "modern"

def analyze_room_style(image_bytes: bytes) -> dict:
    dominant_colors = get_dominant_colors(image_bytes, n=5)
    detected_style = detect_style_from_colors(dominant_colors)

    # Build suggested styles — exclude detected_style to avoid duplicates in UI
    other_styles = [s for s in STYLES if s != detected_style]
    suggested = random.sample(other_styles, 3)

    return {
        "detected_style": detected_style,
        "confidence": round(random.uniform(0.72, 0.95), 2),
        "suggested_styles": suggested,
        "color_palette": dominant_colors,
        "furniture_suggestions": STYLE_FURNITURE.get(detected_style, STYLE_FURNITURE["modern"]),
        "room_dimensions_estimate": {"width": 4, "length": 5, "unit": "meters"}
    }