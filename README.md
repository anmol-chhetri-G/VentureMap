# VentureMap - Company Incorporation Tool

A full-stack application for company incorporation featuring a multi-step form with draft persistence and an admin dashboard. Built for the technical assessment.

## 🚀 Features Completed

* **Multi-Step Form:** Dynamically generates shareholder inputs based on the number of shareholders specified in Step 1.
* **Draft Persistence:** Drafts survive page refreshes via `localStorage` and backend API hydration, ensuring zero data loss for the user.
* **Admin Dashboard:** A clean overview of all incorporated companies, their statuses, and their nested shareholders.
* **Fully Dockerized:** The entire stack—Database, API, and Frontend—runs seamlessly in isolated containers.

## 🛠️ Tech Stack

* **Backend:** FastAPI (Python), PostgreSQL, SQLAlchemy, Pydantic
* **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, React Router
* **Infrastructure:** Docker & Docker Compose

---

## Architecture & Approach

Our primary goal was to ensure strict type safety and a clean separation of concerns across the entire stack.

### System Design

The application follows a standard Three-Tier Architecture:

1. **Presentation Tier:** React SPA served via Nginx.
2. **Logic Tier:** FastAPI REST server handling validation and business logic.
3. **Data Tier:** PostgreSQL for persistent storage.

### Frontend Strategy

We isolated the API logic from the UI components:

* `src/api/client.ts`: Contains a dedicated Axios instance that handles all backend communication.
* `src/types/index.ts`: Mirrors the backend Pydantic schemas to ensure 100% end-to-end type safety.
* **Persistence Logic:** Handled by orchestrating state in a parent page (`IncorporationForm.tsx`). When the component mounts, it checks `localStorage` for an existing draft ID and automatically hydrates the child components via the API.

### Backend Strategy

The backend follows standard RESTful principles:

* **Pydantic Schemas:** Used for strict request/response validation.
* **SQLAlchemy Models:** Defines the One-to-Many relationship between Companies and Shareholders.
* **Auto-Initialization:** The database is automatically initialized and tables are generated via SQLAlchemy metadata when the Docker container boots up.

---

## 📁 Folder Structure

```text
VentureMap/
├── docker-compose.yml       # Orchestrates DB, Backend, and Frontend
├── backend/
│   ├── Dockerfile           # Python 3.11 build instructions
│   ├── main.py              # FastAPI application and route endpoints
│   ├── database.py          # PostgreSQL connection setup
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic validation schemas
│   └── requirements.txt
└── frontend/
    ├── Dockerfile           # Multi-stage build (Node -> Nginx)
    ├── vite.config.ts       # Vite & Tailwind v4 configuration
    ├── package.json
    └── src/
        ├── api/
        │   └── client.ts    # Centralized Axios API client
        ├── types/
        │   └── index.ts     # TypeScript interfaces
        ├── components/
        │   ├── StepOne.tsx  # Company draft form
        │   ├── StepTwo.tsx  # Dynamic shareholder form
        │   └── ProgressBar.tsx 
        ├── pages/
        │   ├── IncorporationForm.tsx # State orchestration
        │   └── AdminPage.tsx         # Dashboard view
        ├── App.tsx          # React Router setup
        └── main.tsx         # Entry point

```

---

## 🐳 How to Run (Recommended: Docker)

This project is fully containerized. You do not need Python or Node.js installed locally.

1. Ensure **Docker Desktop** is running.
2. Open a terminal in the root directory.
3. Run the following command:
```bash
docker-compose up --build

```


4. **Access the App:**
* **Frontend / UI:** [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)
* **Backend API Docs:** [http://localhost:8000/docs](https://www.google.com/search?q=http://localhost:8000/docs)



*(Note: The PostgreSQL database will automatically initialize and build the required tables upon startup).*

---

## 💻 How to Run (Manual Local Setup)

If you prefer to run the application without Docker, follow these steps:

### 1. Backend Setup

1. Navigate to the backend directory: `cd backend`
2. Create and activate a virtual environment:
* Windows: `python -m venv .venv` then `.\.venv\Scripts\activate`
* Mac/Linux: `python3 -m venv .venv` then `source .venv/bin/activate`


3. Install dependencies: `pip install -r requirements.txt`
4. Set up a local PostgreSQL database and create a `.env` file:
`DATABASE_URL=postgresql://user:password@localhost:5432/venturemap`
5. Start the API: `uvicorn main:app --reload`

### 2. Frontend Setup

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
4. Open your browser to [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)

---
