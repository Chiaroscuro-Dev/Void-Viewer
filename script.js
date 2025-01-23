let allRepositories = [];  // Global array to store multiple repositories

// Function to load a repository from a file
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            allRepositories.push({ name: file.name, apps: jsonData.apps || [] });
            displayApps(getAllApps());
            populateCategoryFilter();
        } catch (error) {
            console.error('Invalid JSON file!', error);
        }
    };

    if (file) {
        reader.readAsText(file);
    }
});

// Function to load a repository from a URL using CORS proxy
document.getElementById('loadFromUrl').addEventListener('click', function() {
    const url = document.getElementById('urlInput').value;
    if (url) {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

        fetch(proxyUrl)
            .then(response => response.json())
            .then(data => {
                const jsonData = JSON.parse(data.contents);
                const repoName = extractRepoNameFromURL(url);
                allRepositories.push({ name: repoName, apps: jsonData.apps || [] });
                displayApps(getAllApps());
                populateCategoryFilter();
            })
            .catch(error => {
                console.error('Error fetching JSON:', error);
            });
    }
});

// Extract repository name from the URL
function extractRepoNameFromURL(url) {
    const parts = url.split('/');
    return parts[parts.length - 1] || 'Unknown Repo';
}

// Function to get all apps from all loaded repositories
function getAllApps() {
    return allRepositories.reduce((allApps, repo) => allApps.concat(repo.apps.map(app => ({ ...app, repoName: repo.name }))), []);
}

// Function to display all apps
function displayApps(apps) {
    const appDisplay = document.getElementById('appDisplay');
    appDisplay.innerHTML = '';  // Clear previous content

    apps.forEach(app => {
        createAppCard(app, appDisplay);
    });
}

// Create an app card with repository info
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

    const repoLabel = document.createElement('div');
    repoLabel.classList.add('app-repo');
    repoLabel.textContent = `Repository: ${app.repoName}`;
    appDetails.appendChild(repoLabel);

    const downloadLink = document.createElement('a');
    downloadLink.href = app.downloadURL;
    downloadLink.classList.add('download-link');
    downloadLink.textContent = 'Download .ipa';
    appDetails.appendChild(downloadLink);

    appCard.appendChild(appDetails);
    appDisplay.appendChild(appCard);
}

// Populate category filter based on all loaded repositories
function populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const allApps = getAllApps();
    const categories = new Set(allApps.map(app => app.category || 'Uncategorized'));
    
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';  // Reset options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter apps by category
document.getElementById('categoryFilter').addEventListener('change', function() {
    const selectedCategory = this.value;
    filterAppsByCategory(selectedCategory);
});

function filterAppsByCategory(category) {
    const filteredApps = category === 'all' ? getAllApps() : getAllApps().filter(app => app.category === category);
    displayApps(filteredApps);
}

// Search apps by name across all repositories
document.getElementById('searchButton').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    searchApps(searchTerm);
});

function searchApps(searchTerm) {
    const searchedApps = getAllApps().filter(app => app.name.toLowerCase().includes(searchTerm));
    displayApps(searchedApps);
}