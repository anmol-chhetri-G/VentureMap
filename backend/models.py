from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

# Define the status options for Draft Persistence [cite: 56]
class IncorporationStatus(enum.Enum):
    draft = "draft"
    complete = "complete"

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False) # Requirement: Company Name [cite: 21]
    shareholder_count = Column(Integer, default=0) # Requirement: Number of Shareholders [cite: 22]
    total_capital = Column(Numeric(10, 2), default=0.00) # Requirement: Total Capital [cite: 23]
    status = Column(Enum(IncorporationStatus), default=IncorporationStatus.draft) # Requirement: Draft Saved 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # One-to-Many Relationship: One company can have multiple shareholders [cite: 52]
    shareholders = relationship("Shareholder", back_populates="company", cascade="all, delete-orphan")

class Shareholder(Base):
    __tablename__ = "shareholders"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False) # Requirement: First Name [cite: 28]
    last_name = Column(String, nullable=False) # Requirement: Last Name [cite: 29]
    nationality = Column(String, nullable=False) # Requirement: Nationality [cite: 30]
    
    # Foreign Key linking to the Company 
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"))
    
    company = relationship("Company", back_populates="shareholders")