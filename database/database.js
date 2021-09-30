const books = [
    {
        ISBN: "1book",
        title: "Tesla",
        pubDate: "2021-08-05",
        language: "En",
        numPage: 250,
        author: [1,2],/*Id of authors*/
        publications: [1],
        category: ["tech", "space", "education"]
    }
];

const author = [
    {
        id: 1,
        name: "Harsh",
        books: ["1book", "2book"]/*Book ISBN number*/
    },
    {
        id: 2,
        name: "Elon musk",
        books: ["1book"]
    }
];

const publication = [
    {
        id: 1,
        name: "writex",
        books: ["1book"]
    },
    {
        id: 2,
        name: "writex2",
        books: []
    }
];

module.exports = {books, author, publication};