import { v4 as uuidv4 } from 'uuid';
import { db } from '../src/database.js'; // MongoDB connection



export async function getAllBooks(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const booksCollection = db.collection('books');
    const total = await booksCollection.countDocuments();
    const data = await booksCollection.find().skip(skip).limit(limit).toArray();

    res.json({ total, page, limit, data });
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching books" });
  }
}


export async function getBookById(req, res) {
  try {
    const book = await db.collection('books').findOne({ id: req.params.id });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching book" });
  }
}


export async function createBook(req, res) {
  const { title, author, genre, publishedYear } = req.body;
  if (!title || !author || !genre || !publishedYear) {
    return res.status(400).json({ message: 'Missing book fields' });
  }

  const newBook = {
    id: uuidv4(),
    title,
    author,
    genre,
    publishedYear,
    userId: req.user.id
  };

  try {
    await db.collection('books').insertOne(newBook);
    res.status(201).json({ message: "Book created successfully", Book: newBook });
  } catch (err) {
    res.status(500).json({ message: "Error creating book" });
  }
}


export async function updateBook(req, res) {
  try {
    const booksCollection = db.collection('books');
    const book = await booksCollection.findOne({ id: req.params.id });

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const updated = { ...book, ...req.body };
    await booksCollection.updateOne({ id: req.params.id }, { $set: req.body });

    res.json({
      message: "Updated book successfully",
      previousRecord: book,
      updatedBook: updated
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating book" });
  }
}


export async function deleteBook(req, res) {
  try {
    const booksCollection = db.collection('books');
    const book = await booksCollection.findOne({ id: req.params.id });

    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await booksCollection.deleteOne({ id: req.params.id });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: "Error deleting book" });
  }
}


export async function searchBooks(req, res) {
  const { genre } = req.query;
  if (!genre) return res.status(400).json({ message: 'Genre is required' });

  try {
    const filtered = await db.collection('books')
      .find({ genre: { $regex: new RegExp(`^${genre}$`, 'i') } })
      .toArray();

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: "Error searching books" });
  }
}
