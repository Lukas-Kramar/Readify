import React, { useEffect, useState } from "react";

import IconButton from "../../components/buttons/IconButton";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import { createReadingList, getAllBooks, getBook, getBookGenre, getUsersReadingLists, updateReadingList } from "../../api/apiCalls";
import BasicModal from "../../components/modals/BasicModal";
import Badge from "react-bootstrap/esm/Badge";

import dayjs from "dayjs"
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";

const BookCard = (props) => {
    const { book, bookGenres } = props;

    if (!book) return null;
    return (
        <Card>
            <Card.Body>
                <Card.Title>{book.name}</Card.Title>
                <Card.Text>
                    {book.bookDescription}
                </Card.Text>

                <p>
                    <span className="fw-bold">Autoři:</span>
                    {book.authors.map((author) => <Badge key={author} className="me-1" bg="primary" >{author}</Badge>)}
                </p>

                <p>
                    <span className="fw-bold">Žánr:</span>
                    {book.bookGenreIds.map((genre) => {
                        return (
                            <Badge key={"span-" + genre} className="me-1" variant="primary" >
                                {bookGenres.find((bookGenre) => bookGenre.id === genre)?.name}
                            </Badge>
                        )
                    })}
                </p>

                <IconButton
                    text="Přidat do seznamu"
                    onClick={() => {
                    }}
                    variant="primary"
                    styling="me-1 mb-1"
                />
            </Card.Body>
        </Card>
    )
}


const Explore = (props) => {
    const { } = props;

    const [readingLists, setReadingLists] = useState([]);
    const [books, setBooks] = useState([]);
    const [modalVersion, setModalVersion] = useState("");

    const [bookGenres, setBookGenres] = useState([]);
    const [editBook, setEditBook] = useState(null);

    const closeModal = () => {
        setModalVersion("");
    }

    // const createListHandler = async () => {
    //     try {

    //         const updateListObject = {
    //             id: editList.id,
    //             name: editList.name,
    //             readingListGenresIds: editList.readingListGenresIds,
    //         }

    //         const result = await updateReadingList(updateListObject);
    //         const index = readingLists.findIndex(list => list.id === result.id);

    //         if (index !== -1) {
    //             const updatedReadingLists = [...readingLists];
    //             updatedReadingLists[index] = result;

    //             setReadingLists(updatedReadingLists);
    //         }

    //         setEditBook(null);
    //         closeModal();
    //     }
    //     catch (err) {
    //         console.warn(err);
    //     }
    // }

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const result = await getAllBooks();
                setBooks(result);
            } catch (err) {
                console.warn("fetchAllBooks - error: ", err);
            }
        };
        const fetchBookGenres = async () => {
            try {
                const result = await getBookGenre();
                setBookGenres(result);
            } catch (err) {
                console.warn("fetchBookGenres - error: ", err);
            }
        };
        const fetchReadingLists = async () => {
            try {
                const result = await getUsersReadingLists();
                setReadingLists(result);
            } catch (err) {
                console.warn("fetchReadingLists - error: ", err);
            }
        };

        fetchReadingLists();

        fetchAllBooks();
        fetchBookGenres();
    }, []);

    return (
        <>

            {/* ADD BOOK TO LIST MODAL - TODO */}
            <BasicModal
                visible={modalVersion === "add-book-to-list"}
                title={'Přidat knihu do seznamu'}
                closeButtonText={'Zavřít'}
                actionButtonText={"Přidat"}
                //onActionButtonClick={createListHandler}
                // Todo add disabled book handler
                onCloseButtonClick={closeModal}
            >
                <Form noValidate >
                    <Form.Group controlId="bookListSelect">
                        <Form.Label>Seznam do kterého chcete knihu přidat</Form.Label>

                        <Form.Select
                            aria-label="Seznam do kterého chcete knihu přidat"
                        // TODO - chová se divně 
                        //onChange={(e) => addListGenreHandler(e.target.value)}
                        >
                            <option value="">Přidat knižní žánr</option>
                            {readingLists.map((list) => {
                                return <option key={list.id} value={list.id}>{list.name}</option>
                            })}
                        </Form.Select>
                    </Form.Group>

                </Form>

            </BasicModal >

            <Container>
                <Row className="mb-4">
                    <Col>
                        <h1>Knihy</h1>
                    </Col>
                </Row>

                {
                    books.map((book) =>
                        <BookCard
                            //key={book.id}
                            bookGenres={bookGenres}
                            setModalVersion={setModalVersion}
                            setEditBook={setEditBook}
                        />
                    )}
            </Container>
        </>

    );
}

export default Explore;