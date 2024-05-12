import React, { useEffect, useState } from "react";

import IconButton from "../../components/buttons/IconButton";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';

import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Table from 'react-bootstrap/Table';
import { createBook, getAllBooks, getBookGenre } from "../../api/apiCalls";
import BasicModal from "../../components/modals/BasicModal";
import Badge from "react-bootstrap/esm/Badge";


const BookTableItem = (props) => {
    const { book } = props;

    if (!book?.name) return null;
    return (
        <tr>
            <td>{book?.name}</td>
            <td>
                {book.authors.map((author) => {
                    return (<span key={author}>{author + " "}</span>)
                })}
            </td>
            <td className="d-flex align-items-center justify-content-end">
                <IconButton
                    text="Editace"
                    onClick={() => {
                    }}
                    //icon={faPlus}
                    variant="warning"
                    styling="me-1 mb-1"
                    disabled={true}
                //disabled={state !== "done"}
                />

                <IconButton
                    text="Odstranit"
                    onClick={() => {
                    }}
                    //icon={faPlus}
                    variant="danger"
                    styling="mb-1"
                    disabled={true}
                //disabled={state !== "done"}
                />
            </td>
        </tr>
    )
}

const ManageBooks = (props) => {
    const { } = props;

    const [books, setBooks] = useState([]);
    const [modalVersion, setModalVersion] = useState("");

    //Modal states
    const [formChanged, setFormChanged] = useState(false);
    // Todo - authors needs to be converted to array of strings
    const [book, setBook] = useState({ name: "", authors: "", bookDescription: "", bookGenreIds: [] })
    const [bookGenres, setBookGenres] = useState([]);

    const [isLoading, setIsLoading] = useState(false);


    const closeModal = () => {
        setModalVersion("");
    }

    const addBookHandler = async () => {
        try {
            setIsLoading(true);
            const newBook = { ...book };
            if (typeof newBook.authors === 'string' && newBook.authors.length > 2) {
                console.log("book.authors: ", newBook.authors);
                newBook.authors = newBook.authors.split(",");
            } else {
                console.log('book.authors is not a string:', newBook.authors);
            }
            const result = await createBook(newBook);

            await fetchBooks();
            setModalVersion("");
            setBook({ name: "", authors: "", bookDescription: "", bookGenreIds: [] });
        } catch (err) {
            console.warn("addBookHandler - error: ", err);
        }
        finally {
            setIsLoading(false);
        }
    }

    const removeBookGenreHandler = (id) => {
        const updatedGenreIds = book.bookGenreIds.filter(genreId => genreId !== id);

        setBook({
            ...book,
            bookGenreIds: updatedGenreIds,
        });
    }

    const fetchBooks = async () => {
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
            const result = await getAllBooks();
            await fetchBookGenres();
            setBooks(result);
        } catch (err) {
            console.warn("fetchBooks - error: ", err);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {



        fetchBooks();
    }, []);

    useEffect(() => {
        console.log("book: ", book);
    }, [book]);

    return (
        <>
            {/* ADD NEW BOOK TO DB MODAL */}
            <BasicModal
                visible={modalVersion === "add-book"}
                title={'Přidat novou knihu do databáze'}
                closeButtonText={'Zavřít'}
                actionButtonText={'Přidat knihu'}
                onActionButtonClick={addBookHandler}
                actionButtonDisabled={book.name.length < 4 || book.authors.length < 5 || book.bookGenreIds.length < 1 || book.bookDescription.length < 5}
                onCloseButtonClick={closeModal}
            >
                <Form noValidate onSubmit={addBookHandler}>
                    <Row >
                        <Form.Group as={Col} controlId="bookName">
                            <Form.Label>Název knihy</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={book.name}
                                isValid={book.name.length > 4 && formChanged}
                                onChange={(val) => {
                                    setFormChanged(true);
                                    setBook((prevState) => { return { ...prevState, name: val.target.value } });
                                }}
                            />
                            < Form.Control.Feedback >Skvělé!</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row >
                        <Form.Group as={Col} controlId="bookName">
                            <Form.Label>Autoři</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={book.authors}
                                isValid={book.authors.length > 5 && formChanged}
                                onChange={(val) => {
                                    setFormChanged(true);
                                    setBook((prevState) => { return { ...prevState, authors: val.target.value } });
                                }}
                            />
                            < Form.Control.Feedback >Skvělé!</Form.Control.Feedback>
                            <p>
                                {book?.authors?.split(',').map((author) => <Badge key={author} className="me-1" variant="primary">{author}</Badge>)}
                            </p>
                        </Form.Group>
                    </Row>

                    <Row >
                        <Form.Group as={Col} controlId="bookGenre">
                            <Form.Label>Knižní žánry</Form.Label>
                            <Form.Select
                                aria-label="Knižní žánry"
                                onChange={(e) => setBook((prevState) => { return { ...prevState, bookGenreIds: [...prevState.bookGenreIds, e.target.value] } })}
                            >
                                <option value="">Vybrat knižní žánr</option>
                                {bookGenres
                                    .filter((genre) => !book.bookGenreIds.includes(genre.id))
                                    .map((genre) => {
                                        return <option key={"option" + genre.id} value={genre.id}>{genre.name}</option>
                                    })}
                            </Form.Select>
                            <Col>
                                <p>
                                    {book.bookGenreIds.map((genre) => {
                                        return (
                                            <Badge key={"span-" + genre} className="me-1" variant="primary" onClick={() => removeBookGenreHandler(genre)} >
                                                {bookGenres.find((bookGenre) => bookGenre.id === genre)?.name}
                                            </Badge>
                                        )
                                    })}
                                </p>
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row >
                        <Form.Group as={Col} controlId="bookDescription">
                            <Form.Label>Popis knihy</Form.Label>
                            <Form.Control
                                aria-label="Popis knihy"
                                as="textarea"
                                rows={4}
                                required
                                type="text"
                                value={book.bookDescription}
                                isValid={book.bookDescription.length > 5 && formChanged}
                                onChange={(val) => {
                                    setFormChanged(true);
                                    setBook((prevState) => { return { ...prevState, bookDescription: val.target.value } });
                                }}
                            />
                            < Form.Control.Feedback >Skvělé!</Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                </Form>

            </BasicModal >

            <Container>
                <Row className="mb-2">
                    <Col xs={7}>
                        <h1>Správa databáze knih</h1>
                    </Col>

                    <Col xs={5} className="d-flex justify-content-end align-items-center">
                        <Button onClick={() => setModalVersion('add-book')}>
                            <span>Přidat knihu</span>
                        </Button>
                    </Col>
                </Row>

                {isLoading ?
                    <Row>
                        <Col>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                    :
                    <Row>
                        <Col>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Název knihy</th>
                                        <th>Autoři</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.map((book) =>
                                        <BookTableItem key={book?.bookId ? book.bookId : book?.id + book?.name} book={book} />
                                    )}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                }




            </Container>
        </>

    );
}

export default ManageBooks;