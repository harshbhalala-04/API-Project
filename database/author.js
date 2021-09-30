const mongoose = require("mongoose");

// Create Author Schema 

// This comment is only for testing

const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;
