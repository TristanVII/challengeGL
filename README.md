Started January 5th.
My own take on https://github.com/gumloop/challenge


# Local Setup Guide (MacOS)

## Prerequisites
- OpenAI API Key
- MongoDB
- Node.js & npm
- Python 3

## Environment Setup
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
