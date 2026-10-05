const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// In-memory data store for books
let books = [
    { id: 1, title: "The Hobbit", author: "J.R.R. Tolkien" },
    { id: 2, title: "1984", author: "George Orwell" }
];

// 1. GET /books - Fetch all books
app.get('/books', (req, res) => {
    res.status(200).json(books);
});

// 2. POST /books - Add a new book
app.post('/books', (req, res) => {
    const { title, author } = req.body;
    
    if (!title || !author) {
        return res.status(400).json({ message: "Title and Author are required." });
    }

    const newBook = {
        id: books.length > 0 ? books[books.length - 1].id + 1 : 1, // Simple auto-increment ID
        title,
        author
    };

    books.push(newBook);
    res.status(201).json({ message: "Book added successfully!", book: newBook });
});

// 3. PUT /books/:id - Update an existing book by ID
app.put('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const { title, author } = req.body;

    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found." });
    }

    // Update only fields provided in the body
    if (title) books[bookIndex].title = title;
    if (author) books[bookIndex].author = author;

    res.status(200).json({ message: "Book updated successfully!", book: books[bookIndex] });
});

// 4. DELETE /books/:id - Remove a book by ID
app.delete('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found." });
    }

    const deletedBook = books.splice(bookIndex, 1);
    res.status(200).json({ message: "Book deleted successfully!", book: deletedBook[0] });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});