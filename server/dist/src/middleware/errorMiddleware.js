"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const appError_1 = require("../utils/appError");
const isValidationErrorArray = (details) => {
    return Array.isArray(details) && details.every((item) => 'msg' in item);
};
const notFoundHandler = (req, _res, next) => {
    next(new appError_1.AppError(`Route ${req.originalUrl} not found`, 404));
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err instanceof appError_1.AppError ? err.statusCode : err.statusCode ?? err.status ?? 500;
    const message = err instanceof appError_1.AppError ? err.message : err.message || 'Internal server error';
    const payload = {
        message
    };
    if (err instanceof appError_1.AppError && err.details) {
        payload.details = err.details;
    }
    else if (isValidationErrorArray(err.details)) {
        payload.details = err.details.map((detail) => ({
            message: detail.msg,
            field: 'param' in detail ? detail.param : undefined
        }));
    }
    res.status(statusCode).json(payload);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorMiddleware.js.map