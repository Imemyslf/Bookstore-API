import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', (req, res) => {
  res.json({ message: `Authenticated as ${req.user.email}` });
});

export default router;
