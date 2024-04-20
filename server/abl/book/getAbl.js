const Ajv = require("ajv");
const ajv = new Ajv();

const bookDao = require("../../dao/book-dao.js");
const schema = {
    type: "object",
    properties: {
        id: { type: "string" },
    },
    required: ["id"],
    additionalProperties: false
};

async function GetAbl(req, res) {
    try {
        // get request query or body
        const reqParams = req.query?.id ? req.query : req.body;

        // validate input
        const valid = ajv.validate(schema, reqParams);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                book: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // read book by given id
        const book = bookDao.get(reqParams.id);
        if (!book) {
            res.status(404).json({
                code: "bookNotFound",
                book: `book ${reqParams.id} not found`,
            });
            return;
        }

        res.json(book);
    } catch (e) {
        res.status(500).json({ book: e.book });
    }
}

module.exports = GetAbl;
