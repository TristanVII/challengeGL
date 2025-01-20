Started January 5th.
My own take on https://github.com/gumloop/challenge

# Tech Stack

## Frontend

- React 18 with TypeScript
- Vite for build tooling and development server
- React Flow (@xyflow/react) for interactive node-based UI
- TailwindCSS for styling
- Fingerprint.js for user identification

## Backend

- FastAPI for REST API
- OpenAI API integration for AI responses

## Database

- MongoDB for data persistence
- Allows to easily add different datatypes for a collection

## Infrastructure

- Docker and Docker Compose for containerization
- Nginx as reverse proxy and load balancer
- Bridge network for container communication

## Deployment

- AWS EC2 for hosting (WIP)
- Docker volumes for data persistence
- Environment variables for configuration

# Local Setup Guide (MacOS)

## Prerequisites

- OpenAI API Key
- MongoDB
- Node.js & npm
- Python 3

## Environment Setup

Ideally you could just `docker compose up` and it would just work.
But there some env variables and endpoints that may require to be changed. As im consistently changing stuff, I may forget to update this.

```bash
# Set OpenAI API Key
export OPENAI_API_KEY='your-api-key'

# Clone and setup Python environment
git clone [repository-url]
cd [repository-name]
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Start Backend

```bash
cd application
uvicorn main:app --reload
# Backend runs at http://localhost:8000
```

## Start Frontend

```bash
# In a new terminal
cd react-app
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

## Database Setup

```bash
# Start MongoDB locally
mongod --dbpath /usr/local/var/mongodb
# Connection string in application/main.py:
# mdb = MongoDB("mongodb://localhost:27017/")
```

#### Will be working on getting this deployed
