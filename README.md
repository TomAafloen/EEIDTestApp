# Entra External ID Test Application

A simple single-page application to test OIDC authentication with Microsoft Entra External ID (CIAM) using Authorization Code flow with PKCE.

## Features

- ✅ Authorization Code flow with PKCE (via MSAL.js)
- ✅ Display all ID token claims
- ✅ Get and display access tokens
- ✅ Works locally and can be deployed to GitHub Pages or Azure Static Web Apps
- ✅ No build tools required - plain HTML/JavaScript

## Setup Instructions

### 1. Register Application in Entra External ID

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your **Entra External ID** tenant
3. Go to **App registrations** → **New registration**
4. Configure:
   - **Name**: OIDC Test App (or any name)
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: 
     - Platform: **Single-page application (SPA)**
     - URI: `http://localhost:8086`
   - Click **Register**

5. After registration, note down:
   - **Application (client) ID**
   - **Directory (tenant) ID** (if needed)
   - Your tenant domain (e.g., `yourtenantname.ciamlogin.com`)

6. Under **Authentication** → **Single-page application**:
   - Ensure `http://localhost:8086` is listed
   - Check **ID tokens** (for implicit grant - optional)
   - Save changes

7. Under **API permissions**:
   - Ensure these are granted:
     - `openid`
     - `profile`
     - `email`
   - Grant admin consent if required

### 2. Configure the Application

Edit `config.js` and update:

```javascript
const msalConfig = {
    auth: {
        clientId: "YOUR_CLIENT_ID_HERE",           // Replace with your Application (client) ID
        authority: "https://YOUR_TENANT_NAME.ciamlogin.com/",  // Replace with your tenant
        redirectUri: "http://localhost:8086"
    },
    // ... rest of config
};
```

### 3. Run Locally

You need a local web server (not just opening the HTML file directly due to CORS).

**Option 1: Python**
```bash
# Python 3
python -m http.server 8086

# Python 2
python -m SimpleHTTPServer 8086
```

**Option 2: Node.js (npx)**
```bash
npx http-server -p 8086
```

**Option 3: PHP**
```bash
php -S localhost:8086
```

**Option 4: VS Code Live Server Extension**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"
- Change port to 8086 in settings if needed

### 4. Test the Application

1. Open browser to `http://localhost:8086`
2. Click **Sign In** button
3. You'll be redirected to Entra External ID login
4. After signing in, you'll see all your ID token claims
5. Click **Get Access Token** to retrieve an access token

## Deployment Options

### GitHub Pages

1. Create a repository on GitHub
2. Push these files to the repo
3. Go to **Settings** → **Pages**
4. Select branch and folder
5. Update `redirectUri` in `config.js` to your GitHub Pages URL (e.g., `https://yourusername.github.io/repo-name/`)
6. Add the GitHub Pages URL as a redirect URI in your Entra app registration

### Azure Static Web Apps

1. Push code to GitHub
2. Create an Azure Static Web App resource
3. Connect to your GitHub repository
4. No build configuration needed (static HTML)
5. Update `redirectUri` in `config.js` to your Azure Static Web App URL
6. Add the Azure URL as a redirect URI in your Entra app registration

## File Structure

```
├── index.html     # Main HTML page with UI
├── config.js      # MSAL configuration (update with your tenant details)
├── app.js         # Authentication logic and UI updates
└── README.md      # This file
```

## Troubleshooting

**"No account or login hint provided" error**
- Clear browser cache and cookies
- Check that clientId and authority are correct

**CORS errors**
- Make sure you're using a web server, not opening the file directly
- Verify redirect URI matches exactly (including trailing slashes)

**"AADSTS50011: Reply URL mismatch" error**
- Ensure the redirect URI in `config.js` matches exactly what's registered in Azure
- Redirect URIs are case-sensitive

**Blank page after redirect**
- Check browser console for errors
- Verify MSAL.js library is loading correctly

## Security Notes

- Never commit real client secrets (SPA doesn't use them anyway)
- Use HTTPS in production
- Keep MSAL.js library updated
- sessionStorage vs localStorage: sessionStorage is more secure but requires re-login per session

## References

- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser)
- [Entra External ID Documentation](https://learn.microsoft.com/entra/external-id/)
- [OAuth 2.0 Authorization Code Flow with PKCE](https://oauth.net/2/pkce/)
