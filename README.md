## VentureMap Backend

A multi-step company incorporation system built with FastAPI and PostgreSQL.

### Architecture
- **Language**: Python 3.13
- **ORM**: SQLAlchemy (utilizing Joined Loading for performance)
- **Database**: PostgreSQL
- **Security**: Environment variables via `python-dotenv`

### Safety Measures
- Sensitive credentials (DB URL, Passwords) are stored in `.env` and excluded from version control.
- SQL Injection protection via SQLAlchemy's parameter binding.
- Draft persistence logic to ensure data is saved between form steps.

###  How to Run Tests
1. Ensure PostgreSQL is downloaded and running if you are testing on your own device.
2. Activate venv: `source backend/requirement/bin/activate`
3. Run diagnostic: `python3 backend/main.py`
