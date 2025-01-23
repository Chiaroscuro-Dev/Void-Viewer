let allRepositories = [];  // Global array to store multiple repositories

// Function to preload repositories with error feedback
function preloadRepositories() {
    const repositoryUrls = [
        'https://raw.githubusercontent.com/Gliddd4/MyApps/refs/heads/main/app-repo.json',
        'https://qnblackcat.github.io/AltStore/apps.json',
        'https://randomblock1.com/altstore/apps.json',
        'https://ipa.cypwn.xyz/cypwn.json',
        'https://raw.githubusercontent.com/vizunchik/AltStoreRus/master/apps.json',
        'https://burritosoftware.github.io/altstore/channels/burritosource.json',
        'https://wuxu1.github.io/wuxu-complete.json',
        'https://wuxu1.github.io/wuxu-complete-plus.json',
        'https://hann8n.github.io/JackCracks/MovieboxPro.json',
        'https://raw.githubusercontent.com/swaggyP36000/TrollStore-IPAs/main/apps_esign.json',
        'https://flyinghead.github.io/flycast-builds/altstore.json',
        'https://github.com/khcrysalis/Feather/raw/main/app-repo.json',
        'https://quarksources.github.io/quantumsource++.json',
        'https://repo.starfiles.co/',
        'https://altstore.oatmealdome.me/',
        'https://raw.githubusercontent.com/Neoncat-OG/TrollStore-IPAs/main/apps_esign.json',
        'https://raw.githubusercontent.com/Balackburn/YTLitePlusAltstore/main/apps.json',
        'https://raw.githubusercontent.com/TheNightmanCodeth/chromium-ios/master/altstore-source.json',
        'https://raw.githubusercontent.com/arichornloverALT/arichornloveralt.github.io/main/apps2.json',
        'https://raw.githubusercontent.com/lo-cafe/winston-altstore/main/apps.json'
    ];

    repositoryUrls.forEach(url => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load repository: ${url}`);
                }
                return response.json();
            })
            .then(data => {
                const repoName = extractRepoNameFromURL(url);
                const apps = data.apps || [];
                allRepositories.push({ name: repoName, apps });
                createRepositoryDropdown(repoName, apps);  // Create a dropdown for each repo
            })
            .catch(error => {
                console.warn(`Skipping ${url}: ${error.message}`);
                displayErrorMessage(url);  // Display error message on the page
            });
    });
}

// Display an error message on the page for failed repositories
function displayErrorMessage(url) {
    const container = document.getElementById('appDisplay');
    const errorMessage = document.createElement('p');
    errorMessage.textContent = `Failed to load repository from ${url}`;
    errorMessage.style.color = 'red';
    container.appendChild(errorMessage);
}

// Extract repository name from the URL
function extractRepoNameFromURL(url) {
    const parts = url.split('/');
    return parts[parts.length - 1].replace('.json', '') || 'Unknown Repo';
}

// Create a dropdown section for each repository
function createRepositoryDropdown(repoName, apps) {
    const container = document.getElementById('appDisplay');

    const repoSection = document.createElement('div');
    repoSection.classList.add('repository-section');

    const repoTitle = document.createElement('h2');
    repoTitle.textContent = `Repository: ${repoName}`;
    repoTitle.classList.add('repo-title');
    repoTitle.addEventListener('click', function() {
        const appList = repoSection.querySelector('.app-list');
        appList.style.display = appList.style.display === 'none' ? 'block' : 'none';  // Toggle app list visibility
    });

    const appList = document.createElement('div');
    appList.classList.add('app-list');
    appList.style.display = 'none';  // Hide apps by default

    apps.forEach(app => {
        const appCard = createAppCard(app);
        appList.appendChild(appCard);
    });

    repoSection.appendChild(repoTitle);
    repoSection.appendChild(appList);
    container.appendChild(repoSection);
}

// Create an app card
function createAppCard(app) {
    const appCard = document.createElement('div');
    appCard.classList.add('app-card');

    const icon = document.createElement('img');
    icon.src = app.iconURL || 'https://via.placeholder.com/100';  // Default icon if not provided
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

    const downloadLink = document.createElement('a');
    downloadLink.href = app.downloadURL;
    downloadLink.classList.add('download-link');
    downloadLink.textContent = 'Download .ipa';
    appDetails.appendChild(downloadLink);

    appCard.appendChild(appDetails);
    return appCard;
}

// Search apps by name across all repositories
document.getElementById('searchButton').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    searchApps(searchTerm);
});

function searchApps(searchTerm) {
    const appDisplay = document.getElementById('appDisplay');
    appDisplay.innerHTML = '';  // Clear previous content

    allRepositories.forEach(repo => {
        const filteredApps = repo.apps.filter(app => app.name.toLowerCase().includes(searchTerm));
        if (filteredApps.length > 0) {
            createRepositoryDropdown(repo.name, filteredApps);  // Show the filtered apps under their respective repo
        }
    });
}

// Load repositories on page load
window.onload = function() {
    preloadRepositories();
};