import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as bookController from '../controllers/bookController.js';

const router = Router();

router.use(authenticateToken);

router.get('/', bookController.getAllBooks);
router.get('/search', bookController.searchBooks);
router.get('/:id', bookController.getBookById);
router.post('/', bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

export default router;
