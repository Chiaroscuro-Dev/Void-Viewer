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

let allRepositories = [];  // Store repository apps

// Load multiple repositories and handle CORS-free sources only
function preloadRepositories() {
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
                const apps = data.apps || [];  // Check if there's an "apps" array
                allRepositories.push({ name: repoName, apps });
                displayRepository(repoName, apps);  // Display apps in this repo
            })
            .catch(error => {
                console.warn(`Skipping ${url}: ${error.message}`);
            });
    });
}

// Extract repository name from the URL
function extractRepoNameFromURL(url) {
    const parts = url.split('/');
    return parts[parts.length - 1].replace('.json', '') || 'Unknown Repo';
}

// Display repository section with apps as subsections
function displayRepository(repoName, apps) {
    const container = document.getElementById('appDisplay');

    const repoSection = document.createElement('div');
    repoSection.classList.add('repository-section');
    
    const repoTitle = document.createElement('h2');
    repoTitle.textContent = `Repository: ${repoName}`;
    repoSection.appendChild(repoTitle);

    apps.forEach(app => {
        const appCard = createAppCard(app);
        repoSection.appendChild(appCard);
    });

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

// Load repositories on page load
window.onload = function() {
    preloadRepositories();
};