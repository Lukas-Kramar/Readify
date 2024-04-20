const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/book/getAbl");
const CreateAbl = require("../abl/book/createAbl");
const listAbl = require("../abl/book/listAbl");

router.get("/get", GetAbl);
router.post("/list", listAbl);
router.post("/create", CreateAbl);
// router.post("/update", UpdateAbl);
// router.post("/delete", DeleteAbl);

module.exports = router;
