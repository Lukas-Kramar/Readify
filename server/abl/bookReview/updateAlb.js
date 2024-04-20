const Ajv = require("ajv");
const ajv = new Ajv();

const bookReviewDao = require("../../dao/book-review-dao.js");
const bookDao = require("../../dao/book-dao.js");


const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });


const schema = {
    type: "object",
    properties: {
        id: { type: "string" }, // generated unique code
        bookId: { type: "string" }, // id of book that for which is the review created
        review: {
            type: "object",
            properties: {
                rating: { type: "number", minimum: 0, maximum: 100 }, // user's rating of the book
                content: { type: "string" } // user's opinion on the book
            },
            required: ["rating", "content"],
            additionalProperties: false
        },
        dateTimeCreated: { type: "string", format: "date-time", },
        dateTimeUpdated: { type: "string", format: "date-time", }, //when was review updated 
        isPrivate: { type: "boolean" },
    },
    required: ["id", "bookId", "review", "dateTimeCreated"],
    additionalProperties: false
};

async function UpdateAbl(req, res) {
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

        const updatedBookReview = bookReviewDao.update(bookReview);

        if (!updatedBookReview) {
            res.status(404).json({
                code: "bookReviewNotFound",
                bookReview: `bookReview ${bookReview.id} not found`,
            });
            return;
        }

        res.json(updatedBookReview);
    } catch (e) {
        res.status(500).json({ bookReview: e.bookReview });
    }
}

module.exports = UpdateAbl;
