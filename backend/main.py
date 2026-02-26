from sqlalchemy.orm import Session, joinedload
from database import SessionLocal
import models


def get_all_companies():
    
    db = SessionLocal()
    try:
        companies = db.query(models.Company).options(
            joinedload(models.Company.shareholders)
        ).all()

        for company in companies:
            print(f"Company: {company.name} | Status: {company.status} ")
            for s in company.shareholders:
                print(f" - Shareholder: {s.first_name} {s.last_name}")
    finally:
        db.close()


if __name__ == "__main__":
    get_all_companies()