const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const bookFolderPath = path.join(__dirname, "storage", "bookList");

// Method to write an book to a file
function create(book) {
    try {
        book.id = crypto.randomBytes(16).toString("hex");
        const filePath = path.join(bookFolderPath, `${book.id}.json`);
        const fileData = JSON.stringify(book);
        fs.writeFileSync(filePath, fileData, "utf8");
        return book;
    } catch (error) {
        throw { code: "failedToCreatebook", book: error.book };
    }
}

// Method to get list of books in a folder by filter
function get(bookId) {
    try {
        const filePath = path.join(bookFolderPath, `${bookId}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw { code: "failedToReadEvent", book: error.book };
    }
}

// Method to get list of books in a folder by filter
function list({ authors = [], name = "", bookGenreIds = [] }) {
    try {
        const files = fs.readdirSync(bookFolderPath);
        const bookList = files.map((file) => {
            const fileData = fs.readFileSync(path.join(bookFolderPath, file), "utf8");
            return JSON.parse(fileData);
        });

        let filteredBooks = bookList;;
        //console.log("bookList: ", bookList);
        if (authors?.length > 0) {
            filteredBooks = filteredBooks.filter((book) => {
                return authors.some((author) => book.authors.includes(author));
            });
        }

        if (name) {
            filteredBooks = filteredBooks.filter((book) =>
                book.name.toLowerCase().includes(name.toLowerCase())
            );
        }

        if (bookGenreIds?.length > 0) {
            filteredBooks = filteredBooks.filter((book) =>
                book.bookGenres.some((genre) => bookGenreIds.includes(genre.id))
            );
        }

        return filteredBooks;
    } catch (error) {
        throw { code: "failedToListBooks", books: error.books };
    }
}

module.exports = {
    get,
    create,
    list,
};
