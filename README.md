# Music Streaming Platform

A modern music streaming platform with special features including explicit content filtering and song recognition.

## Features

- 🎵 Music streaming and playback
- 🔍 Advanced search functionality
- 🎧 Playlist creation and management
- 🚫 Explicit content filtering
- 📱 Mobile responsive design
- 🎵 Song recognition (Shazam integration)
- 👤 User profiles and authentication

## Prerequisites

- Python 3.8 or higher
- CUDA-compatible GPU (recommended for AI features)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourboyangel/GraduationProject.git
cd GraduationProject/music-streaming
npm i

```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```


## Running the Application

1. Start the development server:
```bash
# Navigate to the music-streaming directory
cd GraduationProject/music-streaming
npm run dev

# Activate the venv and navigate to the censorship directory
venv\Scripts\activate
cd GraduationProject/censorship
python app.py
```

2. Open your browser and navigate to `http://localhost:5000`

## Project Structure
GraduationProject/
├── music-streaming/ # Main website application code
├── censorship/ # Content censoring implementation
└── README.md # This file

venv/ #Should be created by the user


## Acknowledgments

- OpenAI Whisper for speech recognition and transcription
- Supabase database for user authentication and music streaming
- AudD API for song recognition



