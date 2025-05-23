const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).send('Access denied. User role not found.');
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).send('Access denied. You do not have the required permissions.');
        }
        next();
    };
};

module.exports = { authorizeRole };