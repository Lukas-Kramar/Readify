const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const bookGenreFolderPath = path.join(__dirname, "storage", "bookGenreList");

// Method to write an bookGenre to a file
function create(bookGenre) {
    try {
        bookGenre.id = crypto.randomBytes(16).toString("hex");
        const filePath = path.join(bookGenreFolderPath, `${bookGenre.id}.json`);
        const fileData = JSON.stringify(bookGenre);
        fs.writeFileSync(filePath, fileData, "utf8");
        return bookGenre;
    } catch (error) {
        throw { code: "failedToCreateBookGenre", bookGenre: error.bookGenre };
    }
}

// Method to get list of bookGenres in a folder by filter
function get({ bookGenreId = "", bookGenreName = "" }) {
    try {
        if (bookGenreId) {
            const filePath = path.join(bookGenreFolderPath, `${bookGenreId}.json`);
            const fileData = fs.readFileSync(filePath, "utf8");
            const jsonResult = JSON.parse(fileData);
            return [jsonResult];
        }
        else {
            const files = fs.readdirSync(bookGenreFolderPath);
            const bookGenreList = files.map((file) => {
                const fileData = fs.readFileSync(path.join(bookGenreFolderPath, file), "utf8");
                return JSON.parse(fileData);
            });

            if (bookGenreName) {
                const filteredBookGenres = bookGenreList.filter((bookGenre) => bookGenre.name === bookGenreName);
                return filteredBookGenres;
            } else {
                return bookGenreList;
            }
        }
    } catch (error) {
        throw { code: "failedToListBookGenres", bookGenre: error.bookGenre };
    }
}

module.exports = {
    get,
    create,
};
