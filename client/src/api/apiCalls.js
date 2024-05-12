import axios from 'axios';

// ADMIN
export const getAllBooks = async () => {
    try {
        const response = await axios.post('http://localhost:8000/book/list');
        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error; // Rethrow the error
    }
}

// USER

export const getBook = async (bookId) => {
    try {
        const response = await axios.get('http://localhost:8000/book/get?id=' + bookId);
        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error; // Rethrow the error
    }
}
export const createBook = async (book) => {
    try {
        const response = await axios.post('http://localhost:8000/book/create',
            book,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error; // Rethrow the error
    }
}


export const getBookGenre = async (bookGenre = "") => {
    try {
        const body = bookGenre ? { bookGenreName: bookGenre } : {};
        const response = await axios.post('http://localhost:8000/book-genre/get',
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error; // Rethrow the error
    }
}
export const createBookGenre = async (bookGenre) => {
    try {
        const response = await axios.post('http://localhost:8000/book-genre/create',
            bookGenre,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error; // Rethrow the error
    }
}

export const getUsersReadingLists = async () => {
    try {

        const response = await axios.get('http://localhost:8000/reading-list/user-lists');
        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error; // Rethrow the error
    }
}
export const getReadingList = async (id) => {
    try {
        const response = await axios.get('http://localhost:8000/reading-list/get?id=' + id,);
        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error; // Rethrow the error
    }
}
export const removeBookFromList = async (listId, bookId) => {
    try {
        const body = { id: listId, bookId: bookId };
        const response = await axios.post('localhost:8000/reading-list/remove-book',
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error; // Rethrow the error
    }
}



export const createReadingList = async (newReadingList) => {
    try {
        const response = await axios.post('http://localhost:8000/reading-list/create', newReadingList, {
            headers: {
                'Content-Type': 'application/json',
            },
        });


        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error creating shopping list:', error.message);
        throw error; // Rethrow the error
    }
};
export const updateReadingList = async (updatedList) => {
    try {
        console.log("update reading list: ", updatedList);
        const response = await axios.post('http://localhost:8000/reading-list/update', updatedList, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating shopping list:', error.message);
        throw error; // Rethrow the error
    }
};
export const updateBookInList = async (updateObject) => {
    try {
        const response = await axios.post('http://localhost:8000/reading-list/update-book', updateObject, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating shopping list:', error.message);
        throw error; // Rethrow the error
    }
};


export const getBookReview = async (id) => {
    try {
        const response = await axios.get('http://localhost:8000/book-review/get?id=' + id,);
        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error; // Rethrow the error
    }
}
export const createBookReview = async (bookReview) => {
    try {
        console.log("createBookReview: ", bookReview);
        const response = await axios.post('http://localhost:8000/book-review/create', bookReview, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating shopping list:', error.message);
        throw error; // Rethrow the error
    }
}
export const updateBookReview = async (bookReview) => {
    try {
        console.log("createBookReview: ", bookReview);
        const response = await axios.post('http://localhost:8000/book-review/update', bookReview, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating shopping list:', error.message);
        throw error; // Rethrow the error
    }
}

export const deleteShoppingList = async (listId) => {
    try {
        const response = await axios.post('http://localhost:3000/delete-list', { listId }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            return response.data; // Return retrieved data
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting shopping list:', error.message);
        throw error; // Rethrow the error
    }
};