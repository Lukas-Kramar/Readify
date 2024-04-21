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
        book: {
            type: "object",
            properties: {
                bookId: { type: "string" }, // id of the book
                dateTimeStartedReading: { type: "string", format: "date-time" }, // when user started reading the book
                dateTimeFinishedReading: { type: "string", format: "date-time" }, // when user finished reading (null if not finished)
                reviewId: { type: "string" } // id of review - created after user finishes reading the book
            },
            required: ["bookId",],
            additionalProperties: false
        },
    },
    required: ["id", "book"],
    additionalProperties: false
};


async function AddBookAbl(req, res) {
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

        const readingListBook = readingList.book;
        const book = bookDao.get(readingListBook.bookId);
        if (!book) {
            res.status(404).json({
                code: "bookNotFound",
                book: `book ${readingListBook.bookId} not found`,
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

        if (existingReadingList.readingListBooks.some((bk) => {
            // console.log("bk.bookId:", bk.bookId);
            // console.log("readingListBook.bookId:", readingListBook.bookId);
            return bk.bookId === readingListBook.bookId
        })) {
            res.status(404).json({
                code: "bookIsAlreadyInReadingList",
                readingList: `Book is already in the reading list`,
            });
            return;
        }
        let invalidGenres = true;
        book.bookGenreIds.forEach((bookGenreId) => {
            if (existingReadingList.readingListGenresIds.some((genreId) => genreId === bookGenreId)) {
                invalidGenres = false;
                return;
            }
        });
        if (invalidGenres) {
            res.status(404).json({
                code: "listDoesntAllowBooksGenres",
                readingList: `list doesnt allow genres ${existingReadingList.readingListGenresIds.toString()} of this books ${readingListBook.bookGenreIds.toString()}`,
            });
            return;
        }

        const addBook = {
            dateTimeStartedReading: "",
            dateTimeFinishedReading: "",
            reviewId: "",
            ...readingListBook
        }
        existingReadingList.readingListBooks.push(addBook);
        const updatedReadingList = readingListDao.update(existingReadingList);
        res.json(updatedReadingList);
    } catch (e) {
        console.warn("error: ", e);
        res.status(500).json({ readingList: e.readingList });
    }
}

module.exports = AddBookAbl;
