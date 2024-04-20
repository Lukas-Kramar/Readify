const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/readingList/getAbl");
const CreateAbl = require("../abl/readingList/createAbl");
const UpdateAlb = require("../abl/readingList/updateAbl");
const GetUserListsAbl = require("../abl/readingList/getUserListsAbl");

router.get("/get", GetAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAlb);
router.get("/user-lists", GetUserListsAbl);

// router.post("/update", GetPublicBookReviews);
// router.post("/delete", DeleteAbl);

module.exports = router;
