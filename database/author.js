const mongoose = require("mongoose");

// Comment from GITHUB.
// Create Author Schema 

const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;
