// Facebook app info.
exports.appId = process.env.FB_APP_ID || '373335136385913';
exports.appSecret = process.env.FB_APP_SECRET || 'c9cb9e46a67253fa8988d1cbd6fc04ce';
exports.callbackUrl = process.env.FB_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback';
