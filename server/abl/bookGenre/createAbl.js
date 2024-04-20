const Ajv = require("ajv");
const ajv = new Ajv();

const bookGenreDao = require("../../dao/book-genre-dao");

const schema = {
    type: "object",
    properties: {
        //id: { type: "string" }, //generated unique code ...
        name: { type: "string" }, // name of the book genre - unique - there can't be two genres with same name
        description: { type: "string" }, // brief description of the book genre
    },
    required: ["name", "description"],
    additionalProperties: false,
};

async function CreateAbl(req, res) {
    try {
        let bookGenre = req.body;

        // validate input
        const valid = ajv.validate(schema, bookGenre);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                bookGenre: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const exists = bookGenreDao.get({ bookGenreName: bookGenre.name });
        if (exists.length > 0) {
            res.status(400).json({
                code: "bookGenreIsAlreadyInDatabase",
                message: "Book genre name is already in database",
                bookGenre: exists,
                //validationError: ajv.errors,
            });
            return;
        }

        bookGenre = bookGenreDao.create(bookGenre);
        res.json(bookGenre);
    } catch (e) {
        res.status(500).json({ bookGenre: e.bookGenre });
    }
}

module.exports = CreateAbl;
