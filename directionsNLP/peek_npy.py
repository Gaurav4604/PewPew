import numpy as np
import os


def inspect_npy_file(file_path):
    """
    Loads a .npy file and prints detailed information about its contents.

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

        # --- NEW: Explain the shape in more detail ---
        if data.ndim > 1:
            print(f"\nThis shape means you have {data.shape[0]} items (or samples).")
            print(
                f"Each item is a multi-dimensional array with a shape of {data.shape[1:]}."
            )
        else:
            print("\nThis is a 1-dimensional array.")

        # --- NEW: Print a sample of the data, retaining its shape ---
        if data.size > 0:
            print("-" * 30)
            print("Sample of the data:")
            if data.ndim > 1:
                # For multi-dimensional arrays, show the entire first item
                print("Showing the first item (i.e., data[0]):")
                print(data[0], len(data[0]))
                print(f"\nShape of this single item: {data[0].shape}")
            else:
                # For 1D arrays, just show the first 10 elements
                print("Showing the first 10 elements:")
                print(data[:10])
        else:
            print("The file contains an empty array.")

    except Exception as e:
        print(f"An error occurred while loading or inspecting the file: {e}")


if __name__ == "__main__":
    path_to_your_file = "dataset/negative_features_train.npy"

    inspect_npy_file(path_to_your_file)
