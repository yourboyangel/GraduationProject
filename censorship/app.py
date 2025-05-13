from flask import Flask, request, send_file, render_template
import os
from pydub import AudioSegment
import whisper
import torch
import requests
import string
import warnings

# Suppress the specific Triton warning
warnings.filterwarnings("ignore", message="Failed to launch Triton kernels.*")


app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Load Whisper model with GPU support
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Whisper model configuration
model = whisper.load_model("tiny", device=device)

# RapidAPI configuration
API_KEY = "d0c1e7f61bmsh34c22e660620feep10b4f5jsn286b58df7347"  # Please replace with your actual RapidAPI key
API_HOST = "neutrinoapi-bad-word-filter.p.rapidapi.com"
API_URL = "https://neutrinoapi-bad-word-filter.p.rapidapi.com/bad-word-filter"

def fetch_bad_words(text):
    """
    Fetches bad words from the NeutrinoAPI Bad Word Filter.
    Args:
        text (str): The text to scan for bad words.
    Returns:
        list: A list of unique bad words found, or an empty list if none are found or an error occurs.
    """
    headers = {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "content": text,
        "censor-character": "*"  # Character used for censoring by the API
    }
    try:
        response = requests.post(API_URL, headers=headers, data=data)
        response.raise_for_status()  # Raise an exception for HTTP errors
        api_data = response.json()
        is_bad = api_data.get("is-bad", False)
        if is_bad:
            censored_text = api_data.get("censored-content", text)
            words = text.lower().split()
            censored_words = censored_text.lower().split()

            # Identify words that were changed (i.e., censored)
            bad_words_detected = [
                word.strip(string.punctuation)
                for word, cword in zip(words, censored_words)
                if word != cword and "*" in cword  # Check if word was altered and contains censor char
            ]
            bad_words_detected = list(set(bad_words_detected))  # Deduplicate
            print(f"Fetched bad words from API: {bad_words_detected}")
            return bad_words_detected
        return []
    except requests.exceptions.RequestException as e:
        print(f"Error fetching bad words from API: {e}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred in fetch_bad_words: {e}")
        return []

@app.route('/')
def index():
    """Serves the main HTML page."""
    # Ensure you have an 'index.html' in a 'templates' folder
    # in the same directory as your app.py
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handles file uploads, processes audio, and returns the cleaned file."""
    if 'file' not in request.files:
        print("Error: No file part in request")
        return "No file part in request", 400
    file = request.files['file']
    if file.filename == '':
        print("Error: No file selected")
        return "No file selected", 400

    # Ensure the filename is safe
    filename = "".join(c for c in file.filename if c.isalnum() or c in ['.', '_', '-']).strip()
    if not filename:
        print("Error: Invalid filename")
        return "Invalid filename", 400
        
    input_path = os.path.join(UPLOAD_FOLDER, filename)
    print(f"Saving file to: {input_path}")
    try:
        file.save(input_path)
    except Exception as e:
        print(f"Error saving file: {e}")
        return "Error saving file", 500

    try:
        output_path = process_audio(input_path)
        print(f"Returning cleaned file: {output_path}")
        return send_file(output_path, as_attachment=True)
    except Exception as e:
        print(f"Error processing audio: {e}")
        # Clean up uploaded file if processing fails
        if os.path.exists(input_path):
            os.remove(input_path)
        return "Error processing audio", 500

def process_audio(input_path):
    """
    Processes the audio file: transcribes, detects bad words, and mutes them.
    Args:
        input_path (str): The path to the input audio file (MP3).
    Returns:
        str: The path to the cleaned audio file (MP3).
    """
    print(f"Processing audio: {input_path}")

    # Load and convert audio to WAV for Whisper
    try:
        audio = AudioSegment.from_file(input_path)  # Use from_file for broader format support
    except Exception as e:
        print(f"Error loading audio file {input_path} with pydub: {e}")
        raise  # Re-raise the exception to be caught by the caller

    # Define WAV path
    base, ext = os.path.splitext(input_path)
    wav_path = base + ".wav"

    try:
        print(f"Converting to WAV: {wav_path}")
        audio.export(wav_path, format="wav")
    except Exception as e:
        print(f"Error exporting to WAV: {e}")
        raise

    # Transcribe with Whisper, enabling word timestamps
    print("Starting transcription with word timestamps...")
    try:
        # Enable word timestamps in the transcription options
        result = model.transcribe(
            wav_path, 
            language="en",
            word_timestamps=True,  # Enable word-level timestamps
            verbose=False  # Set to True for more detailed output during transcription
        )
    except Exception as e:
        print(f"Error during transcription: {e}")
        if os.path.exists(wav_path):  # Clean up WAV file
            os.remove(wav_path)
        raise
        
    print(f"Full transcription: '{result['text']}'")

    # Fetch bad words based on transcription
    explicit_words = fetch_bad_words(result["text"])
    if not explicit_words:
        print("No bad words detected by API, or API error. Skipping censorship.")
        if os.path.exists(wav_path):  # Clean up WAV file
            os.remove(wav_path)
        # Return original MP3 if no bad words or if API failed
        return input_path 

    print(f"Explicit words to censor: {explicit_words}")
    word_timestamps = []

    # Process word timestamps to find explicit words
    for segment in result.get("segments", []):
        # Check if word-level data is available
        if "words" in segment:
            for word_data in segment["words"]:
                word = word_data.get("word", "").lower().strip(string.punctuation)
                # Some Whisper versions might include leading spaces in words
                word = word.strip()
                
                if word in explicit_words:
                    start_time_ms = int(word_data["start"] * 1000)  # Convert to ms
                    end_time_ms = int(word_data["end"] * 1000)      # Convert to ms
                    
                    # Add a buffer around the word for better censoring
                    buffer_ms = 200  # Buffer in milliseconds
                    buffered_start_ms = max(0, start_time_ms - buffer_ms)
                    buffered_end_ms = min(len(audio), end_time_ms + buffer_ms)
                    
                    word_timestamps.append((buffered_start_ms, buffered_end_ms))
                    print(f"Found explicit word: '{word}' | Exact time: {start_time_ms/1000:.2f}s - {end_time_ms/1000:.2f}s")
                    print(f"With buffer: {buffered_start_ms/1000:.2f}s - {buffered_end_ms/1000:.2f}s")

    if not word_timestamps:
        print("No explicit words matched with timestamps.")
        if os.path.exists(wav_path):  # Clean up WAV file
            os.remove(wav_path)
        return input_path  # Return original if no words to mute

    # Merge overlapping/adjacent mute intervals for efficiency
    if word_timestamps:
        word_timestamps.sort()
        merged_timestamps = [word_timestamps[0]]
        for current_start, current_end in word_timestamps[1:]:
            prev_start, prev_end = merged_timestamps[-1]
            if current_start <= prev_end + 100:  # Overlap or adjacent (with small tolerance)
                merged_timestamps[-1] = (prev_start, max(prev_end, current_end))
            else:
                merged_timestamps.append((current_start, current_end))
        word_timestamps = merged_timestamps
        print(f"Merged mute timestamps: {[(s/1000, e/1000) for s, e in word_timestamps]}")

    # Apply mutes (create silent segments)
    processed_audio = AudioSegment.empty()
    current_pos_ms = 0

    for start_mute_ms, end_mute_ms in sorted(word_timestamps):  # Ensure they are sorted
        start_mute_ms = int(start_mute_ms)  # Ensure integer for slicing
        end_mute_ms = int(end_mute_ms)

        # Add audio before the mute
        if start_mute_ms > current_pos_ms:
            processed_audio += audio[current_pos_ms:start_mute_ms]
        
        # Add silence for the duration of the mute
        mute_duration_ms = end_mute_ms - start_mute_ms
        if mute_duration_ms > 0:
            print(f"Muting from {start_mute_ms/1000:.2f}s to {end_mute_ms/1000:.2f}s (Duration: {mute_duration_ms/1000:.2f}s)")
            processed_audio += AudioSegment.silent(duration=mute_duration_ms)
        
        current_pos_ms = end_mute_ms

    # Add remaining audio after the last mute
    if current_pos_ms < len(audio):
        processed_audio += audio[current_pos_ms:]

    audio = processed_audio  # Replace original audio with processed one

    # Export cleaned audio
    output_filename = "cleaned_" + os.path.basename(input_path)
    # Ensure output retains original extension if not mp3, or force mp3
    base_output_name, _ = os.path.splitext(output_filename)
    output_path_mp3 = os.path.join(OUTPUT_FOLDER, base_output_name + ".mp3")

    print(f"Exporting cleaned audio to: {output_path_mp3}")
    try:
        audio.export(output_path_mp3, format="mp3")
    except Exception as e:
        print(f"Error exporting cleaned MP3: {e}")
        if os.path.exists(wav_path):  # Clean up WAV file
            os.remove(wav_path)
        raise

    # Clean up temporary WAV file
    if os.path.exists(wav_path):
        os.remove(wav_path)

    return output_path_mp3

if __name__ == '__main__':
    # For development, debug=True is fine.
    # For production, use a proper WSGI server like Gunicorn or Waitress.
    app.run(debug=True, host='0.0.0.0', port=5000)