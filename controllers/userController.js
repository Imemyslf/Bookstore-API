import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { readData, writeData } from '../utils/fileHandler.js';
import { resolvePath } from '../utils/paths.js';
import { JWT_SECRET } from '../src/config.js';

const USER_FILE = resolvePath('../data/users.json', import.meta.url);

export async function registerUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const users = await readData(USER_FILE);
  const exists = users.find(user => user.email === email);
  if (exists) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: uuidv4(), email, password: hashedPassword };
  await writeData(USER_FILE, [...users, newUser]);

  res.status(201).json({ message: 'User registered successfully.' });
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const users = await readData(USER_FILE);
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful.', token });
}
