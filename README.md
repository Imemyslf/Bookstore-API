
# 📚 Bookstore API

A clean and lightweight RESTful API for a digital bookstore, built with **Node.js** and **Express**.  
Includes **JWT-based authentication**, **file-based persistence**, and full **CRUD support for books**.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)
![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)
![Tested with Jest](https://img.shields.io/badge/tested%20with-jest-99424f)

---

## ✨ Features

- 🔐 **User Auth**: Register/login with hashed passwords
- 🔑 **JWT Protected Routes**: Secure access to books
- 📘 **Book CRUD**: Create, read, update, delete your own books
- 🔎 **Search**: Filter books by genre
- 📄 **Pagination**: Paginate books with `?page` and `?limit`
- 💾 **JSON Persistence**: Reads/writes data to local JSON files

---

## 📁 Project Structure

```
.
├── controllers/      # Route handlers (optional split)
├── data/             # JSON files for users and books
├── middleware/       # JWT and logging middleware
├── routes/           # Auth and Book route definitions
├── src/              # Express app entry point
├── test/             # Jest + Supertest API tests
├── utils/            # File I/O + path utilities
├── jest.config.mjs   # Jest config (ESM-friendly)
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js **v18+**
- `npm` or `pnpm`

### Setup

```bash
git clone https://github.com/Imemyslf/Bookstore-API.git
cd bookstore-api
npm install
```

---

## 🏁 Running the Server

```bash
npm run dev
```

Server starts at: [http://localhost:3000](http://localhost:3000)

---

## ✅ Running Tests

```bash
npm test
```

Test suite is powered by **Jest + Supertest**

---

## 🔌 API Endpoints

### 🧑 Auth

| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| POST   | `/auth/register` | Register new user   |
| POST   | `/auth/login`    | Login & get JWT     |

> **Request Body** (JSON):
```json
{ "email": "user@example.com", "password": "yourpassword" }
```

---

### 📚 Books (Protected)

> Requires Header:  
> `Authorization: Bearer <token>`

| Method | Endpoint                  | Description                      |
|--------|---------------------------|----------------------------------|
| GET    | `/books`                  | List all books (paginated)       |
| GET    | `/books/search?genre=Fic` | Filter books by genre            |
| GET    | `/books/:id`              | Get book by ID                   |
| POST   | `/books`                  | Add a new book                   |
| PUT    | `/books/:id`              | Update (only owner)              |
| DELETE | `/books/:id`              | Delete (only owner)              |

> **Book JSON Body (POST/PUT)**:
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Adventure",
  "publishedYear": 2023
}
```

---

## 🔐 Environment Variables

| Key         | Default       | Description             |
|-------------|---------------|-------------------------|
| `JWT_SECRET`| `"kishan@123"`| Secret for JWT signing  |

---

## 🧪 Test Coverage

All tests are located in `test/index.test.mjs` and are run with:

```bash
npm test
```

Covers:
- Auth flow
- Protected routes
- Validation

---

## 🪪 License

Licensed under the [ISC License](LICENSE).


---

## ✍️ Author

### **Kishan Sharma**
---


