import numpy as np
import os


def inspect_npy_file(file_path):
    """
    Loads a .npy file and prints information about its contents.

    Args:
        file_path (str): The full path to the .npy file.
    """
    # Check if the file exists
    if not os.path.exists(file_path):
        print(f"Error: The file '{file_path}' was not found.")
        return

    try:
        # Load the data from the .npy file
        print(f"Loading data from '{file_path}'...")
        data = np.load(file_path)
        print("Data loaded successfully.")
        print("-" * 30)

        # Print basic information about the data
        print(f"Shape of the data: {data.shape}")
        print(f"Data type (dtype): {data.dtype}")
        print(f"Total number of elements: {data.size}")
        print(f"Number of dimensions: {data.ndim}")

        # Print a sample of the data
        # This shows the first 5 elements of the first row if it's 2D or more,
        # or just the first 5 elements if it's 1D.
        if data.size > 0:
            print("-" * 30)
            sample = data.flatten()[:5]  # Get the first 5 elements regardless of shape
            print(f"Sample of the first 5 elements: {sample}")
        else:
            print("The file contains an empty array.")

    except Exception as e:
        print(f"An error occurred while loading or inspecting the file: {e}")


if __name__ == "__main__":
    # IMPORTANT: Replace this with the actual path to your .npy file
    path_to_your_file = "voice_module/negative_features_test.npy"

    inspect_npy_file(path_to_your_file)
