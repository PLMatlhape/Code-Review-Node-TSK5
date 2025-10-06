"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Please log in to access this feature.'
            });
        }
        const token = authHeader.substring(7);
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Your session has expired. Please log in again.'
        });
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Please log in to continue.'
            });
        }
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        if (allowedRoles.indexOf(req.user.role) === -1) {
            return res.status(403).json({
                success: false,
                error: 'You don\'t have permission to perform this action.'
            });
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map