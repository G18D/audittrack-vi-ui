from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from datetime import datetime
import json
from typing import List, Optional
from pydantic import BaseModel

app = FastAPI(title="AuditTrack VI API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://audittrack-vi-3fqgr81yi-godfrey-mclennons-projects.vercel.app",
        "http://localhost:3000",  # For local development
        "http://localhost:8000",  # For local API testing
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Data models
class DocumentStatus(BaseModel):
    id: str
    name: str
    vendor: str
    amount: str
    status: str
    issues: int
    uploadedAt: str
    size: str

class ComplianceStatus(BaseModel):
    category: str
    status: str
    score: int
    lastCheck: str

class Stats(BaseModel):
    totalDocuments: int
    passedDocuments: int
    flaggedDocuments: int
    manualReviewDocuments: int

# Mock data (replace with database calls)
mock_documents = [
    {
        "id": "1",
        "name": "Invoice_Q3_2024.pdf",
        "vendor": "Tech Solutions Inc",
        "amount": "$45,230.00",
        "status": "Passed",
        "issues": 0,
        "uploadedAt": "2 hours ago",
        "size": "2.3 MB"
    },
    {
        "id": "2", 
        "name": "Purchase_Order_789.pdf",
        "vendor": "Office Supplies Co",
        "amount": "$12,450.00",
        "status": "Flagged",
        "issues": 3,
        "uploadedAt": "5 hours ago",
        "size": "1.8 MB"
    },
    {
        "id": "3",
        "name": "Contract_Amendment.pdf", 
        "vendor": "Legal Partners LLC",
        "amount": "$8,900.00",
        "status": "Manual Review",
        "issues": 1,
        "uploadedAt": "1 day ago",
        "size": "3.1 MB"
    },
    {
        "id": "4",
        "name": "Expense_Report_Nov.pdf",
        "vendor": "Travel Corp",
        "amount": "$3,200.00", 
        "status": "Passed",
        "issues": 0,
        "uploadedAt": "2 days ago",
        "size": "1.2 MB"
    }
]

mock_compliance = [
    {"category": "Financial Compliance", "status": "Good", "score": 94, "lastCheck": "2 hours ago"},
    {"category": "Vendor Verification", "status": "Excellent", "score": 98, "lastCheck": "1 hour ago"},
    {"category": "Document Standards", "status": "Good", "score": 87, "lastCheck": "3 hours ago"},
    {"category": "Audit Readiness", "status": "Fair", "score": 76, "lastCheck": "6 hours ago"}
]

@app.get("/")
async def root():
    return {"message": "AuditTrack VI API is running", "version": "1.0.0"}

@app.get("/api/documents")
async def get_documents():
    """Get all documents"""
    return {"documents": mock_documents}

@app.get("/api/compliance")
async def get_compliance():
    """Get compliance status"""
    return {"compliance": mock_compliance}

@app.get("/api/stats")
async def get_stats():
    """Get dashboard statistics"""
    total = len(mock_documents)
    passed = len([d for d in mock_documents if d["status"] == "Passed"])
    flagged = len([d for d in mock_documents if d["status"] == "Flagged"])
    manual_review = len([d for d in mock_documents if d["status"] == "Manual Review"])
    
    return {
        "stats": {
            "totalDocuments": total,
            "passedDocuments": passed,
            "flaggedDocuments": flagged,
            "manualReviewDocuments": manual_review
        }
    }

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload and process a document"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Mock processing - in real implementation, this would:
    # 1. Save the file
    # 2. Extract text using OCR
    # 3. Analyze with AI
    # 4. Return processing results
    
    # Simulate processing time
    import time
    time.sleep(1)
    
    new_doc = {
        "id": str(len(mock_documents) + 1),
        "name": file.filename,
        "vendor": "Unknown Vendor",
        "amount": "$0.00",
        "status": "Manual Review",
        "issues": 0,
        "uploadedAt": "just now",
        "size": f"{len(await file.read()) / 1024 / 1024:.1f} MB"
    }
    
    mock_documents.append(new_doc)
    
    return {
        "message": "File uploaded successfully",
        "document": new_doc,
        "processing": {
            "status": "completed",
            "extractedText": "Sample extracted text...",
            "analysis": "Document appears to be a valid invoice"
        }
    }

@app.get("/api/documents/{document_id}")
async def get_document(document_id: str):
    """Get specific document details"""
    doc = next((d for d in mock_documents if d["id"] == document_id), None)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return {"document": doc}

@app.delete("/api/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document"""
    global mock_documents
    doc_index = next((i for i, d in enumerate(mock_documents) if d["id"] == document_id), None)
    if doc_index is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    deleted_doc = mock_documents.pop(doc_index)
    return {"message": "Document deleted successfully", "document": deleted_doc}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# For Vercel deployment
def handler(request):
    return app(request)