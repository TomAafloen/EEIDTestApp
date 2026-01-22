// Initialize MSAL instance
const msalInstance = new msal.PublicClientApplication(msalConfig);

// DOM Elements
const signInButton = document.getElementById('signInButton');
const signOutButton = document.getElementById('signOutButton');
const getTokenButton = document.getElementById('getTokenButton');
const content = document.getElementById('content');

// Initialize the application
async function initializeApp() {
    try {
        // Handle redirect promise
        const response = await msalInstance.handleRedirectPromise();
        
        if (response) {
            console.log('Redirect response:', response);
            handleResponse(response);
        } else {
            // Check if user is already signed in
            const accounts = msalInstance.getAllAccounts();
            if (accounts.length > 0) {
                msalInstance.setActiveAccount(accounts[0]);
                updateUI(accounts[0]);
            }
        }
    } catch (error) {
        console.error('Initialization error:', error);
        displayError(error);
    }
}

// Sign In
async function signIn() {
    try {
        const response = await msalInstance.loginRedirect(loginRequest);
    } catch (error) {
        console.error('Sign in error:', error);
        displayError(error);
    }
}

// Sign Out
async function signOut() {
    const account = msalInstance.getActiveAccount();
    if (account) {
        try {
            await msalInstance.logoutRedirect({
                account: account,
                postLogoutRedirectUri: window.location.origin
            });
        } catch (error) {
            console.error('Sign out error:', error);
            displayError(error);
        }
    }
}

// Get Access Token
async function getToken() {
    const account = msalInstance.getActiveAccount();
    if (!account) {
        displayError(new Error('No active account. Please sign in first.'));
        return;
    }

    try {
        // Try to acquire token silently
        const response = await msalInstance.acquireTokenSilent({
            ...tokenRequest,
            account: account
        });
        
        displayTokenInfo(response);
    } catch (error) {
        console.warn('Silent token acquisition failed:', error);
        
        // If silent acquisition fails, fall back to interactive
        try {
            const response = await msalInstance.acquireTokenRedirect({
                ...tokenRequest,
                account: account
            });
        } catch (interactiveError) {
            console.error('Interactive token acquisition error:', interactiveError);
            displayError(interactiveError);
        }
    }
}

// Handle authentication response
function handleResponse(response) {
    if (response) {
        msalInstance.setActiveAccount(response.account);
        updateUI(response.account);
    }
}

// Update UI based on authentication state
function updateUI(account) {
    if (account) {
        signInButton.style.display = 'none';
        signOutButton.style.display = 'inline-block';
        getTokenButton.style.display = 'inline-block';
        displayUserInfo(account);
    } else {
        signInButton.style.display = 'inline-block';
        signOutButton.style.display = 'none';
        getTokenButton.style.display = 'none';
        content.innerHTML = '<p>Please sign in to view your claims.</p>';
    }
}

// Display user information and claims
function displayUserInfo(account) {
    const idTokenClaims = account.idTokenClaims;
    
    let html = '<div class="user-info">';
    html += `<h2>Welcome, ${account.name || account.username}!</h2>`;
    html += `<p><strong>Username:</strong> ${account.username}</p>`;
    html += `<p><strong>Home Account ID:</strong> ${account.homeAccountId}</p>`;
    html += '</div>';
    
    html += '<h3>ID Token Claims</h3>';
    html += '<div class="claims">';
    
    if (idTokenClaims) {
        for (const [key, value] of Object.entries(idTokenClaims)) {
            html += '<div class="claim-item">';
            html += `<div class="claim-name">${escapeHtml(key)}</div>`;
            html += `<div class="claim-value">${escapeHtml(JSON.stringify(value, null, 2))}</div>`;
            html += '</div>';
        }
    } else {
        html += '<p>No claims available</p>';
    }
    
    html += '</div>';
    
    content.innerHTML = html;
}

// Display token information
function displayTokenInfo(response) {
    let html = content.innerHTML;
    
    html += '<h3>Access Token Information</h3>';
    html += '<div class="user-info">';
    html += `<p><strong>Token Type:</strong> Bearer</p>`;
    html += `<p><strong>Expires On:</strong> ${new Date(response.expiresOn).toLocaleString()}</p>`;
    html += `<p><strong>Scopes:</strong> ${response.scopes.join(', ')}</p>`;
    html += '<p><strong>Access Token (first 50 chars):</strong></p>';
    html += `<pre>${escapeHtml(response.accessToken.substring(0, 50))}...</pre>`;
    html += '<p><em>Check browser console for full token</em></p>';
    html += '</div>';
    
    content.innerHTML = html;
    
    console.log('Full Access Token:', response.accessToken);
    console.log('ID Token:', response.idToken);
}

// Display error
function displayError(error) {
    const errorHtml = `
        <div class="error">
            <h3>❌ Error</h3>
            <p><strong>${error.name || 'Error'}:</strong> ${error.message}</p>
            ${error.errorCode ? `<p><strong>Error Code:</strong> ${error.errorCode}</p>` : ''}
            ${error.errorMessage ? `<p><strong>Details:</strong> ${error.errorMessage}</p>` : ''}
        </div>
    `;
    content.innerHTML = errorHtml;
    console.error('Error details:', error);
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event Listeners
signInButton.addEventListener('click', signIn);
signOutButton.addEventListener('click', signOut);
getTokenButton.addEventListener('click', getToken);

// Initialize app when DOM is loaded
initializeApp();
