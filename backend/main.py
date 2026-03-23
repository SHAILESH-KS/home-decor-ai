from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
import base64
import io
from PIL import Image, ImageEnhance
import rembg
from style_analyzer import analyze_room_style
from renderer import generate_room_render

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_room(file: UploadFile = File(...)):
    image_bytes = await file.read()
    result = analyze_room_style(image_bytes)
    return JSONResponse(result)

@app.post("/render")
async def render_room(payload: dict):
    image_b64 = payload["image"]      # base64 room photo
    style     = payload["style"]      # e.g. "modern"
    colors    = payload["colors"]     # e.g. {"wall": "#F5F0EB"}
    rendered  = generate_room_render(image_b64, style, colors)
    return {"rendered_image": rendered}

@app.post("/remove-background")
async def remove_background(file: UploadFile = File(...)):
    image_bytes = await file.read()
    output_bytes = rembg.remove(image_bytes)
    return Response(content=output_bytes, media_type="image/png")

@app.post("/enhance-room")
async def enhance_room(file: UploadFile = File(...)):
    image_bytes = await file.read()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    # Enhance sharpness and contrast
    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(1.5)
    
    enhancer_contrast = ImageEnhance.Contrast(img)
    img = enhancer_contrast.enhance(1.2)
    
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return Response(content=buf.getvalue(), media_type="image/jpeg")