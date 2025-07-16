import pyaudio
import numpy as np
import openwakeword
import os
import time

# --- Configuration ---

MODEL_PATH = "voice_module.onnx"
CLASS_MAPPING = {
    "0": "go left",
    "1": "go right",
    "2": "go up",
    "3": "go down",
    "4": "fire",
    "5": "triple fire",
    "6": "use shield",
    "7": "stop",
}

# --- Main Application ---

FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
CHUNK_SIZE = 1280  # 80 ms

audio = pyaudio.PyAudio()
mic_stream = audio.open(
    format=FORMAT,
    channels=CHANNELS,
    rate=RATE,
    input=True,
    frames_per_buffer=CHUNK_SIZE,
)

print("Loading openWakeWord model...")
owwModel = openwakeword.Model(
    wakeword_models=[MODEL_PATH],
    class_mapping_dicts=[CLASS_MAPPING],
    inference_framework="onnx",
)

print(f"\nDisplaying live scores...")

if __name__ == "__main__":
    try:
        while True:
            # Read audio from the microphone
            audio_data = np.frombuffer(mic_stream.read(CHUNK_SIZE), dtype=np.int16)

            # Feed the audio to the model
            prediction = owwModel.predict(audio_data)

            # --- NEW: Format and print all scores on one line ---

            # Create a formatted string of the scores dictionary
            # e.g., "{'go left': '0.01', 'go right': '0.02', ...}"
            formatted_scores = {
                word: f"{score:.2f}" for word, score in prediction.items()
            }

            # Print the formatted scores.
            # The `\r` character moves the cursor to the start of the line,
            # so each new print overwrites the last one.
            print(f"Scores: {formatted_scores}", end="\r")

    except KeyboardInterrupt:
        print("\nStopping...")
    finally:
        # Clean up
        mic_stream.stop_stream()
        mic_stream.close()
        audio.terminate()
        print("")  # Print a final newline
