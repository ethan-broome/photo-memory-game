# Photo Memory Game
> **A date-guessing game built from your photos.**

This project creates a fun, five-round game from your photos folder. Each round displays a random photo and you guess when it was taken — scoring points based on how close you are.
I originally designed this concept after needing to download my Snapchat memories, but this works for any photos folder.

---

## How Does it Work?

Point the project at your photos folder and run the cache builder once. It scans all your photos, extracts timestamps, and saves them to a local JSON file. From there, launch the game and guess the date and time of 5 random photos per session.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Python 3.9+
- npm

### Installation

Clone the repository:
```bash
git clone https://github.com/ethan-broome/photo-memory-game.git
cd photo-memory-game
```

Install frontend dependencies:
```bash
cd frontend
npm install
```

Install backend dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Setup

Open `backend/build_cache.py`  and `backend/app.py` and set `MEMORIES_FOLDER` to the path of your photos folder, then run:
```bash
python build_cache.py
```

This only needs to be run once, or again when you add new photos.

### Running the Application

Start the backend:
```bash
cd backend
source venv/bin/activate
python app.py
```

Start the frontend (in a second terminal):
```bash
cd frontend
npm run dev
```

Then open:
http://localhost:5173

