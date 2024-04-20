const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/bookGenre/getAbl");
const CreateAbl = require("../abl/bookGenre/createAbl");

router.post("/get", GetAbl);
// router.get("/list", ListAbl);
router.post("/create", CreateAbl);
// router.post("/update", UpdateAbl);
// router.post("/delete", DeleteAbl);

module.exports = router;
