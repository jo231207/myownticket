import { Router } from 'express';
import { body } from 'express-validator';
import {
  login,
  me,
  oauth,
  refresh,
  register,
  signOut,
  signOutAll
} from '../controllers/authController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
    body('displayName').optional().isString().isLength({ min: 1, max: 100 })
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isString().withMessage('Password is required')
  ],
  login
);

router.post(
  '/oauth',
  [
    body('provider')
      .isIn(['google', 'kakao', 'naver', 'supabase'])
      .withMessage('Invalid OAuth provider'),
    body('idToken').optional().isString(),
    body('accessToken').optional().isString(),
    body('refreshToken').optional().isString(),
    body('authorizationCode').optional().isString()
  ],
  oauth
);

router.post(
  '/refresh',
  [body('refreshToken').isString().notEmpty().withMessage('Refresh token is required')],
  refresh
);

router.post(
  '/logout',
  [body('refreshToken').isString().notEmpty().withMessage('Refresh token is required')],
  signOut
);

router.post('/logout-all', requireAuth, signOutAll);
router.get('/me', requireAuth, me);

export default router;
