const Ajv = require("ajv");
const ajv = new Ajv();

const readingListDao = require("../../dao/reading-list-dao.js");

const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const schema = {
    type: "object",
    properties: {
        //id: { type: "string" }, // generated unique code
        name: { type: "string" }, // name of the reading list
        readingListGenresIds: {
            type: "array",
            items: { type: "string" }
        },
    },
    required: ["name", "readingListGenresIds",],
    additionalProperties: false
};

async function CreateAbl(req, res) {
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

        //const book = get(readingList);
        // would check if user has already review the book
        // if (bookExist.length > 0) {
        //     res.status(400).json({
        //         code: "bookIsAlreadyInDatabase",
        //         book: "book is already in database",
        //         validationError: ajv.errors,
        //     });
        // }

        readingList = readingListDao.create(readingList);
        res.json(readingList);
    } catch (e) {
        res.status(500).json({ readingList: e.readingList });
    }
}

module.exports = CreateAbl;
