# api/utils.py - Updated for FastAPI compatibility
import os
from PyPDF2 import PdfReader
from pdf2image import convert_from_path
import pytesseract
from PIL import Image
import cv2
import numpy as np
import openai
from langchain_openai import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
from fpdf import FPDF
import tempfile
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------- OCR & Text Extraction ----------
def extract_text_from_pdf(pdf_path):
    """Extract text from PDF with OCR fallback"""
    text = ""
    used_ocr = False
    
    try:
        logger.info(f"Attempting direct text extraction from {pdf_path}")
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text += t
    except Exception as e:
        logger.warning(f"Direct text extraction failed: {e}")

    # OCR fallback
    if not text.strip():
        logger.info("Falling back to OCR processing")
        used_ocr = True
        try:
            images = convert_from_path(pdf_path)
            for img in images:
                img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
                gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY)
                thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
                img_pil = Image.fromarray(thresh)
                text += pytesseract.image_to_string(img_pil, config="--psm 6 -l eng") + "\n"
        except Exception as e:
            logger.error(f"OCR processing failed: {e}")
            raise

    logger.info(f"Text extraction complete. Length: {len(text)} characters")
    return text, used_ocr

# ---------- Field Checks ----------
def check_fields_extracted(text):
    """Check for required fields in document text"""
    status = {}
    status['Date'] = '✅ Complete' if any(y in text for y in ['2022', '2023', '2024', '2025']) else '❌ Missing'
    status['Vendor Name'] = '✅ Complete' if any(x in text for x in ['LLC', 'Inc', 'Corp']) else '❌ Missing'
    status['Total Amount'] = '✅ Complete' if '$' in text or 'USD' in text else '❌ Missing'
    status['Account Code'] = '✅ Complete' if 'Account Code:' in text else '❌ Missing'
    status['Department or Project'] = '✅ Complete' if 'Department or Project:' in text else '❌ Missing'
    status['Signature present'] = '⚠ Problem' if 'signature' not in text.lower() else '✅ Complete'
    
    logger.info(f"Field check complete: {status}")
    return status

# ---------- GPT Field Extraction ----------
def extract_fields_with_gpt(doc_text):
    """Use GPT to extract structured fields from document"""
    try:
        logger.info("Starting GPT field extraction")
        client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        prompt = f"""
        You are a compliance audit assistant. Extract the following information from this document:
        - Vendor Name
        - Date
        - Total Amount
        - Account Code
        - Department or Project
        - Signature present (Yes/No)
        
        Format your response as JSON with clear field names.
        If a field is missing or unclear, mark it as "Not Found".

        Document Text:
        \"\"\"{doc_text[:4000]}\"\"\"
        """
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )
        
        result = response.choices[0].message.content
        logger.info("GPT field extraction complete")
        return result
        
    except Exception as e:
        logger.error(f"GPT field extraction failed: {e}")
        return f"Error calling GPT: {e}"

# ---------- Compliance Check ----------
def perform_compliance_analysis(doc_text):
    """Perform compliance analysis using Pinecone knowledge base"""
    try:
        logger.info("Starting compliance analysis")
        
        # Initialize Pinecone
        pc = Pinecone(
            api_key=os.getenv("PINECONE_API_KEY"),
            environment=os.getenv("PINECONE_ENVIRONMENT")
        )
        
        # Set up embeddings and LLM
        embeddings = OpenAIEmbeddings(
            model="text-embedding-3-small",
            dimensions=1024,
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )
        
        llm = ChatOpenAI(
            temperature=0,
            model_name="gpt-3.5-turbo-16k",
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # Connect to existing index
        vectorstore = PineconeVectorStore.from_existing_index(
            index_name="rules-knowledge-base",
            embedding=embeddings
        )
        
        # Create QA chain
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vectorstore.as_retriever(search_kwargs={'k': 3}),
            return_source_documents=True
        )
        
        # Analyze document
        query = f"Analyze this document for compliance issues with IRS, USVI DOL, and GASB requirements:\n\n{doc_text[:4000]}"
        result = qa_chain.invoke({"query": query})
        
        logger.info("Compliance analysis complete")
        return result
        
    except Exception as e:
        logger.error(f"Compliance analysis failed: {e}")
        return {
            "result": f"Error in compliance analysis: {e}",
            "source_documents": []
        }

# ---------- Report Building ----------
def synthesize_report(file_name, field_status, compliance_response, gpt_field_results):
    """Synthesize audit report from analysis results"""
    logger.info(f"Synthesizing report for {file_name}")
    
    return {
        "Document_Name": file_name,
        "Extracted_Fields_Status_Basic": field_status,
        "Extracted_Fields_Results_GPT": gpt_field_results,
        "Compliance_Assessment": compliance_response.get("result", "N/A"),
        "Supporting_Regulations": [
            {"content": doc.page_content if hasattr(doc, 'page_content') else str(doc)}
            for doc in compliance_response.get("source_documents", [])
        ]
    }

def export_audit_to_pdf(report_data, output_filename="audit_report.pdf", document_name="Uploaded File"):
    """Export audit report to PDF"""
    try:
        logger.info(f"Exporting audit report to {output_filename}")
        
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        
        # Title
        pdf.cell(0, 10, "AuditTrack VI - Audit Results Report", ln=True, align='C')
        pdf.cell(0, 10, f"Document: {document_name}", ln=True)
        pdf.ln(10)
        
        # Field status table
        pdf.set_font("Arial", size=10)
        for field, status in report_data["Extracted_Fields_Status_Basic"].items():
            pdf.cell(80, 8, field, 1)
            pdf.cell(80, 8, status, 1, ln=1)
        
        pdf.output(output_filename)
        logger.info(f"PDF export complete: {output_filename}")
        return output_filename
        
    except Exception as e:
        logger.error(f"PDF export failed: {e}")
        raise