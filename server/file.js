const jwt = require('jsonwebtoken');

const payload = {
  sub: 'auth0|1234567890', // Fake Auth0 user ID
  name: 'John Doe',
  email: 'user@example.com',
  aud: 'https://dev-l4263r2h75x8dbl3.us.auth0.com/api/v2/',
  iss: 'https://dev-l4263r2h75x8dbl3.us.auth0.com/',
};

const secret = 'your-256-bit-secret'; // Replace with a dummy secret for testing

const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '1h' });

console.log(token);