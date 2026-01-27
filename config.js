// MSAL Configuration for Entra External ID
const msalConfig = {
    auth: {
        clientId: "db73f476-d035-483c-a298-bd7f40967275", // Application (client) ID from Azure portal
        authority: "https://doeeid.ciamlogin.com/", // Your External ID tenant
        redirectUri: "https://did.tomdemo.se/EEIDTestApp/", // Must match the redirect URI registered in Azure
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: "sessionStorage", // Use "localStorage" if you want persistence across browser sessions
        storeAuthStateInCookie: false
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) return;
                console.log(message);
            },
            logLevel: "Info"
        }
    }
};

// Scopes for token requests
const loginRequest = {
    scopes: ["openid", "profile", "email"]
};

const tokenRequest = {
    scopes: ["openid", "profile", "email"]
};
