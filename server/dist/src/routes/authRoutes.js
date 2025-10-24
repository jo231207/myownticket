"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    (0, express_validator_1.body)('displayName').optional().isString().isLength({ min: 1, max: 100 })
], authController_1.register);
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isString().withMessage('Password is required')
], authController_1.login);
router.post('/oauth', [
    (0, express_validator_1.body)('provider')
        .isIn(['google', 'kakao', 'naver', 'supabase'])
        .withMessage('Invalid OAuth provider'),
    (0, express_validator_1.body)('idToken').optional().isString(),
    (0, express_validator_1.body)('accessToken').optional().isString(),
    (0, express_validator_1.body)('refreshToken').optional().isString(),
    (0, express_validator_1.body)('authorizationCode').optional().isString()
], authController_1.oauth);
router.post('/refresh', [(0, express_validator_1.body)('refreshToken').isString().notEmpty().withMessage('Refresh token is required')], authController_1.refresh);
router.post('/logout', [(0, express_validator_1.body)('refreshToken').isString().notEmpty().withMessage('Refresh token is required')], authController_1.signOut);
router.post('/logout-all', authMiddleware_1.requireAuth, authController_1.signOutAll);
router.get('/me', authMiddleware_1.requireAuth, authController_1.me);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map