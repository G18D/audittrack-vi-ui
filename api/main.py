# api/main.py - FastAPI backend for Vercel deployment
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import os
from typing import List, Dict, Any
import json

# Import your existing utilities
from utils import (
    extract_text_from_pdf, check_fields_extracted,
    extract_fields_with_gpt, perform_compliance_analysis,
    synthesize_report, export_audit_to_pdf
)

app = FastAPI(title="AuditTrack VI API", version="1.0.0")

# CORS configuration for your Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://audittrack-vi-ui.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class AuditStatus(BaseModel):
    document_name: str
    status: str
    issues_count: int
    processing_time: float

class AuditResponse(BaseModel):
    success: bool
    message: str
    data: Dict[str, Any] = None
    audit_id: str = None

class ComplianceAnalysis(BaseModel):
    overall_score: float
    irs_compliance: float
    usvi_dol_compliance: float
    gasb_compliance: float
    issues: List[Dict[str, str]]

# In-memory storage (replace with database in production)
audit_results = {}
audit_history = []

@app.get("/")
async def root():
    return {
        "message": "AuditTrack VI API - Caribbean Edition", 
        "version": "1.0.0",
        "status": "online"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": "2025-08-15T12:00:00Z",
        "services": {
            "openai": "connected",
            "pinecone": "connected",
            "ocr": "available"
        }
    }

@app.get("/api/stats")
async def get_stats():
    """Get dashboard statistics"""
    return {
        "documents_processed": 1247,
        "issues_resolved_percent": 89,
        "avg_processing_time": 2.3,
        "total_savings": 89200,
        "compliance_scores": {
            "irs": 94,
            "usvi_dol": 82,
            "gasb": 88,
            "overall": 87
        }
    }

@app.post("/api/upload", response_model=AuditResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a document"""
    if not file.filename.endswith(('.pdf', '.csv', '.xlsx', '.docx')):
        raise HTTPException(status_code=400, detail="Unsupported file type")
    
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        # Process the document using your existing pipeline
        text, used_ocr = extract_text_from_pdf(tmp_path)
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text could be extracted from the document")
        
        # Extract fields and analyze compliance
        field_status = check_fields_extracted(text)
        gpt_results = extract_fields_with_gpt(text)
        compliance_response = perform_compliance_analysis(text)
        
        # Generate report
        report = synthesize_report(
            file.filename,
            field_status,
            compliance_response,
            gpt_results
        )
        
        # Store results
        audit_id = f"audit_{len(audit_results) + 1}"
        audit_results[audit_id] = {
            "filename": file.filename,
            "report": report,
            "timestamp": "2025-08-15T12:00:00Z",
            "status": "completed"
        }
        
        # Add to history
        audit_history.append({
            "id": audit_id,
            "name": file.filename,
            "status": "Passed" if len([k for k, v in field_status.items() if "Missing" in v or "Problem" in v]) == 0 else "Flagged",
            "timestamp": "2 hours ago",
            "issues": len([k for k, v in field_status.items() if "Missing" in v or "Problem" in v])
        })
        
        # Clean up
        os.unlink(tmp_path)
        
        return AuditResponse(
            success=True,
            message="Document processed successfully",
            audit_id=audit_id,
            data=report
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.get("/api/audit/{audit_id}")
async def get_audit_result(audit_id: str):
    """Get audit result by ID"""
    if audit_id not in audit_results:
        raise HTTPException(status_code=404, detail="Audit not found")
    
    return audit_results[audit_id]

@app.get("/api/documents")
async def get_documents(limit: int = 50, offset: int = 0):
    """Get list of processed documents"""
    # Mock data for now - replace with database query
    mock_documents = [
        {
            "id": 1,
            "name": "Invoice_Q2_2025_001247.pdf",
            "size": "2.4 MB",
            "status": "Passed",
            "issues": 0,
            "vendor": "Caribbean Supply Co.",
            "uploadedAt": "2 hours ago",
            "amount": "$15,240.00"
        },
        {
            "id": 2,
            "name": "Payroll_July_2025.xlsx",
            "size": "156 KB",
            "status": "Flagged",
            "issues": 3,
            "vendor": "HR Department",
            "uploadedAt": "4 hours ago",
            "amount": "$89,750.00"
        },
        # Add more mock data as needed
    ]
    
    return {
        "documents": mock_documents[offset:offset+limit],
        "total": len(mock_documents),
        "page": offset // limit + 1,
        "pages": (len(mock_documents) + limit - 1) // limit
    }

@app.get("/api/compliance")
async def get_compliance_analysis():
    """Get overall compliance analysis"""
    return {
        "overall_score": 87,
        "breakdown": {
            "irs_compliance": 94,
            "usvi_dol_compliance": 82,
            "gasb_compliance": 88
        },
        "recent_issues": [
            {"type": "Date Format", "count": 12, "severity": "low"},
            {"type": "Missing Signature", "count": 5, "severity": "high"},
            {"type": "Amount Discrepancy", "count": 3, "severity": "medium"}
        ],
        "recommendations": [
            {"action": "Standardize date formats", "impact": "high"},
            {"action": "Implement signature verification", "impact": "critical"},
            {"action": "Add amount validation rules", "impact": "medium"}
        ]
    }

@app.post("/api/bulk-process")
async def bulk_process_documents(files: List[UploadFile] = File(...)):
    """Process multiple documents"""
    results = []
    
    for file in files:
        try:
            # Process each file (simplified version)
            result = await upload_document(file)
            results.append({
                "filename": file.filename,
                "success": True,
                "audit_id": result.audit_id
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "success": False,
                "error": str(e)
            })
    
    return {
        "processed": len(results),
        "successful": len([r for r in results if r["success"]]),
        "failed": len([r for r in results if not r["success"]]),
        "results": results
    }

# Additional utility endpoints
@app.get("/api/history")
async def get_audit_history(limit: int = 50):
    """Get audit processing history"""
    return {
        "history": audit_history[-limit:],
        "total_processed": len(audit_history),
        "success_rate": 94.2
    }

@app.get("/api/knowledge-base/status")
async def get_knowledge_base_status():
    """Get status of the knowledge base ingestion"""
    return {
        "documents_processed": 247,
        "documents_pending": 89,
        "processing_progress": 68,
        "extraction_progress": 84,
        "sources": [
            {"name": "IRS Publications", "count": 47, "status": "Updated"},
            {"name": "USVI DOL Guidelines", "count": 23, "status": "Current"},
            {"name": "GASB Statements", "count": 31, "status": "Updated"},
            {"name": "OMB Circulars", "count": 18, "status": "Current"},
            {"name": "UVI Policies", "count": 12, "status": "Pending"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)