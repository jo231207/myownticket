"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashToken = exports.generateRefreshSession = exports.verifyRefreshToken = exports.verifyAccessToken = exports.signAccessToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const appError_1 = require("./appError");
const signAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_ACCESS_SECRET, {
        expiresIn: env_1.env.JWT_ACCESS_EXPIRES_IN_MS / 1000
    });
};
exports.signAccessToken = signAccessToken;
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_SECRET);
    }
    catch (error) {
        throw new appError_1.AppError('Invalid or expired access token', 401);
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    if (!token) {
        throw new appError_1.AppError('Refresh token is required', 400);
    }
    return (0, exports.hashToken)(token);
};
exports.verifyRefreshToken = verifyRefreshToken;
const generateRefreshSession = () => {
    const token = crypto_1.default.randomBytes(48).toString('hex');
    const tokenHash = (0, exports.hashToken)(token);
    const expiresAt = new Date(Date.now() + env_1.env.JWT_REFRESH_EXPIRES_IN_MS);
    return { token, tokenHash, expiresAt };
};
exports.generateRefreshSession = generateRefreshSession;
const hashToken = (token) => {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
};
exports.hashToken = hashToken;
//# sourceMappingURL=token.js.map