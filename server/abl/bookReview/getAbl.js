const Ajv = require("ajv");
const ajv = new Ajv();

const bookReviewDao = require("../../dao/book-review-dao.js");

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
                bookReview: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // read bookReview by given id
        const bookReview = bookReviewDao.get(reqParams.id);
        if (!bookReview) {
            res.status(404).json({
                code: "bookReviewNotFound",
                bookReview: `bookReview review ${reqParams.id} not found`,
            });
            return;
        }

        res.json(bookReview);
    } catch (e) {
        res.status(500).json({ bookReview: e.bookReview });
    }
}

module.exports = GetAbl;
