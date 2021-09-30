const mongoose = require("mongoose");

// Create Author Schema 

// This comment is only for testing

// This is comment from vs code.

const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;
