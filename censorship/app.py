from flask import Flask, request, send_file, render_template
import os
from pydub import AudioSegment
import whisper
import torch

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Load Whisper model with GPU support
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")
model = whisper.load_model("small", device=device)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        print("Error: No file uploaded")
        return "No file uploaded", 400
    file = request.files['file']
    if file.filename == '':
        print("Error: No file selected")
        return "No file selected", 400
    
    input_path = os.path.join(UPLOAD_FOLDER, file.filename)
    print(f"Saving file to: {input_path}")
    file.save(input_path)
    
    output_path = process_audio(input_path)
    print(f"Returning cleaned file: {output_path}")
    return send_file(output_path, as_attachment=True)

def process_audio(input_path):
    print(f"Processing audio: {input_path}")
    
    # Load and convert audio
    audio = AudioSegment.from_mp3(input_path)
    wav_path = input_path.replace(".mp3", ".wav")
    print(f"Converted to WAV: {wav_path}")
    audio.export(wav_path, format="wav")

    # Transcribe with Whisper
    print("Starting transcription...")
    result = model.transcribe(wav_path, language="en")
    
    # Print transcription details
    print(f"Full transcription: '{result['text']}'")
    
    # Only look for "fuck" and "shit"
    explicit_words = ["fuck", "shit","strippers"]
    print(f"Looking for explicit words: {explicit_words}")
    word_timestamps = []

    # Process segments
    for segment in result["segments"]:
        text = segment["text"].lower()
        start = segment["start"] * 1000
        end = segment["end"] * 1000
        print(f"Segment: '{text}' | Start: {start/1000:.2f}s | End: {end/1000:.2f}s")
        
        # Split words, removing punctuation
        words = [word.strip(".,!?") for word in text.split()]
        segment_duration = (end - start) / len(words) if words else 0
        
        for i, word in enumerate(words):
            if word in explicit_words:
                word_start = start + (i * segment_duration)
                word_end = word_start + segment_duration
                # Add a buffer (e.g., 100ms before and after) to ensure full word is muted
                buffer = 100  # milliseconds
                buffered_start = max(0, word_start - buffer)  # Avoid negative start
                buffered_end = min(len(audio), word_end + buffer)  # Avoid exceeding audio length
                word_timestamps.append((buffered_start, buffered_end))
                print(f"Found explicit word: '{word}' | Original: {word_start/1000:.2f}s - {word_end/1000:.2f}s | Buffered: {buffered_start/1000:.2f}s - {buffered_end/1000:.2f}s")

    # Print if no explicit words found
    if not word_timestamps:
        print("No explicit words detected in the transcription")

    # Mute explicit sections
    for start, end in word_timestamps:
        print(f"Muting from {start/1000:.2f}s to {end/1000:.2f}s")
        mute_segment = AudioSegment.silent(duration=end - start)
        try:
            audio = audio[:start] + mute_segment + audio[end:]
        except Exception as e:
            print(f"Error muting audio: {e}")

    # Export and clean up
    output_path = os.path.join(OUTPUT_FOLDER, "cleaned_" + os.path.basename(input_path))
    print(f"Exporting cleaned audio to: {output_path}")
    audio.export(output_path, format="mp3")
    os.remove(wav_path)
    
    return output_path

if __name__ == '__main__':
    app.run(debug=True)