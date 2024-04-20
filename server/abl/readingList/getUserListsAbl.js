const Ajv = require("ajv");
const ajv = new Ajv();

const readingListDao = require("../../dao/reading-list-dao.js");

const schema = {
    type: "object",
    properties: {
        userId: { type: "string" },
    },
    required: [], // if the users were implemented in the project userId would be required
    additionalProperties: false
};

async function getUserListsAbl(req, res) {
    try {
        // get request query or body
        const reqParams = req.query?.userId ? req.query : req.body;

        // validate input
        const valid = ajv.validate(schema, reqParams);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                readingLists: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // read readingLists by given userId
        const readingLists = readingListDao.getUserLists(reqParams.userId);
        res.json(readingLists);
    } catch (e) {
        res.status(500).json({ readingLists: e.readingLists });
    }
}


module.exports = getUserListsAbl;
