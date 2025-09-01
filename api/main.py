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
async def get_documents(limit: int = 50, offset: int = 0):
    """Get documents with pagination - matches frontend expectations"""
    total = len(mock_documents)
    start = offset
    end = min(offset + limit, total)
    documents = mock_documents[start:end]
    
    # Convert string IDs to numbers for frontend compatibility
    for doc in documents:
        doc["id"] = int(doc["id"])
    
    pages = (total + limit - 1) // limit  # Ceiling division
    current_page = (offset // limit) + 1
    
    return {
        "documents": documents,
        "total": total,
        "page": current_page,
        "pages": pages
    }

@app.get("/api/compliance")
async def get_compliance():
    """Get compliance analysis - matches frontend ComplianceAnalysis interface"""
    return {
        "overall_score": 91,
        "breakdown": {
            "irs_compliance": 94,
            "usvi_dol_compliance": 87,
            "gasb_compliance": 91
        },
        "recent_issues": [
            {"type": "Missing Documentation", "count": 2, "severity": "Medium"},
            {"type": "Date Discrepancy", "count": 1, "severity": "Low"},
            {"type": "Amount Mismatch", "count": 3, "severity": "High"}
        ],
        "recommendations": [
            {"action": "Review vendor documentation", "impact": "Reduce processing time by 15%"},
            {"action": "Implement automated date validation", "impact": "Eliminate 80% of date errors"},
            {"action": "Add amount cross-checking", "impact": "Improve accuracy by 25%"}
        ]
    }

@app.get("/api/stats")
async def get_stats():
    """Get dashboard statistics - matches frontend Stats interface"""
    total = len(mock_documents)
    passed = len([d for d in mock_documents if d["status"] == "Passed"])
    flagged = len([d for d in mock_documents if d["status"] == "Flagged"])
    
    # Calculate percentages and mock values to match frontend expectations
    issues_resolved_percent = (passed / total * 100) if total > 0 else 0
    
    return {
        "documents_processed": total,
        "issues_resolved_percent": round(issues_resolved_percent, 1),
        "avg_processing_time": 2.3,  # Mock value in minutes
        "total_savings": 45230.50,   # Mock value in dollars
        "compliance_scores": {
            "irs": 94,
            "usvi_dol": 87,
            "gasb": 91,
            "overall": 91
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

@app.get("/api/health")
async def api_health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# For Vercel deployment
def handler(request):
    return app(request)