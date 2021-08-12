const express = require("express");

var bodyParser = require("body-parser");/*Needed for post request*/



// Database 
const database = require("./database");

// Initialize express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

// GET REQUEST
/*
Route          /
Description    Get all books
access         PUBLIC
parameter      none
Methods        GET
*/
// To get all the books
booky.get("/",(req, res) => {
    return res.json({books: database.books});
});

/*
Route          /is
Description    Get specific book on ISBN number
access         PUBLIC
parameter      isbn
Methods        GET
*/

booky.get("/is/:isbn", (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.ISBN === req.params.isbn);

    if(getSpecificBook.length === 0) {
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`});
    }

    return res.json({book: getSpecificBook});
});

/*
Route          /c
Description    Get specific book on Category 
access         PUBLIC
parameter      category
Methods        GET
*/

booky.get("/c/:category", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );

    if(getSpecificBook.length === 0) {
        return res.json({error: `No book  found for the category of ${req.params.category}`})
    }

    return res.json({book: getSpecificBook});
});

/*
Route          /l
Description    Get specific book on Language 
access         PUBLIC
parameter      category
Methods        GET
*/

booky.get("/l/:language", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language === req.params.language
    );

    if(getSpecificBook.length === 0) {
        return res.json({error: `No book  found for the category of ${req.params.language}`})
    }

    return res.json({book: getSpecificBook});
});

/*
Route          /author
Description    Get all authors 
access         PUBLIC
parameter      none 
Methods        GET
*/

booky.get("/author", (req, res) => {
    return res.json({authors: database.author});
});

/*
Route          /author
Description    Get specific author based on ID 
access         PUBLIC
parameter      none 
Methods        GET
*/

booky.get("/author/:id", (req, res) => {

    const getAuthor = database.author.filter((author) => author.id == req.params.id);

    if(getAuthor.length === 0) {
        return res.json({error: `Data not available for id ${req.params.id}`});
    }

    return res.json({author: getAuthor});
});

/*
Route          /author/book
Description    Get specific author based on Books 
access         PUBLIC
parameter      isbn 
Methods        GET
*/

booky.get("/author/book/:isbn", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length === 0) {
        return res.json({error: `Author not available for book of ISBN number ${req.params.isbn}`});
    }

    return res.json({author: getSpecificAuthor});
});

/*
Route          /publication
Description    Get all publication
access         PUBLIC
parameter      none
Methods        GET
*/

booky.get("/publication", (req, res) => {
    return res.json({publications: database.publication});
});

/*
Route          /publication
Description    Get specific publication based on ID 
access         PUBLIC
parameter      id 
Methods        GET
*/

booky.get("/publication/:id", (req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.id == req.params.id
    );

    if(getSpecificPublication.length === 0) {
        return res.json({error: `Publication not available for this ID ${req.params.id}`});
    }

    return res.json({publication: getSpecificPublication});
});

/*
Route          /publication/book
Description    Get specific publication based on ISBN number of book 
access         PUBLIC
parameter      isbn
Methods        GET
*/

booky.get("/publication/book/:isbn", (req, res) => {

    const getSpecificPublication = database.publication.filter((publication) => publication.books.includes(req.params.isbn));

    if(getSpecificPublication.length === 0) {
        return res.json({error: `Publication not available for this ISBN number ${req.params.isbn}`});
    }
    return res.json({publication: getSpecificPublication});
});

// POST REQUEST

/*
Route          /book/new
Description    Post new book
access         PUBLIC
parameter      none
Methods        POST
*/

booky.post("/book/new", (req, res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
});

/*
Route          /publication/new
Description    Post new Publication
access         PUBLIC
parameter      none
Methods        POST
*/

booky.post("/publication/new", (req, res) => {
    const newPublication = req.body;
    database.publication.push(newPublication);
    return res.json({updatedPublications: database.publication});
});

/*
Route          /author/new
Description    Post new Author
access         PUBLIC
parameter      none
Methods        POST
*/

booky.post("/author/new", (req, res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json({updatedAuthors: database.author});
});

// PUT REQUEST

/*
Route          /publication/update/book/
Description    Update/Add new publication
access         PUBLIC
parameter      isbn
Methods        PUT
*/

booky.put("/publication/update/book/:isbn", (req, res) => {
    // Update Publication Database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);
        }
    });

    // Update Book Database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            book.publications = req.body.pubId;
            return;
        }
    });

    return res.json({
        books: database.books,
        publication: database.publication,
        message: "Successfully updated publication"
    });
});

// DELETE REQUEST

/*
Route          /book/delete/
Description    Delete a book
access         PUBLIC
parameter      isbn
Methods        DELETE
*/

booky.delete("/book/delete/:isbn", (req, res) => {
    // Whichever book that doesn't match with isbn just send that to an updatedBook database.
    // and rest will be filter out.
    const updatedBookDatabase = database.books.filter((book) => book.ISBN !== req.params.isbn);
    database.books = updatedBookDatabase;

    return res.json({books: database.books});
});

/*
Route          /book/delete/
Description    Delete author from book
access         PUBLIC
parameter      authorId
Methods        DELETE
*/

booky.delete("/book/delete/:isbn/:authorId", (req, res) => {
    
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter((eachAuthor) => eachAuthor !== parseInt(req.params.authorId));
            book.author = newAuthorList;
            return;
        }
    });

    return res.json({updatedBook: database.books});
    
});

/*
Route          /book/delete/author/
Description    Delete author from book and related book from author
access         PUBLIC
parameter      isbn, authorId
Methods        DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    // Update the book database.
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            const newAuhorList = book.author.filter((eachAuthor) => eachAuthor !== parseInt(req.params.authorId));
            book.author = newAuhorList;
            return;
        }
    });

    // Update the author database.
    database.author.forEach((eachAuthor) => {
        if(eachAuthor.id === parseInt(req.params.authorId)) {
            const newBookList = eachAuthor.books.filter((book) => book !== req.params.isbn);
            eachAuthor.books = newBookList;
            return;
        }
    });

    return res.json({book: database.books, author: database.author, message: "Author is deleted"});
});



booky.listen(3000, () => {
    console.log("Server is up and running");
});