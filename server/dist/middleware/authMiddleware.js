"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const appError_1 = require("../utils/appError");
const token_1 = require("../utils/token");
const requireAuth = (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        throw new appError_1.AppError('Authorization header is missing', 401);
    }
    const token = header.substring('Bearer '.length).trim();
    if (!token) {
        throw new appError_1.AppError('Access token is missing', 401);
    }
    const payload = (0, token_1.verifyAccessToken)(token);
    req.userId = payload.sub;
    next();
};
exports.requireAuth = requireAuth;
//# sourceMappingURL=authMiddleware.js.map