const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/readingList/getAbl");
const CreateAbl = require("../abl/readingList/createAbl");
const UpdateAlb = require("../abl/readingList/updateAbl");
const GetUserListsAbl = require("../abl/readingList/getUserListsAbl");
const AddBookAbl = require("../abl/readingList/addBookAbl");
const UpdateBookAbl = require("../abl/readingList/updateBookAbl");
const RemoveBookAbl = require("../abl/readingList/removeBookAbl");

router.get("/get", GetAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAlb);
router.get("/user-lists", GetUserListsAbl);

router.post("/add-book", AddBookAbl);
router.post("/update-book", UpdateBookAbl);
router.post("/remove-book", RemoveBookAbl);

module.exports = router;
