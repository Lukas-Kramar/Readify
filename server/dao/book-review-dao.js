const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const bookReviewFolderPath = path.join(__dirname, "storage", "bookReviewList");

// Method to write an bookReview to a file
function create(bookReview) {
    try {
        bookReview.id = crypto.randomBytes(16).toString("hex");
        const created = new Date().toISOString();
        bookReview.dateTimeCreated = created;
        bookReview.dateTimeUpdated = created;
        bookReview.isPrivate = bookReview?.isPrivate ? bookReview.isPrivate : false;

        const filePath = path.join(bookReviewFolderPath, `${bookReview.id}.json`);
        const fileData = JSON.stringify(bookReview);     

        fs.writeFileSync(filePath, fileData, "utf8");
        return bookReview;
    } catch (error) {
        throw { code: "failedToCreateBookReview", bookReview: error.bookReview };
    }
}

// Method to get a bookReview in a folder by its id
function get(bookReviewId) {
    try {
        const filePath = path.join(bookReviewFolderPath, `${bookReviewId}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw { code: "failedToReadEvent", message: error.message };
    }
}

// Method to update note in a file
function update(bookReview) {
    try {
        const currentBookReview = get(bookReview.id);
        if (!currentBookReview) return null;
        const newBookReview = { ...currentBookReview, ...bookReview };
        const filePath = path.join(bookReviewFolderPath, `${bookReview.id}.json`);
        const fileData = JSON.stringify(newBookReview);

        const updated = new Date().toISOString();
        bookReview.dateTimeUpdated = updated;

        fs.writeFileSync(filePath, fileData, "utf8");
        return newBookReview;
    } catch (error) {
        throw { code: "failedToUpdateBookReview", bookReview: error.bookReview };
    }
}

// Method to get list of bookReviews in a folder by filter
function getPublicBookReviews(bookId) {
    try {
        const files = fs.readdirSync(bookReviewFolderPath);
        const bookReviewList = files.map((file) => {
            const fileData = fs.readFileSync(path.join(bookReviewFolderPath, file), "utf8");
            return JSON.parse(fileData);
        });

        const filteredBookReviews = bookReviewList.filter((bookReview) => bookReview.bookId === bookId && !bookReview.isPrivate);;
        return filteredBookReviews;
    } catch (error) {
        throw { code: "failedToListBookReviews", bookReview: error.bookReview };
    }
}

// Method to remove an note from a file
// TODO - impelement remove + write it into the uu-doc
// function remove(noteId) {
//     try {
//         const filePath = path.join(bookReviewFolderPath, `${noteId}.json`);
//         fs.unlinkSync(filePath);
//         return {};
//     } catch (error) {
//         if (error.code === "ENOENT") {
//             return {};
//         }
//         throw { code: "failedToRemoveNote", note: error.note };
//     }
// }

module.exports = {
    get,
    create,
    update,
    getPublicBookReviews,
    //remove,
};
