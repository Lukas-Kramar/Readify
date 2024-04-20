const Ajv = require("ajv");
const ajv = new Ajv();

const bookReviewDao = require("../../dao/book-review-dao.js");
const bookDao = require("../../dao/book-dao.js");

const schema = {
    type: "object",
    properties: {
        bookId: { type: "string" },
    },
    required: ["bookId"],
    additionalProperties: false
};

async function GetPublicBookReviewsAbl(req, res) {
    try {
        // get request query or body
        const reqParams = req.query?.bookId ? req.query : req.body;

        // validate input
        const valid = ajv.validate(schema, reqParams);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                bookReview: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const book = bookDao.get(reqParams.bookId);
        if (!book) {
            res.status(404).json({
                code: "bookNotFound",
                book: `book ${reqParams.bookId} not found`,
            });
            return;
        }

        // read bookReview by given bookId
        const bookReview = bookReviewDao.getPublicBookReviews(reqParams.bookId);
        res.json(bookReview);
    } catch (e) {
        res.status(500).json({ bookReview: e.bookReview });
    }
}


module.exports = GetPublicBookReviewsAbl;
