document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            displayJson(jsonData);
            displayIpaLinks(jsonData);
        } catch (error) {
            document.getElementById('jsonDisplay').textContent = 'Invalid JSON file!';
        }
    };

    if (file) {
        reader.readAsText(file);
    }
});

document.getElementById('loadFromUrl').addEventListener('click', function() {
    const url = document.getElementById('urlInput').value;
    if (url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayJson(data);
                displayIpaLinks(data);
            })
            .catch(error => {
                document.getElementById('jsonDisplay').textContent = 'Failed to load JSON from URL!';
                console.error('Error fetching JSON:', error);
            });
    }
});

function displayJson(data) {
    const jsonDisplay = document.getElementById('jsonDisplay');
    jsonDisplay.textContent = JSON.stringify(data, null, 2);  // Pretty-print JSON
}

function displayIpaLinks(jsonData) {
    const downloadSection = document.getElementById('downloadSection');
    const ipaFilesDiv = document.getElementById('ipaFiles');

    // Clear previous download links
    ipaFilesDiv.innerHTML = '';

    // Check if jsonData has any .ipa links
    const ipaFiles = findIpaFiles(jsonData);

    if (ipaFiles.length > 0) {
        downloadSection.style.display = 'block'; // Show download section
        ipaFiles.forEach(fileUrl => {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.textContent = `Download ${fileUrl}`;
            link.classList.add('ipa-link');
            link.download = ''; // Ensure download behavior
            ipaFilesDiv.appendChild(link);
        });
    } else {
        downloadSection.style.display = 'none'; // Hide if no .ipa links
    }
}

// Helper function to recursively find .ipa links
function findIpaFiles(jsonData, result = []) {
    if (typeof jsonData === 'object') {
        for (const key in jsonData) {
            if (typeof jsonData[key] === 'object') {
                findIpaFiles(jsonData[key], result);
            } else if (typeof jsonData[key] === 'string' && jsonData[key].endsWith('.ipa')) {
                result.push(jsonData[key]);
            }
        }
    }
    return result;
}