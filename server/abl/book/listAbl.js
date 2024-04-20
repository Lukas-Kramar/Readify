const Ajv = require("ajv");
const ajv = new Ajv();

const bookDao = require("../../dao/book-dao.js");

const schema = {
    type: "object",
    properties: {
        name: { type: "string" }, // text that is contained in name of books
        authors: { // names of books authors
            type: "array",
            items: { type: "string" }
        },
        bookGenreIds: { // books genres
            type: "array",
            items: { type: "string" }
        }
    },
    required: [],
    additionalProperties: false
};

async function listAbl(req, res) {
    try {
        // get request query or body
        const filter = req.body;
        

        // validate input
        const valid = ajv.validate(schema, filter);
        // console.log("valid: ", valid);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                books: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // list books by filter
        // console.log("filter: ", filter);
        const books = bookDao.list(filter);
        res.json(books);
    } catch (e) {
        res.status(500).json({ books: e.books });
    }
}


module.exports = listAbl;
