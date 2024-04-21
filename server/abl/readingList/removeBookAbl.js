const Ajv = require("ajv");
const ajv = new Ajv();

const readingListDao = require("../../dao/reading-list-dao.js");
const bookDao = require("../../dao/book-dao.js");

const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const schema = {
    type: "object",
    properties: {
        id: { type: "string" }, // generated unique id of review
        bookId: { type: "string" },
    },
    required: ["id", "bookId"],
    additionalProperties: false
};


async function RemoveBookAbl(req, res) {
    try {
        let readingList = req.body;

        // validate input
        const valid = ajv.validate(schema, readingList);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                readingList: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }
        // read readingList by given id
        const existingReadingList = readingListDao.get(readingList.id);
        if (!existingReadingList) {
            res.status(404).json({
                code: "readingListNotFound",
                readingList: `readingList ${readingList.id} not found`,
            });
            return;
        }
        const bookInListIndex = existingReadingList.readingListBooks.findIndex((bk) => bk.bookId === readingList.bookId)
        if (bookInListIndex === -1) {
            res.status(404).json({
                code: "bookIsNotInList",
                readingList: `Book is not present in the reading list`,
            });
            return;
        }

        existingReadingList.readingListBooks.splice(bookInListIndex, 1);
        const updatedReadingList = readingListDao.update(existingReadingList);
        res.json(updatedReadingList);
    } catch (e) {
        res.status(500).json({ readingList: e.readingList });
    }
}

module.exports = RemoveBookAbl;
