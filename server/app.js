const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

const bookControler = require("./controller/book");
const bookGenreControler = require("./controller/bookGenre");
const bookReviewControler = require("./controller/bookReview");
const readingListControler = require("./controller/readingList");

app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World from Readify!");
});

app.use("/book", bookControler);
app.use("/book-genre", bookGenreControler);
app.use("/book-review", bookReviewControler);
app.use("/reading-list", readingListControler);

app.listen(port, () => {
  console.log(`Readify app server is listening on port ${port}`);
});
