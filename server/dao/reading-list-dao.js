const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const readingListFolderPath = path.join(__dirname, "storage", "readingListList");

// Method to write an readingList to a file
function create(readingList) {
    try {
        readingList.id = crypto.randomBytes(16).toString("hex");
        readingList.readingListBooks = [];
        const filePath = path.join(readingListFolderPath, `${readingList.id}.json`);
        const fileData = JSON.stringify(readingList);

        fs.writeFileSync(filePath, fileData, "utf8");
        return readingList;
    } catch (error) {
        throw { code: "failedToCreateReadingList", readingList: error.readingList };
    }
}

// Method to get reading list in a folder by filter
function get(readingListId) {
    try {
        // console.log("reading list id: ", readingListId);
        const filePath = path.join(readingListFolderPath, `${readingListId}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);

    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw { code: "failedToGetReadingList", readingList: error.readingList };
    }
}

// Method to update readingList in a file
function update(readingList) {
    try {
        const currentReadingList = get(readingList.id);
        if (!currentReadingList) return null;
        const newReadingList = { ...currentReadingList, ...readingList };
        const filePath = path.join(readingListFolderPath, `${readingList.id}.json`);
        const fileData = JSON.stringify(newReadingList);
        fs.writeFileSync(filePath, fileData, "utf8");
        return newReadingList;
    } catch (error) {
        throw { code: "failedToUpdateReadingList", readingList: error.readingList };
    }
}

// Method to get list of bookGenres in a folder by filter
// TODO - remove from work document because users are not implemented???
function getUserLists(userId) {
    try {
        const files = fs.readdirSync(readingListFolderPath);
        const readingListsList = files.map((file) => {
            const fileData = fs.readFileSync(path.join(readingListFolderPath, file), "utf8");
            return JSON.parse(fileData);
        });
        // users are not implemented for this project
        //const filteredLists = readingListsList.filter((readingList) => readingList.ownwerId === userId);
        return readingListsList;
    } catch (error) {
        throw { code: "failedToListReadingLists", readingList: error.readingList };
    }
}



// Method to read an note from a file
// function get(noteId) {
//     try {
//         const filePath = path.join(readingListFolderPath, `${noteId}.json`);
//         const fileData = fs.readFileSync(filePath, "utf8");
//         return JSON.parse(fileData);
//     } catch (error) {
//         if (error.code === "ENOENT") return null;
//         throw { code: "failedToReadNote", note: error.note };
//     }
// }



// Method to remove an note from a file
// TODO - impelement remove + write it into the uu-doc
// function remove(noteId) {
//     try {
//         const filePath = path.join(readingListFolderPath, `${noteId}.json`);
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
    getUserLists,
    //remove,
    //list,
};
