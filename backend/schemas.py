from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from models import IncorporationStatus

# --- Shareholder Schemas ---
class ShareholderBase(BaseModel):
    first_name: str
    last_name: str
    nationality: str

class ShareholderCreate(ShareholderBase):
    pass

class ShareholderResponse(ShareholderBase):
    id: int
    company_id: int

    class Config:
        from_attributes = True

# --- Company Schemas ---
class CompanyBase(BaseModel):
    name: str
    shareholder_count: int = Field(..., gt=0, description="Must have at least 1 shareholder")
    total_capital: Decimal

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    shareholder_count: Optional[int] = Field(None, gt=0)
    total_capital: Optional[Decimal] = None

class CompanyResponse(CompanyBase):
    id: int
    status: IncorporationStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    shareholders: List[ShareholderResponse] = []

    class Config:
        from_attributes = True