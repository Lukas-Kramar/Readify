const Ajv = require("ajv");
const ajv = new Ajv();

const bookGenreDao = require("../../dao/book-genre-dao");

const schema = {
    type: "object",
    properties: {
        bookGenreId: { type: "string" },
        bookGenreName: { type: "string" },
    },
    required: [],
    additionalProperties: false,
};

async function GetAbl(req, res) {
    try {
        let filter = req.body;

        // validate input
        const valid = ajv.validate(schema, filter);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                filter: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const bookGenres = bookGenreDao.get(filter);       
        res.json(bookGenres);
    } catch (e) {
        res.status(500).json({ bookGenre: e.bookGenre });
    }
}

module.exports = GetAbl;



