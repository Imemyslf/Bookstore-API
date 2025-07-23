import { readData, writeData } from '../utils/fileHandler.js';
import { v4 as uuidv4 } from 'uuid';
import { resolvePath } from '../utils/paths.js';

const BOOKS_FILE = resolvePath('../data/books.json', import.meta.url);

export async function getAllBooks(req, res) {
  const books = await readData(BOOKS_FILE);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const start = (page - 1) * limit;
  const paginated = books.slice(start, start + limit);

  res.json({ total: books.length, page, limit, data: paginated });
}

export async function getBookById(req, res) {
  const books = await readData(BOOKS_FILE);
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
}

export async function createBook(req, res) {
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
  res.status(201).json({"messge": "Book created successfully", "Book": {newBook}});
}

export async function updateBook(req, res) {
  const books = await readData(BOOKS_FILE);
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Book not found' });

  if (books[index].userId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const previousRecord = { ...books[index] };
  
  const updated = { ...books[index], ...req.body };
  books[index] = updated;
  
  await writeData(BOOKS_FILE, books);
  
  res.json({
    "message": "Updated book successfully",
    "previous Record": previousRecord,
    "update Book records": updated
  });
}

export async function deleteBook(req, res) {
  const books = await readData(BOOKS_FILE);
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  if (book.userId !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  const filtered = books.filter(b => b.id !== req.params.id);
  await writeData(BOOKS_FILE, filtered);
  res.json({ message: 'Book deleted' });
}

export async function searchBooks(req, res) {
  const { genre } = req.query;
  if (!genre) return res.status(400).json({ message: 'Genre is required' });

  const books = await readData(BOOKS_FILE);
  const filtered = books.filter(book =>
    book.genre.toLowerCase() === genre.toLowerCase()
  );

  res.json(filtered);
}
