document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            handleJsonData(jsonData);  // Updated function to handle various structures
        } catch (error) {
            console.error('Invalid JSON file!');
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
                handleJsonData(data);  // Updated function to handle various structures
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
            });
    }
});

function handleJsonData(data) {
    const appDisplay = document.getElementById('appDisplay');
    appDisplay.innerHTML = '';  // Clear previous content

    // Check if the data is an array of apps (multiple apps case)
    if (Array.isArray(data)) {
        data.forEach(app => {
            createAppCard(app, appDisplay);
        });
    } else if (data.versions) {
        // If there's a `versions` key, loop through the versions (multiple app versions case)
        data.versions.forEach(version => {
            createAppCard({ ...data, ...version }, appDisplay);
        });
    } else {
        // If it's a single app object
        createAppCard(data, appDisplay);
    }
}

function createAppCard(app, appDisplay) {
    const appCard = document.createElement('div');
    appCard.classList.add('app-card');

    const icon = document.createElement('img');
    icon.src = app.iconURL || 'https://via.placeholder.com/100';  // Default image if none provided
    appCard.appendChild(icon);

    const appDetails = document.createElement('div');
    appDetails.classList.add('app-details');

    const appTitle = document.createElement('div');
    appTitle.classList.add('app-title');
    appTitle.textContent = app.name || app.title || 'Unknown App';
    appDetails.appendChild(appTitle);

    const appSubtitle = document.createElement('div');
    appSubtitle.classList.add('app-subtitle');
    appSubtitle.textContent = app.subtitle || 'No subtitle provided';
    appDetails.appendChild(appSubtitle);

    const appDeveloper = document.createElement('div');
    appDeveloper.classList.add('app-developer');
    appDeveloper.textContent = `By: ${app.developerName || 'Unknown Developer'}`;
    appDetails.appendChild(appDeveloper);

    const appDescription = document.createElement('div');
    appDescription.classList.add('app-description');
    appDescription.textContent = app.description || app.localizedDescription || 'No description available';
    appDetails.appendChild(appDescription);

    const appCategory = document.createElement('div');
    appCategory.classList.add('app-category');
    appCategory.textContent = `Category: ${app.category || 'Uncategorized'}`;
    appDetails.appendChild(appCategory);

    const appVersion = document.createElement('div');
    appVersion.classList.add('app-version');
    appVersion.textContent = `Version: ${app.version || 'N/A'} (Updated: ${app.versionDate || 'Unknown Date'})`;
    appDetails.appendChild(appVersion);

    const downloadLink = document.createElement('a');
    downloadLink.href = app.downloadURL;
    downloadLink.classList.add('download-link');
    downloadLink.textContent = 'Download .ipa';
    appDetails.appendChild(downloadLink);

    appCard.appendChild(appDetails);
    appDisplay.appendChild(appCard);
}