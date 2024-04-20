const Ajv = require("ajv");
const ajv = new Ajv();

const readingListDao = require("../../dao/reading-list-dao.js");

const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", { validate: validateDateTime });

const schema = {
    type: "object",
    properties: {
        id: { type: "string" }, // id of reading list unique code
    },
    required: ["id",],
    additionalProperties: false
};


async function getAbl(req, res) {
    try {
        // get request query or body
        const reqParams = req.query?.id ? req.query : req.body;

        // validate input
        const valid = ajv.validate(schema, reqParams);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                readingList: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // read readingList by given id
        const readingList = readingListDao.get(reqParams.id);        
        if (!readingList) {
            res.status(404).json({
                code: "readingListNotFound",
                readingList: `readingList ${reqParams.id} not found`,
            });
            return;
        }

        res.json(readingList);
    } catch (e) {
        res.status(500).json({ readingList: e.readingList });
    }
}

module.exports = getAbl;
