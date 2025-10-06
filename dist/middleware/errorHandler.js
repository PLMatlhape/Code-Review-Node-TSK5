"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    const statusCode = err.statusCode || 500;
    let message = err.message;
    // Make generic errors more user-friendly
    if (statusCode === 500 && !message) {
        message = 'Something went wrong on our end. Please try again.';
    }
    if (statusCode === 404 && !message) {
        message = 'The requested resource could not be found.';
    }
    res.status(statusCode).json({
        success: false,
        error: message || 'An unexpected error occurred. Please try again.',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: `The page '${req.originalUrl}' doesn't exist. Please check the URL and try again.`
    });
};
exports.notFoundHandler = notFoundHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map