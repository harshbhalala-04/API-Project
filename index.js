require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");/*Needed for post request*/

// Database 
const database = require("./database/database");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// Initialize express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

// Connect mongoose with your mongoDB

mongoose.connect(process.env.MONGO_URL, 
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
).then(() => console.log("Connection Established"));

// GET REQUEST
/*
Route          /
Description    Get all books
access         PUBLIC
parameter      none
Methods        GET
*/
// To get all the books
booky.get("/", async (req, res) => {
    const getAllBook = await BookModel.find();
    return res.json(getAllBook);
});

/*
Route          /author
Description    Get all authors 
access         PUBLIC
parameter      none 
Methods        GET
*/

booky.get("/author", async (req, res) => {
    const getAllAuthor = await AuthorModel.find();
    return res.json(getAllAuthor);
});

/*
Route          /publication
Description    Get all publication
access         PUBLIC
parameter      none
Methods        GET
*/

booky.get("/publication",async (req, res) => {
    const getAllPublication = await PublicationModel.find();
    return res.json(getAllPublication);
});

/*
Route          /is
Description    Get specific book on ISBN number
access         PUBLIC
parameter      isbn
Methods        GET
*/

booky.get("/is/:isbn", async (req, res) => {

    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});


    if(!getSpecificBook) {
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

booky.get("/c/:category", async (req, res) => {

    const getSpecificBook = await BookModel.findOne({category: req.params.category});

    if(!getSpecificBook) {
        return res.json({error: `No book found for the category of ${req.params.category}`});
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

booky.get("/l/:language", async (req, res) => {
    const getSpecificBook = await BookModel.find({language: req.params.language});

    if(!getSpecificBook) {
        return res.json({error: `No book  found for the language ${req.params.language}`})
    }

    return res.json({book: getSpecificBook});
});



/*
Route          /author
Description    Get specific author based on ID 
access         PUBLIC
parameter      none 
Methods        GET
*/

booky.get("/author/:id", /*async*/ (req, res) => {

    // const getAuthor = await AuthorModel.findOne({id: req.params.id});

    // if(!getAuthor) {
    //     return res.json({error: `Data not available for id ${req.params.id}`});
    // }

    // return res.json({author: getAuthor});
    const getSpecificAuthor = database.author.filter((au) => au.id == req.params.id);
    if(getSpecificAuthor.length === 0) {
        return res.json({error: `Data not available for id ${req.params.id}`});
    }
    return res.json({author: getSpecificAuthor});
});

/*
Route          /author/book
Description    Get specific author based on Books 
access         PUBLIC
parameter      isbn 
Methods        GET
*/

booky.get("/author/book/:isbn",  async (req,res) => {

    const getSpecificAuthor = await AuthorModel.find({books: req.params.isbn});

    if(!getSpecificAuthor) {
        return res.json({error: `Author not available for book of ISBN number ${req.params.isbn}`});
    }

    return res.json({author: getSpecificAuthor});
});



/*
Route          /publication
Description    Get specific publication based on ID 
access         PUBLIC
parameter      id 
Methods        GET
*/

booky.get("/publication/:id", async (req,res) => {
    
    const getSpecificPublication = await PublicationModel.findOne({id: req.params.id});

    if(!getSpecificPublication) {
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

booky.get("/publication/book/:isbn",async (req, res) => {

    const getSpecificPublication = await PublicationModel.findOne({books: req.params.isbn});

    if(!getSpecificPublication) {
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

booky.post("/book/new", async (req, res) => {
    const {newBook} = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json({books: addNewBook, message: "Book added successfully!!"});
});

/*
Route          /publication/new
Description    Post new Publication
access         PUBLIC
parameter      none
Methods        POST
*/

booky.post("/publication/new", (req, res) => {
    const {newPublication} = req.body;
    const addNewPublication = PublicationModel.create(newPublication);
    return res.json({publication: addNewPublication, message: "Publication added Successfully"});
});

/*
Route          /author/new
Description    Post new Author
access         PUBLIC
parameter      none
Methods        POST
*/

booky.post("/author/new",async (req, res) => {
    const {newAuthor} = req.body;
    const addNewAuthor = AuthorModel.create(newAuthor);
    return res.json({authors: addNewAuthor, message: "Author added successfully!!"});
});

// PUT REQUEST

/*
Route          /book/update
Description    Update book on isbn
access         PUBLIC
parameter      isbn
Methods        PUT
*/

booky.put("/book/update/:isbn", async (req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            title: req.body.bookTitle,
        },
        {
            new: true
        }
    );
    return res.json({books: updatedBook});
});

/*
Route          /book/author/update
Description    Update/add new Author
access         PUBLIC
parameter      isbn
Methods        PUT
*/

booky.put("/book/author/update/:isbn", async (req, res) => {
    // Update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet: {
                author: req.body.newAuthor
            }
        },
        {
            new: true  
        }
    );

    // Update author database
    const updateAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor
        },
        {
            $addToSet: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );

    return res.json({
        books: updatedBook,
        authors: updateAuthor,
        message: "New Author was added"
    });
});




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

booky.delete("/book/delete/:isbn", async (req, res) => {
    // Whichever book that doesn't match with isbn just send that to an updatedBook database.
    // and rest will be filter out.
    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        }
    );

    return res.json({
        books: updatedBookDatabase
    });
});

/*
Route          /book/delete/
Description    Delete author from book
access         PUBLIC
parameter      authorId
Methods        DELETE
*/

booky.delete("/book/delete/:isbn/:authorId", async (req, res) => {
    
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