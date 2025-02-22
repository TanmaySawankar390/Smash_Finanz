module.exports = {
  expo: {
    name: "finance-tracker",
    slug: "finance-tracker",
    version: "1.0.0",
    android: {
      package: "com.yourcompany.financetracker",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    scheme: process.env.EXPO_SCHEME,
    extra: {
      auth0Domain: process.env.AUTH0_DOMAIN,
      auth0ClientId: process.env.AUTH0_CLIENT_ID,
    }
  }
};
