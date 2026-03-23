import base64
import io
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageColor

STYLE_CONFIG = {
    "modern": {
        "tint": (200, 210, 220), "tint_alpha": 0.30,
        "sharpen": 2.0, "contrast": 1.3, "color_sat": 0.8,
        "brightness": 1.1,
    },
    "minimalist": {
        "tint": (255, 255, 255), "tint_alpha": 0.40,
        "sharpen": 1.8, "contrast": 0.9, "color_sat": 0.4,
        "brightness": 1.2,
    },
    "traditional": {
        "tint": (180, 120, 60), "tint_alpha": 0.25,
        "sharpen": 1.4, "contrast": 1.2, "color_sat": 1.4,
        "brightness": 0.9,
    },
    "bohemian": {
        "tint": (220, 140, 60), "tint_alpha": 0.28,
        "sharpen": 1.3, "contrast": 1.15, "color_sat": 1.6,
        "brightness": 1.05,
    },
    "industrial": {
        "tint": (60, 55, 50), "tint_alpha": 0.35,
        "sharpen": 1.6, "contrast": 1.4, "color_sat": 0.5,
        "brightness": 0.85,
    },
    "scandinavian": {
        "tint": (220, 235, 240), "tint_alpha": 0.32,
        "sharpen": 1.5, "contrast": 1.05, "color_sat": 0.6,
        "brightness": 1.25,
    },
}

DEFAULT_CONFIG = STYLE_CONFIG["modern"]


def generate_room_render(image_b64: str, style: str, colors: dict) -> str:
    img_bytes = base64.b64decode(image_b64)
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB").resize((800, 600))

    cfg = STYLE_CONFIG.get(style, DEFAULT_CONFIG)

    # 1. Colour adjustments
    img = ImageEnhance.Color(img).enhance(cfg["color_sat"])
    img = ImageEnhance.Contrast(img).enhance(cfg["contrast"])
    img = ImageEnhance.Brightness(img).enhance(cfg["brightness"])
    img = ImageEnhance.Sharpness(img).enhance(cfg["sharpen"])

    # 2. Apply a strong style tint
    tint = Image.new("RGB", img.size, cfg["tint"])
    img = Image.blend(img, tint, alpha=cfg["tint_alpha"])

    # 3. Apply wall-colour gradient overlay at the top (like a filtered wall)
    wall_hex = colors.get("wall", "#F5F0EB").lstrip("#")
    try:
        wr, wg, wb = int(wall_hex[0:2], 16), int(wall_hex[2:4], 16), int(wall_hex[4:6], 16)
    except Exception:
        wr, wg, wb = 245, 240, 235

    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    h = img.size[1]
    # Gradient: stronger wall colour at top (wall area), fade to transparent at bottom (floor)
    for y in range(h // 2):
        alpha = int((1 - y / (h / 2)) * 130)  # up to ~50% opacity at top
        draw.line([(0, y), (img.size[0], y)], fill=(wr, wg, wb, alpha))

    img_rgba = img.convert("RGBA")
    img_rgba = Image.alpha_composite(img_rgba, overlay)
    img = img_rgba.convert("RGB")

    # 4. Subtle soft-focus glow
    blurred = img.filter(ImageFilter.GaussianBlur(radius=1.2))
    img = Image.blend(img, blurred, alpha=0.15)

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()