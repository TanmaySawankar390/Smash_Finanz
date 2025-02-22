const { auth } = require('express-oauth2-jwt-bearer');

// Validate required environment variables
const requiredEnvVars = ['AUTH0_ISSUER_BASE_URL', 'AUTH0_AUDIENCE'];
const missingEnvVars = requiredEnvVars.filter(env => !process.env[env]);

if (missingEnvVars.length) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const checkJwt = auth({
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  audience: process.env.AUTH0_AUDIENCE,
  tokenSigningAlg: 'RS256'
});

module.exports = checkJwt;
