import pyaudio
import numpy as np
import openwakeword
import os

# --- Configuration ---

MODELS = {
    "go left": "voice_module_go_left.onnx",
    "go right": "voice_module_go_right.onnx",
    "go up": "voice_module_go_up.onnx",
    "go down": "voice_module_go_down.onnx",
    "fire": "voice_module_fire.onnx",
    "triple fire": "voice_module_triple_fire.onnx",
    "use shield": "voice_module_use_shield.onnx",
    "stop": "voice_module_stop.onnx",
}

DETECTION_THRESHOLD = 0.8
DEBOUNCE_SECONDS = 1  # How long to wait after a detection before allowing another

# Create a reverse mapping to get friendly action names from model names
MODELS_TO_ACTIONS = {
    os.path.splitext(os.path.basename(v))[0]: k for k, v in MODELS.items()
}

# --- Audio Stream Setup ---

FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
CHUNK_SIZE = 1280  # 80 ms of audio

audio = pyaudio.PyAudio()
mic_stream = audio.open(
    format=FORMAT,
    channels=CHANNELS,
    rate=RATE,
    input=True,
    frames_per_buffer=CHUNK_SIZE,
)

# --- Model Loading ---

print("Loading openWakeWord models...")

# Get a list of all model paths to load into one instance
model_paths = [path for path in MODELS.values() if os.path.exists(path)]
if len(model_paths) != len(MODELS):
    print("Warning: One or more model files were not found.")

# Create a SINGLE openwakeword model instance for all wake words
oww_model = openwakeword.Model(wakeword_models=model_paths, inference_framework="onnx")

# Create the threshold dictionary, keyed by the model names (e.g., "voice_module_go_left")
threshold_dict = {
    os.path.splitext(os.path.basename(path))[0]: DETECTION_THRESHOLD
    for path in model_paths
}

print(f"\nListening for wake words... (Debounce time: {DEBOUNCE_SECONDS}s)")

# --- Main Application Loop ---

if __name__ == "__main__":
    try:
        while True:
            audio_data = np.frombuffer(
                mic_stream.read(CHUNK_SIZE, exception_on_overflow=False), dtype=np.int16
            )

            # Call predict() ONCE with debounce_time and the threshold dictionary
            prediction = oww_model.predict(
                audio_data, threshold=threshold_dict, debounce_time=DEBOUNCE_SECONDS
            )

            # Check the results for any non-zero scores
            for model_name, score in prediction.items():
                # --- YOUR FIX APPLIED HERE ---
                # Explicitly cast the numpy.float32 to a standard Python float before comparison
                python_score = float(score)
                # print(python_score > 0, python_score)
                if python_score > DETECTION_THRESHOLD:  # This check is now robust
                    # Get the friendly action name
                    detected_action = MODELS_TO_ACTIONS[model_name]
                    print(f"Detected: '{detected_action}' (Score: {python_score:.2f})")

    except KeyboardInterrupt:
        print("\nStopping...")
    finally:
        print("Cleaning up resources.")
        mic_stream.stop_stream()
        mic_stream.close()
        audio.terminate()
        print("")
