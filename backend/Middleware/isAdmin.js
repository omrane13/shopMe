const ensureAuthenticated = require('./Auth');

const isAdmin = (req, res, next) => {
    ensureAuthenticated(req, res, () => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized - Admin access required'
            });
        }

        next();
    });
};

module.exports = isAdmin;
