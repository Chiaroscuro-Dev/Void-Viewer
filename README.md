# Void

Void is a web-based repository viewer for JSON files, allowing users to upload or link to a JSON repository and view it in a structured format. It also detects `.ipa` files within the JSON and provides direct download links.

This project is hosted at: **[https://void.zigwangles.xyz](https://void.zigwangles.xyz)**

## Features

- **Upload JSON File**: Upload a JSON file directly from your computer.
- **Load JSON from URL**: Input a raw JSON URL to fetch and view the data.
- **Display JSON Data**: View JSON content in a human-readable, formatted manner.
- **Download `.ipa` Files**: Automatically finds and displays `.ipa` links in the JSON, allowing users to download them.

## Live Demo

You can access the live version of this project at **[https://void.zigwangles.xyz](https://void.zigwangles.xyz)**.

## Usage

1. Navigate to **[https://void.zigwangles.xyz](https://void.zigwangles.xyz)**.
2. **To view a JSON file**:
    - **Option 1: Upload a File**: Click on the "Choose File" button to upload a `.json` file from your device.
    - **Option 2: Load from URL**: Enter a link to a raw JSON file in the input field, then click "Load JSON from URL."
3. **To download `.ipa` files**:
    - If the JSON contains `.ipa` file URLs, download links will automatically appear. Click on the link to download the `.ipa` file.

## Project Structure

├── index.html        # Main webpage layout.
├── styles.css        # Styling for the webpage.
└── script.js         # JavaScript for handling file uploads, URL fetching, and .ipa file detection.

## How It Works

1. **Upload JSON File**: 
   - The user can upload a JSON file using the file input element. The file is read and parsed using `FileReader`.
2. **Load JSON from URL**: 
   - If the user provides a URL, the JSON file is fetched from the web using the `fetch` API.
3. **Display JSON Data**: 
   - The JSON data is formatted and displayed in a readable format using `JSON.stringify()` for proper indentation.
4. **Download `.ipa` Files**: 
   - The script recursively searches the JSON for any file URLs ending in `.ipa` and displays clickable download links.

## Requirements

- A modern web browser (e.g., Chrome, Firefox, Safari, Edge) with JavaScript enabled.

## Future Enhancements

- Ability to edit and save JSON files directly in the browser.
- Improved validation for JSON URLs and file types.
- Support for additional file types (e.g., `.apk`, `.zip`).

## Contributing

Contributions are welcome! To contribute:
1. Fork this repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Added a new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE. See the `LICENSE` file for more details.