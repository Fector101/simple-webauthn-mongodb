const jwt = require('jsonwebtoken')


const verifyToken = (req, res, next) => {
    const userInfo = req.cookies.userInfo;
    if (!userInfo) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(userInfo, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;
