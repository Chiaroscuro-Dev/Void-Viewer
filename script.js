let allRepositories = [];  // Global array to store multiple repositories

// Function to preload repositories
    const customRepoNames = [
        'https://raw.githubusercontent.com/Gliddd4/MyApps/refs/heads/main/app-repo.json': 'MyApps by Gliddd4',
        'https://qnblackcat.github.io/AltStore/apps.json': 'qnblackcat's AltStore',
        'https://randomblock1.com/altstore/apps.json': 'randomblock1's AltStore',
        'https://ipa.cypwn.xyz/cypwn.json': 'CyPwn',
        'https://raw.githubusercontent.com/vizunchik/AltStoreRus/master/apps.json': 'vizunchik's AltStoreRus',
        'https://burritosoftware.github.io/altstore/channels/burritosource.json': 'burritosoftware's AltStore',
        'https://wuxu1.github.io/wuxu-complete.json': 'wuxu1 Complete',
        'https://wuxu1.github.io/wuxu-complete-plus.json': 'wuxu1 Complete Plus',
        'https://hann8n.github.io/JackCracks/MovieboxPro.json': 'JackCracks MovieboxPro',
        'https://raw.githubusercontent.com/swaggyP36000/TrollStore-IPAs/main/apps_esign.json': 'TrollStore IPA’s',
        'https://flyinghead.github.io/flycast-builds/altstore.json': 'flyinghead's Flycast',
        'https://github.com/khcrysalis/Feather/raw/main/app-repo.json': 'Feather by khcrysalis',
        'https://quarksources.github.io/quantumsource++.json': ' quantumsource++ by quarksources',
        'https://repo.starfiles.co/': 'Starfiles',
        'https://altstore.oatmealdome.me/': 'AltStore',
        'https://raw.githubusercontent.com/Neoncat-OG/TrollStore-IPAs/main/apps_esign.json': 'Neoncat-OG’s TrollStore IPA’s'
        'https://raw.githubusercontent.com/Balackburn/YTLitePlusAltstore/main/apps.json': 'YTLitePlus by Balackburn',
        'https://raw.githubusercontent.com/TheNightmanCodeth/chromium-ios/master/altstore-source.json': 'Chromium by TheNightManCodeth'
        'https://raw.githubusercontent.com/arichornloverALT/arichornloveralt.github.io/main/apps2.json': 'arichornloveralt’s Apps',
        'https://raw.githubusercontent.com/lo-cafe/winston-altstore/main/apps.json': 'Winston by lo-cafe'
    ];

    // Function to preload repositories
function preloadRepositories() {
    const repositoryUrls = Object.keys(customRepoNames);  // Only use repos with custom names defined

    repositoryUrls.forEach(url => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load repository: ${url}`);
                }
                return response.json();
            })
            .then(data => {
                const repoName = getCustomRepoName(url);
                const apps = data.apps || [];
                allRepositories.push({ name: repoName, apps });
                createRepositoryDropdown(repoName, apps);  // Create a dropdown for each repo
            })
            .catch(error => {
                console.warn(`Skipping ${url}: ${error.message}`);
            });
    });
}

// Get custom repository name if available, otherwise extract from URL
function getCustomRepoName(url) {
    return customRepoNames[url] || extractRepoNameFromURL(url);
}

// Extract repository name from the URL if no custom name is provided
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