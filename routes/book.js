import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { readData, writeData } from '../utils/fileHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BOOKS_FILE = path.resolve(__dirname, '../data/books.json');

router.use(authenticateToken);

router.get('/', async (_req, res) => {
  const books = await readData(BOOKS_FILE);
  res.json(books);
});

router.get('/:id', async (req, res) => {
  const books = await readData(BOOKS_FILE);
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

router.post('/', async (req, res) => {
    console.log('Request body:', req.body);
  const { title, author, genre, publishedYear } = req.body;
  if (!title || !author || !genre || !publishedYear) {
    return res.status(400).json({ message: 'Missing book fields' });
  }

  const books = await readData(BOOKS_FILE);
  const newBook = {
    id: uuidv4(),
    title,
    author,
    genre,
    publishedYear,
    userId: req.user.id,
  };

  await writeData(BOOKS_FILE, [...books, newBook]);
  res.status(201).json(newBook);
});

router.put('/:id', async (req, res) => {
  const books = await readData(BOOKS_FILE);
  const bookIndex = books.findIndex(b => b.id === req.params.id);
  if (bookIndex === -1) return res.status(404).json({ message: 'Book not found' });

  const book = books[bookIndex];
  if (book.userId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const updated = { ...book, ...req.body };
  books[bookIndex] = updated;

  await writeData(BOOKS_FILE, books);
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const books = await readData(BOOKS_FILE);
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  if (book.userId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const filtered = books.filter(b => b.id !== req.params.id);
  await writeData(BOOKS_FILE, filtered);
  res.json({ message: 'Book deleted' });
});

export default router;
