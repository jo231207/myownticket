"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.signOutAll = exports.signOut = exports.refresh = exports.oauth = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const authService_1 = require("../services/authService");
const appError_1 = require("../utils/appError");
const userRepository_1 = require("../repositories/userRepository");
const assertValid = (req) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new appError_1.AppError('Validation failed', 422, errors.array());
    }
};
const register = async (req, res, next) => {
    try {
        assertValid(req);
        const { email, password, displayName } = req.body;
        const result = await (0, authService_1.registerWithEmail)(email, password, displayName);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        assertValid(req);
        const { email, password } = req.body;
        const result = await (0, authService_1.loginWithEmail)(email, password);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const oauth = async (req, res, next) => {
    try {
        assertValid(req);
        const payload = req.body;
        const result = await (0, authService_1.authenticateWithOAuth)(payload);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.oauth = oauth;
const refresh = async (req, res, next) => {
    try {
        assertValid(req);
        const { refreshToken } = req.body;
        const result = await (0, authService_1.refreshSession)(refreshToken);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.refresh = refresh;
const signOut = async (req, res, next) => {
    try {
        assertValid(req);
        const { refreshToken } = req.body;
        await (0, authService_1.logout)(refreshToken);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.signOut = signOut;
const signOutAll = async (req, res, next) => {
    try {
        if (!req.userId) {
            throw new appError_1.AppError('Unauthorized', 401);
        }
        await (0, authService_1.logoutAllSessions)(req.userId);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.signOutAll = signOutAll;
const me = async (req, res, next) => {
    try {
        if (!req.userId) {
            throw new appError_1.AppError('Unauthorized', 401);
        }
        const user = await userRepository_1.userRepository.findById(req.userId);
        if (!user) {
            throw new appError_1.AppError('User not found', 404);
        }
        const { passwordHash: _passwordHash, ...safeUser } = user;
        res.status(200).json({ user: safeUser });
    }
    catch (error) {
        next(error);
    }
};
exports.me = me;
//# sourceMappingURL=authController.js.map