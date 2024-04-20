const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/bookReview/getAbl");
const CreateAbl = require("../abl/bookReview/createAbl");
const UpdateAlb = require("../abl/bookReview/updateAlb");
const GetPublicBookReviews = require("../abl/bookReview/getPublicBookReviewsAbl");

router.get("/get", GetAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAlb);
router.get("/book-public-review-lists", GetPublicBookReviews);

module.exports = router;
