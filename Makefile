# ToolHelix — Development Makefile

.PHONY: dev frontend backend install install-py

# Run both services concurrently
dev:
	@echo "Starting ToolHelix dev servers..."
	@start "Frontend" cmd /k "cd frontend && npm run dev"
	@start "Backend"  cmd /k "cd backend && venv\Scripts\uvicorn main:app --reload --port 8000"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:8000"
	@echo "API docs: http://localhost:8000/api/docs"

frontend:
	cd frontend && npm run dev

backend:
	cd backend && venv\Scripts\uvicorn main:app --reload --port 8000

install:
	cd frontend && npm install

install-py:
	cd backend && python -m venv venv && venv\Scripts\pip install -r requirements.txt
