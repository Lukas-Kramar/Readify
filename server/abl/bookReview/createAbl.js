const Ajv = require("ajv");
const ajv = new Ajv();

const bookReviewDao = require("../../dao/book-review-dao.js");
const bookDao = require("../../dao/book-dao.js");

const schema = {
    type: "object",
    properties: {
        bookId: { type: "string" }, // generated unique code
        review: {
            type: "object",
            properties: {
                rating: { type: "number", minimum: 0, maximum: 100 }, // user's rating of the book
                content: { type: "string" } // user's opinion on the book
            },
            required: ["rating", "content"],
            additionalProperties: false
        },
        isPrivate: { type: "boolean" }
    },
    required: ["bookId", "review"],
    additionalProperties: false
};



async function CreateAbl(req, res) {
    try {
        let bookReview = req.body;

        // validate input
        const valid = ajv.validate(schema, bookReview);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                bookReview: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const book = bookDao.get(bookReview.bookId);
        if (!book) {
            res.status(404).json({
                code: "bookNotFound",
                book: `book ${bookReview.bookId} not found`,
            });
            return;
        }

        //const bookReviewFromUserExists = get(bookReview);
        // would check if user has already reviewed the book
        // if (bookExist.length > 0) {
        //     res.status(400).json({
        //         code: "bookIsAlreadyInDatabase",
        //         bookReviewFromUserExists: "User's review on this book is already in the database",
        //         validationError: ajv.errors,
        //     });
        // }

        bookReview = bookReviewDao.create(bookReview);
        res.json(bookReview);
    } catch (e) {
        // console.log("e: ", e);
        res.status(500).json({ bookReview: e.bookReview });
    }
}

module.exports = CreateAbl;
