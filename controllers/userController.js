import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv";
import { db } from '../src/database.js'; 

dotenv.config();

export async function registerUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
    };

    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Error in registerUser:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}


export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful.', token });
  } catch (err) {
    console.error('Error in loginUser:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
