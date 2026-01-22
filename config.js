// MSAL Configuration for Entra External ID
const msalConfig = {
    auth: {
        clientId: "319a4c5f-2ced-4711-a4bb-5a416af16569", // Application (client) ID from Azure portal
        authority: "https://vccextidqa.ciamlogin.com/", // Your External ID tenant
        redirectUri: "http://localhost:8086", // Must match the redirect URI registered in Azure
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
