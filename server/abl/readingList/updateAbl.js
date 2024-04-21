const Ajv = require("ajv");
const ajv = new Ajv();

const readingListDao = require("../../dao/reading-list-dao.js");

const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const schema = {
    type: "object",
    properties: {
        id: { type: "string" }, // generated unique code
        name: { type: "string" }, // name of the reading list
        readingListGenresIds: {
            type: "array",
            items: { type: "string" }
        },
        // readingListBooks: { // on creation it is empty array
        //     type: "array",
        //     items: {
        //         type: "object",
        //         properties: {
        //             bookId: { type: "string" }, // id of the book
        //             dateTimeStartedReading: { type: "string", format: "date-time" }, // when user started reading the book
        //             dateTimeFinishedReading: { type: "string", format: "date-time" }, // when user finished reading (null if not finished)
        //             reviewId: { type: "string" } // id of review - created after user finishes reading the book
        //         },
        //         required: ["bookId",],
        //         additionalProperties: false
        //     }
        // }
    },
    required: ["id", "name", "readingListGenresIds"],
    additionalProperties: false
};



async function UpdateAbl(req, res) {
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

        const updatedReadingList = readingListDao.update(readingList);

        if (!updatedReadingList) {
            res.status(404).json({
                code: "readingListNotFound",
                readingList: `readingList ${readingList.id} not found`,
            });
            return;
        }

        res.json(updatedReadingList);
    } catch (e) {
        res.status(500).json({ readingList: e.readingList });
    }
}

module.exports = UpdateAbl;
