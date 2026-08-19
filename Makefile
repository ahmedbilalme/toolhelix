# ToolHelix — Development Makefile

.PHONY: dev frontend backend install install-py

# Run both services concurrently (backgrounds both, Ctrl+C kills them)
dev:
	@echo "Starting ToolHelix dev servers..."
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:8000"
	@echo "API docs: http://localhost:8000/api/docs"
	@trap 'kill 0' EXIT; \
	(cd frontend && npm run dev) & \
	(cd backend && venv/bin/uvicorn main:app --reload --port 8000) & \
	wait

frontend:
	cd frontend && npm run dev

backend:
	cd backend && venv/bin/uvicorn main:app --reload --port 8000

install:
	cd frontend && npm install

install-py:
	cd backend && python3 -m venv venv && venv/bin/pip install -r requirements.txt
