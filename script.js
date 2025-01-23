document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            displayApps(jsonData);  // Updated to handle multiple apps
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
                displayApps(data);  // Updated to handle multiple apps
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
            });
    }
});

function displayApps(data) {
    const appDisplay = document.getElementById('appDisplay');
    appDisplay.innerHTML = '';  // Clear previous content

    // If the JSON is an array, loop through each item
    if (Array.isArray(data)) {
        data.forEach(app => {
            createAppCard(app, appDisplay);
        });
    } else {
        // Handle single app object
        createAppCard(data, appDisplay);
    }
}

function createAppCard(app, appDisplay) {
    const appCard = document.createElement('div');
    appCard.classList.add('app-card');

    const icon = document.createElement('img');
    icon.src = app.iconURL;
    appCard.appendChild(icon);

    const appDetails = document.createElement('div');
    appDetails.classList.add('app-details');

    const appTitle = document.createElement('div');
    appTitle.classList.add('app-title');
    appTitle.textContent = app.name || app.title;
    appDetails.appendChild(appTitle);

    const appSubtitle = document.createElement('div');
    appSubtitle.classList.add('app-subtitle');
    appSubtitle.textContent = app.subtitle;
    appDetails.appendChild(appSubtitle);

    const appDeveloper = document.createElement('div');
    appDeveloper.classList.add('app-developer');
    appDeveloper.textContent = `By: ${app.developerName}`;
    appDetails.appendChild(appDeveloper);

    const appDescription = document.createElement('div');
    appDescription.classList.add('app-description');
    appDescription.textContent = app.description || app.localizedDescription;
    appDetails.appendChild(appDescription);

    const appCategory = document.createElement('div');
    appCategory.classList.add('app-category');
    appCategory.textContent = `Category: ${app.category}`;
    appDetails.appendChild(appCategory);

    const appVersion = document.createElement('div');
    appVersion.classList.add('app-version');
    appVersion.textContent = `Version: ${app.version} (Updated: ${app.versionDate})`;
    appDetails.appendChild(appVersion);

    const downloadLink = document.createElement('a');
    downloadLink.href = app.downloadURL;
    downloadLink.classList.add('download-link');
    downloadLink.textContent = 'Download .ipa';
    appDetails.appendChild(downloadLink);

    appCard.appendChild(appDetails);
    appDisplay.appendChild(appCard);
}