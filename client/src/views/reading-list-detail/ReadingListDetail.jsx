import React, { useEffect, useState } from "react";

import IconButton from "../../components/buttons/IconButton";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import { createBookReview, createReadingList, getBook, getBookGenre, getBookReview, getReadingList, removeBookFromList, updateBookInList, updateBookReview } from "../../api/apiCalls";
import BasicModal from "../../components/modals/BasicModal";
import Badge from "react-bootstrap/esm/Badge";

import dayjs from "dayjs"
import { useLocation, useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

// const BookItem = (props) => {
//     const { book } = props;

//     // console.log("book.name", book);
//     const [bookApi, setBookApi] = useState(null);

//     useEffect(() => {
//         const fetchBook = async () => {
//             try {
//                 const result = await getBook(book.bookId);
//                 setBookApi(result);
//             } catch (err) {
//                 console.warn("fetchBook - error: ", err);
//             }
//         }
//         fetchBook();
//     }, [book.bookId]);

//     if (!book) return null;
//     return (
//         <div className="d-flex rounded p-2 justify-content-between flex-row bg-info mb-2">

//             <div>
//                 {bookApi ?
//                     <h5>{bookApi.name}</h5>
//                     :
//                     <Spinner animation="border" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </Spinner>
//                 }
//             </div>

//             <div>
//                 <p>Rozečteno: {book.dateTimeStartedReading ? dayjs(book.dateTimeStartedReading).format('DD.MM.YYYY') : "---"}</p>
//             </div>

//             <div>
//                 <p>Dočteno: {book.dateTimeFinishedReading ? dayjs(book.dateTimeFinishedReading).format('DD.MM.YYYY') : "---"}</p>
//             </div>
//         </div>
//     )
// }

const BookItem = (props) => {
    const { book, bookGenres, setModalVersion, setEditedBook, setEditBookReview } = props;

    const [listGenres, setListGenres] = useState([]);
    const [bookApi, setBookApi] = useState(null);
    const [bookReview, setBookReview] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const result = await getBook(book.bookId);

                if (book.reviewId) {
                    const reviewResult = await getBookReview(book.reviewId);
                    setBookReview(reviewResult);
                }

                // Filter bookGenres to keep only those that have the same id as one of the readingList.readingListGenresIds
                const filteredGenres = bookGenres.filter(genre => result.bookGenreIds.includes(genre.id));

                setListGenres(filteredGenres);
                setBookApi(result);
            } catch (err) {
                console.warn("fetchBook - error: ", err);
            }
        }

        if (!book || bookGenres.length < 1) { return; }

        fetchBook();
    }, [bookGenres, book]);

    if (!bookApi) return null;
    return (
        <Row className="bg-secondary mb-3 pb-2 rounded">
            <Col xs={5} className="mt-3">
                <h3>{bookApi.name}</h3>
                <p>
                    {listGenres.map((genre) => <Badge className="me-1" bg="primary" >{genre.name}</Badge>)}
                </p>
            </Col>

            <Col xs={7} className="d-flex gap-2  justify-content-end align-items-center">
                <IconButton
                    text="Smazat"
                    onClick={() => { setEditedBook(bookApi); setModalVersion('remove-book') }}
                    //icon={faPlus}
                    variant="danger"
                    styling=""
                />
            </Col>

            <Col xs={12} className="">
                <Row>
                    <Col>
                        <p className="bg-info rounded p-2">
                            <strong>Rozečteno:</strong> <br />
                            <span className="fw-bold">{book.dateTimeStartedReading ? dayjs(book.dateTimeStartedReading).format('DD.MM.YYYY') : "---"}</span>
                        </p>
                        <div>
                            <IconButton
                                text="Upravit"
                                onClick={() => { setEditedBook(book); setModalVersion('edit-started-reading-book') }}
                                //icon={faPlus}
                                variant="outline-warning"
                                styling=""
                            />
                        </div>
                    </Col>
                    <Col>
                        <p className="bg-info rounded p-2">
                            <strong>Dočteno:</strong> <br />
                            <span className="fw-bold">{book.dateTimeFinishedReading ? dayjs(book.dateTimeFinishedReading).format('DD.MM.YYYY') : "---"}</span>
                        </p>
                        <div className="d-flex">
                            <IconButton
                                text="Upravit"
                                onClick={() => { setEditedBook(book); setModalVersion('edit-finished-reading-book') }}
                                //icon={faPlus}
                                variant="outline-warning"
                                styling="me-1"
                            //disabled={state !== "done"}
                            />
                            <IconButton
                                text={bookReview?.bookId ? "Upravit recenzi" : "Vytvořit recenzi"}
                                onClick={() => {
                                    if (bookReview?.bookId) { setEditBookReview(bookReview); }
                                    console.log("BOOK API: ", bookApi);
                                    setEditedBook(bookApi);
                                    setModalVersion('edit-book-review')
                                }}
                                //icon={faPlus}
                                variant="outline-warning"
                                styling=""
                            />
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

const ReadingListDetail = (props) => {
    const { } = props;

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    // const { id } = useParams();

    const [readingList, setReadingList] = useState(null);
    const [modalVersion, setModalVersion] = useState("");

    //Modal states
    const [formChanged, setFormChanged] = useState(false);
    // Todo - authors needs to be converted to array of strings
    const [editBook, setEditedBook] = useState({ name: "", readingListGenresIds: [] })
    const [editBookReview, setEditBookReview] = useState({ review: { rating: 50, content: "" } });

    const [bookGenres, setBookGenres] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const closeModal = () => {
        setModalVersion("");
    }

    const updateListHandler = async () => {
        try {
            setIsLoading(true);
            console.log("modal version:", modalVersion);
            if (modalVersion === "create-reading-list") {
                const result = await createReadingList(editBook);
                setReadingList([...readingList, result]);
                // test add value check
                console.log("Creating list");
            }
            else {
                const updateListObject = {
                    id: readingList.id,
                    book: editBook
                }

                const result = await updateBookInList(updateListObject);
                setReadingList(result);
            }

            setEditedBook({ name: "", readingListGenresIds: [] });
            closeModal();
        }
        catch (err) {
            console.warn(err);
        }
        finally {
            setIsLoading(false);
        }
    }
    const createBookReviewHandler = async () => {
        try {
            setIsLoading(true);
            if (!editBookReview.bookId) { //"edit-book-review" || modalVersion === "create-book-review"
                console.log("edit book: ", editBook);
                console.log("editBookReview: ", editBookReview);
                console.log("readingList: ", readingList);
                const result = await createBookReview({ ...editBookReview, bookId: editBook.id });

                const listBook = readingList.readingListBooks.find(book => book.bookId === editBook.id);
                const bookWithReviewId = { ...listBook, reviewId: result.id };
                const resultBookUpdate = await updateBookInList({ id: readingList.id, book: bookWithReviewId });
                setReadingList(resultBookUpdate);
            }
            else {
                const result = await updateBookReview(editBookReview);

                const listBook = readingList.readingListBooks.find(book => book.bookId === editBook.id);
                const bookWithReviewId = { ...listBook, reviewId: result.id };
                const resultBookUpdate = await updateBookInList({ id: readingList.id, book: bookWithReviewId });
                setReadingList(resultBookUpdate);
            }

            setEditedBook({ name: "", readingListGenresIds: [] });
            setEditBookReview({ review: { rating: 50, content: "" } });
            closeModal();
        }
        catch (err) {
            console.warn(err);
        }
        finally {
            setIsLoading(false);
        }
    }

    const removeBookHandler = async () => {
        try {
            if (editBook.id) {
                // const result = await remove(editBook);
                // setReadingList([...readingList, result]);
                // // test add value check
                console.log("Removing list list");
            }
            else {
                console.warn("invalid reading list to delete");
            }

            setEditedBook({ name: "", readingListGenresIds: [] });
            closeModal();
        }
        catch (err) {
            console.warn(err);
        }
    }
    const removeBookFromListHandler = () => {
        try {
            const result = removeBookFromList(readingList.id, editBook.bookId);
            console.log("REMOVED BOOK FROM LIST RESULT: ", result);
        } catch (err) {
            console.warn("removeBookFromListHandler - error: ", err)
        }
    }

    useEffect(() => {
        const fetchReadingLists = async () => {
            const fetchBookGenres = async () => {
                try {
                    const result = await getBookGenre();
                    setBookGenres(result);
                } catch (err) {
                    console.warn("fetchBookGenres - error: ", err);
                }
            };

            try {
                setIsLoading(true);
                const result = await getReadingList(id);
                await fetchBookGenres();
                setReadingList(result);
            } catch (err) {
                console.warn("fetchReadingLists - error: ", err);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchReadingLists();
    }, [id]);

    if (!readingList) {
        return (
            <Container>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        )
    }

    return (
        <>

            {/* CREATE NEW READING LIST MODAL */}
            <BasicModal
                visible={modalVersion === "edit-started-reading-book" || modalVersion === "edit-finished-reading-book"}
                title={`Datum ${modalVersion === "edit-started-reading-book" ? "rozečtení knihy" : "dočtení knihy"}`}
                closeButtonText={'Zavřít'}
                actionButtonText={"Uložit"}
                onActionButtonClick={updateListHandler}
                // Todo add disabled book handler
                onCloseButtonClick={closeModal}
                actionButtonDisabled={modalVersion === "edit-started-reading-book" ? !(editBook?.dateTimeStartedReading) : !(editBook?.dateTimeFinishedReading)}
            >
                <Form noValidate onSubmit={updateListHandler}>

                    <Form.Group className="mb-3" controlId="listName">
                        <Form.Label>Datum:</Form.Label>
                        <Form.Control
                            required
                            type="date"
                            value={modalVersion === "edit-started-reading-book" ?
                                dayjs(editBook.dateTimeStartedReading).format('YYYY-MM-DD') :
                                dayjs(editBook.dateTimeFinishedReading).format('YYYY-MM-DD')
                            }
                            // isValid={editBook.name.length > 4 && formChanged}
                            onChange={(val) => {
                                console.log("val.target.vaue", val.target.value);
                                setFormChanged(true);
                                setEditedBook((prevState) => {
                                    return modalVersion === "edit-started-reading-book" ?
                                        { ...prevState, dateTimeStartedReading: val.target.value } :
                                        { ...prevState, dateTimeFinishedReading: val.target.value }
                                });
                            }}
                        />
                        < Form.Control.Feedback >Skvělé!</Form.Control.Feedback>
                    </Form.Group>

                </Form>

            </BasicModal >

            {/* REMOVE BOOK FROM LIST MODAL */}
            <BasicModal
                visible={modalVersion === "remove-book"}
                title={`Odstranit knihu ze seznamu`}
                closeButtonText={'Zavřít'}
                actionButtonText={"Odstranit"}
                onActionButtonClick={removeBookFromListHandler}
                actionButtonVariant="danger"
                onCloseButtonClick={closeModal}
            >
                <p>Opravdu chcete ze seznamu odstranit knihu <span className="fw-bold">{editBook.name}</span>?</p>
                {isLoading &&
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                }
            </BasicModal>

            {/* CREATE BOOK REVIEW MODAL */}
            <BasicModal
                visible={modalVersion === "edit-book-review" || modalVersion === "create-book-review"}
                title={`Hodnocení knihy: ${editBook?.name}`}
                closeButtonText={'Zavřít'}
                actionButtonText={"Uložit"}
                onActionButtonClick={createBookReviewHandler}
                // Todo add disabled book handler
                onCloseButtonClick={closeModal}
                actionButtonDisabled={editBookReview.review.content < 5}
            >
                <Form noValidate onSubmit={createBookReviewHandler}>

                    <Form.Group className="mb-3" controlId="bookReviewRating">
                        <Form.Label>Hodnocení: {editBookReview.review.rating}</Form.Label>
                        <Form.Range
                            required
                            value={editBookReview.review.rating}
                            onChange={(val) => {
                                const updatedValue = { ...editBookReview }
                                updatedValue.review.rating = Number(val.target.value);
                                setEditBookReview(updatedValue)
                            }}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="bookDescription">
                        <Form.Label>Názor na knihu</Form.Label>
                        <Form.Control
                            aria-label="Popis knihy"
                            as="textarea"
                            rows={4}
                            required
                            type="text"
                            value={editBookReview.review.content}
                            isValid={editBookReview.review.content.length > 5 && formChanged}
                            onChange={(val) => {
                                setFormChanged(true);
                                const updatedValue = { ...editBookReview }
                                updatedValue.review.content = val.target.value;
                                setEditBookReview(updatedValue)
                            }}
                        />
                        < Form.Control.Feedback >Skvělé!</Form.Control.Feedback>
                    </Form.Group>

                </Form>

            </BasicModal >

            <Container>
                <Row className="mb-4">
                    <Col>
                        <h1>Literární seznam: {readingList.name}</h1>
                    </Col>

                    <Col className="d-flex justify-content-end align-items-center">
                        <IconButton
                            text="Přidat novou knihu"
                            onClick={() => navigate('/explore')}
                            //icon={faPlus}
                            styling=""
                        //disabled={state !== "done"}
                        />
                    </Col>
                </Row>

                {isLoading ?
                    <Row>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </Row>
                    :
                    (readingList.readingListBooks.length > 0 ?
                        readingList.readingListBooks.map((book) =>
                            <BookItem
                                key={book?.bookId}
                                book={book}
                                bookGenres={bookGenres}
                                setModalVersion={setModalVersion}
                                setEditedBook={setEditedBook}
                                setEditBookReview={setEditBookReview}
                            />
                        )
                        :
                        <Alert>List neobsahuje žádné knihy</Alert>
                    )
                }

            </Container>
        </>

    );
}

export default ReadingListDetail;