from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
import pytesseract
from PIL import Image
import io

                    
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

class InputData(BaseModel):
    input_data: str
    
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
question_generator = pipeline("text2text-generation", model="ramsrigouthamg/t5_squad_v1", from_pt=True)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if file.content_type not in ["image/png", "image/jpeg", "image/jpg"]:
            return {"error": "Only PNG, JPEG, and JPG formats are supported."}
        
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))

        extracted_text = pytesseract.image_to_string(image)

        return {
            "message": f"File '{file.filename}' processed successfully!",
            "extracted_text": extracted_text.strip()
        }
    except Exception as e:
        return {"error": str(e)}
    
@app.post("/generate-notes/")
async def generate_notes_api(request: InputData):
    try:
        summary = summarizer(request.input_data, max_length=100, min_length=30, do_sample=False)
        notes = summary[0]["summary_text"]

        return {"notes": notes}
    except Exception as e:
        return {"error": str(e)}


@app.post("/generate-questions/")
async def generate_questions_api(request: InputData):
    try:
        generated_text = question_generator(
            f"generate questions: {request.input_data}", 
            max_length=150, 
            num_return_sequences=3,  
            num_beams=5  
        )

        questions = [q["generated_text"] for q in generated_text]

        return {"questions": questions}
    except Exception as e:
        return {"error": str(e)}