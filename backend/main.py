from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from typing import List

import models, schemas
from database import SessionLocal, engine

# Create tables in the DB
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Company Incorporation API")

# Configure CORS for React frontend (Vite defaults to 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ENDPOINTS ---

@app.post("/companies", response_model=schemas.CompanyResponse)
def create_company_draft(company: schemas.CompanyCreate, db: Session = Depends(get_db)):
    """Step 1: Create a new company draft."""
    db_company = models.Company(**company.model_dump())
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

@app.patch("/companies/{company_id}", response_model=schemas.CompanyResponse)
def update_company_draft(company_id: int, company_update: schemas.CompanyUpdate, db: Session = Depends(get_db)):
    """Update an existing company draft (e.g., user comes back and edits Step 1)."""
    db_company = db.query(models.Company).filter(models.Company.id == company_id).first()
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    update_data = company_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_company, key, value)
        
    db.commit()
    db.refresh(db_company)
    return db_company

@app.post("/companies/{company_id}/shareholders", response_model=List[schemas.ShareholderResponse])
def add_shareholders(company_id: int, shareholders: List[schemas.ShareholderCreate], db: Session = Depends(get_db)):
    """Step 2: Save shareholders and mark incorporation as complete."""
    db_company = db.query(models.Company).filter(models.Company.id == company_id).first()
    
    if not db_company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    if len(shareholders) != db_company.shareholder_count:
        raise HTTPException(
            status_code=400, 
            detail=f"Expected {db_company.shareholder_count} shareholders, got {len(shareholders)}"
        )
    
    db_shareholders = []
    for s in shareholders:
        new_shareholder = models.Shareholder(**s.model_dump(), company_id=company_id)
        db.add(new_shareholder)
        db_shareholders.append(new_shareholder)
    
    # Mark status as complete
    db_company.status = models.IncorporationStatus.complete
    db.commit()
    
    for s in db_shareholders:
        db.refresh(s)
        
    return db_shareholders

@app.get("/companies", response_model=List[schemas.CompanyResponse])
def get_all_companies(db: Session = Depends(get_db)):
    """Admin endpoint: Retrieve all companies with their shareholders."""
    return db.query(models.Company).options(joinedload(models.Company.shareholders)).all()

@app.get("/companies/{company_id}", response_model=schemas.CompanyResponse)
def get_company(company_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific company and its shareholders."""
    company = db.query(models.Company).options(joinedload(models.Company.shareholders)).filter(models.Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company
