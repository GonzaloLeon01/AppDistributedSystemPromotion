const jwt = require('jsonwebtoken');
const { accessTokenSecret } = require('../config/auth.config');

function verifyToken(req, res) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No token provided' }));
        return false;
    }

    try {
        const decoded = jwt.verify(token, accessTokenSecret);
        req.user = decoded;
        return true;
    } catch (err) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid or expired token' }));
        return false;
    }
}

module.exports = { verifyToken };