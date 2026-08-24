import os
import json
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
import google.generativeai as genai
from pydantic import BaseModel, Field
from typing import Literal

# Configure the Gemini SDK (Ensure GEMINI_API_KEY is in your environment variables)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(
    title="AgroKisan OCR Engine",
    description="AI-powered document scanner for land records using Gemini 1.5 Flash."
)

# Define the exact JSON structure the frontend expects
class DocumentAnalysis(BaseModel):
    name_match_confidence: str = Field(
        description="Confidence of the farmer's name matching the document, expressed as a percentage (e.g., '98%')"
    )
    extracted_acres: float = Field(
        description="Total land area in acres extracted from the document"
    )
    risk_profile: Literal["Low", "Medium", "High"] = Field(
        description="Risk profile based on document clarity, missing signatures, or anomalies"
    )

@app.post("/api/scandocument")
async def scan_document(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    # Read the file bytes from the FastAPI upload stream
    file_bytes = await file.read()
    
    temp_file_path = ""
    uploaded_gemini_file = None
    
    try:
        # The Gemini File API requires a physical file path (especially for PDFs), 
        # so we write the upload to a temporary file.
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            temp_file.write(file_bytes)
            temp_file_path = temp_file.name

        # Upload the document to Google's generative AI storage
        uploaded_gemini_file = genai.upload_file(
            path=temp_file_path, 
            mime_type=file.content_type
        )
        
        # Initialize the Flash model for rapid multimodal processing
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Prompt the model and strictly enforce the JSON schema
        response = model.generate_content(
            contents=[
                uploaded_gemini_file,
                "Analyze this agricultural land record. Extract the total acres, estimate the farmer name match confidence, and determine the risk profile."
            ],
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=DocumentAnalysis,
                temperature=0.1 # Low temperature for analytical accuracy
            )
        )
        
        # The model returns a strictly formatted JSON string; parse it back to a Python dict
        return json.loads(response.text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")
        
    finally:
        # 1. Clean up local temp file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        # 2. Clean up Google's servers to prevent quota issues
        if uploaded_gemini_file:
            genai.delete_file(uploaded_gemini_file.name)

if __name__ == "__main__":
    import uvicorn
    # Run the server locally on port 8000
    uvicorn.run("ocr_engine:app", host="0.0.0.0", port=8000, reload=True)