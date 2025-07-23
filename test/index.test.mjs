import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import app from '../src/index.js';

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: `user_${uuidv4()}@test.com`,
        password: 'secret123'
      });

    console.log(res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully.');
  });

  it('should login successfully with correct credentials', async () => {
    const email = `user_${uuidv4()}@test.com`;
    const password = 'validpass';

    await request(app)
      .post('/auth/register')
      .send({ email, password });

    const res = await request(app)
      .post('/auth/login')
      .send({ email, password });

    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should fail login with incorrect password', async () => {
    const email = `user_${uuidv4()}@test.com`;
    const password = 'correctpass';

    await request(app)
      .post('/auth/register')
      .send({ email, password });

    const res = await request(app)
      .post('/auth/login')
      .send({ email, password: 'wrongpass' });

    console.log(res.body);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid email or password.');
  });
});

describe('Books API', () => {
  let token;
  let bookId;

  beforeAll(async () => {
    const email = `bookuser_${uuidv4()}@test.com`;
    const password = 'bookpass';

    await request(app)
      .post('/auth/register')
      .send({ email, password });

    const res = await request(app)
      .post('/auth/login')
      .send({ email, password });

    token = res.body.token;
  });

  it('should create a new book', async () => {
    const res = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Test Genre',
        publishedYear: 2020
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Book');
    bookId = res.body.id; // save for later tests
  });

  it('should fetch all books', async () => {
    const res = await request(app)
      .get('/books')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data || res.body)).toBe(true);
  });

  it('should update the book', async () => {
    const res = await request(app)
      .put(`/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Book Title' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Book Title');
  });

  it('should delete the book', async () => {
    const res = await request(app)
      .delete(`/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Book deleted');
  });
});
