let jsonData = [];  // Global variable to store loaded JSON data

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            jsonData = JSON.parse(e.target.result);
            processRepository(jsonData);  // Process the JSON repository
        } catch (error) {
            console.error('Invalid JSON file!', error);
        }
    };

    if (file) {
        reader.readAsText(file);
    }
});

// Use CORS proxy to load JSON from external URLs that have CORS restrictions
document.getElementById('loadFromUrl').addEventListener('click', function() {
    const url = document.getElementById('urlInput').value;
    if (url) {
        // Use a CORS proxy to bypass CORS restrictions
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        const proxyUrl = corsProxy + url;

        fetch(proxyUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                jsonData = data;
                processRepository(jsonData);  // Process the JSON repository
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
            });
    }
});

document.getElementById('categoryFilter').addEventListener('change', function() {
    const selectedCategory = this.value;
    filterAppsByCategory(selectedCategory);
});

document.getElementById('searchButton').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    searchApps(searchTerm);
});

// Process the repository based on structure
function processRepository(repo) {
    let apps = [];

    // Check for "apps" key in the JSON
    if (repo.apps && Array.isArray(repo.apps)) {
        apps = repo.apps;
    } else {
        console.error('Invalid repository structure.');
        return;
    }

    displayApps(apps);
    populateCategoryFilter(apps);
}

function displayApps(apps) {
    const appDisplay = document.getElementById('appDisplay');
    appDisplay.innerHTML = '';  // Clear previous content

    apps.forEach(app => {
        createAppCard(app, appDisplay);  // Display each app
    });
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
    appTitle.textContent = app.name || 'Unknown App';
    appDetails.appendChild(appTitle);

    const appSubtitle = document.createElement('div');
    appSubtitle.classList.add('app-subtitle');
    appSubtitle.textContent = app.localizedDescription || 'No description provided';
    appDetails.appendChild(appSubtitle);

    const appDeveloper = document.createElement('div');
    appDeveloper.classList.add('app-developer');
    appDeveloper.textContent = `By: ${app.developerName || 'Unknown Developer'}`;
    appDetails.appendChild(appDeveloper);

    const appCategory = document.createElement('div');
    appCategory.classList.add('app-category');
    appCategory.textContent = `Category: ${app.category || 'Uncategorized'}`;
    appDetails.appendChild(appCategory);

    const appVersion = document.createElement('div');
    appVersion.classList.add('app-version');
    appVersion.textContent = `Version: ${app.version || 'N/A'} (Updated: ${app.versionDate || 'Unknown Date'})`;
    appDetails.appendChild(appVersion);

    if (app.screenshotURLs && app.screenshotURLs.length > 0) {
        const screenshot = document.createElement('img');
        screenshot.src = app.screenshotURLs[0];
        screenshot.style.width = '100px';  // Adjust size as needed
        appDetails.appendChild(screenshot);
    }

    const downloadLink = document.createElement('a');
    downloadLink.href = app.downloadURL;
    downloadLink.classList.add('download-link');
    downloadLink.textContent = 'Download .ipa';
    appDetails.appendChild(downloadLink);

    appCard.appendChild(appDetails);
    appDisplay.appendChild(appCard);
}

function populateCategoryFilter(apps) {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = new Set(apps.map(app => app.category || 'Uncategorized'));
    
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';  // Reset options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function filterAppsByCategory(category) {
    const filteredApps = category === 'all' ? jsonData.apps : jsonData.apps.filter(app => app.category === category);
    displayApps(filteredApps);
}

function searchApps(searchTerm) {
    const searchedApps = jsonData.apps.filter(app => app.name.toLowerCase().includes(searchTerm));
    displayApps(searchedApps);
}