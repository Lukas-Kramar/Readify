const Ajv = require("ajv");
const ajv = new Ajv();

const bookDao = require("../../dao/book-dao.js");

const bookGenreSchema = {
    type: "object",
    properties: {
        id: { type: "string" }, // generated unique code
        name: { type: "string" } // name of the book
    },
    required: ["id", "name"],
    additionalProperties: false
};

const schema = {
    type: "object",
    properties: {
        // id: { type: "string" }, // generated unique code
        name: { type: "string" }, // name of the book
        authors: { // list with names of the book's authors
            type: "array",
            items: { type: "string" }
        },
        bookDescription: { type: "string" }, // description of the book
        bookGenres: {
            type: "array",
            items: bookGenreSchema
        }
    },
    required: ["name", "authors", "bookDescription", "bookGenres"],
    additionalProperties: false
};

async function CreateAbl(req, res) {
    try {
        let book = req.body;

        // validate input
        const valid = ajv.validate(schema, book);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                book: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const bookExist = bookDao.list({ authors: book.authors, name: book.name });
        if (bookExist.length > 0) {
            res.status(400).json({
                code: "bookIsAlreadyInDatabase",
                book: "book is already in database",
                //validationError: ajv.errors,
            });
            return;
        }

        book = bookDao.create(book);
        res.json(book);
    } catch (e) {
        res.status(500).json({ book: e.book });
    }
}

module.exports = CreateAbl;