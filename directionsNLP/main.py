import asyncio
import websockets
import numpy as np
import openwakeword
import pyaudio
import os

# --- Configuration ---
MODELS = {
    "go left": "voice_module_go_left.onnx",
    "go right": "voice_module_go_right.onnx",
    "single fire": "voice_module_shoot_missile.onnx",
}
DETECTION_THRESHOLD = 0.6
DEBOUNCE_SECONDS = 0.5
WEBSOCKET_PORT = 8765  # Port for the WebSocket server

MODELS_TO_ACTIONS = {
    os.path.splitext(os.path.basename(v))[0]: k for k, v in MODELS.items()
}

# --- Audio Stream Setup ---
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
CHUNK_SIZE = 2000

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
model_paths = [path for path in MODELS.values() if os.path.exists(path)]
if len(model_paths) != len(MODELS):
    print("Warning: One or more model files were not found.")

oww_model = openwakeword.Model(wakeword_models=model_paths, inference_framework="onnx")
threshold_dict = {
    os.path.splitext(os.path.basename(path))[0]: DETECTION_THRESHOLD
    for path in model_paths
}

# --- WebSocket Server Logic ---
# Keep track of connected clients
connected_clients = set()


async def register(websocket):
    """Adds a new client to the set of connected clients."""
    print(f"Electron client connected from {websocket.remote_address}")
    connected_clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        print(f"Electron client disconnected.")
        connected_clients.remove(websocket)


async def broadcast_command(command):
    """Sends a command to all connected clients."""
    if connected_clients:
        # Create a list of tasks to send messages concurrently
        tasks = [client.send(command) for client in connected_clients]
        await asyncio.gather(*tasks)


async def voice_listener():
    """Listens for voice commands and broadcasts them."""
    print(f"WebSocket server started on ws://localhost:{WEBSOCKET_PORT}")
    print(f"Listening for wake words... (Debounce time: {DEBOUNCE_SECONDS}s)")
    while True:
        audio_data = np.frombuffer(
            mic_stream.read(CHUNK_SIZE, exception_on_overflow=False), dtype=np.int16
        )
        prediction = oww_model.predict(
            audio_data, threshold=threshold_dict, debounce_time=DEBOUNCE_SECONDS
        )

        for model_name, score in prediction.items():  # type: ignore
            python_score = float(score)
            if python_score > DETECTION_THRESHOLD:
                detected_action = MODELS_TO_ACTIONS[model_name]
                print(f"Detected: '{detected_action}' -> Sending to game.")
                await broadcast_command(detected_action)

        # Allow other tasks to run
        await asyncio.sleep(0.01)


async def main():
    """Starts the WebSocket server and the voice listener."""
    server = await websockets.serve(register, "localhost", WEBSOCKET_PORT)
    await voice_listener()
    await server.wait_closed()


# --- Main Application Loop ---
if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nStopping...")
    finally:
        print("Cleaning up resources.")
        mic_stream.stop_stream()
        mic_stream.close()
        audio.terminate()
        print("")
