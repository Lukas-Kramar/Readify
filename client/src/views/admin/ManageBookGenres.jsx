import React, { useEffect, useState } from "react";

import IconButton from "../../components/buttons/IconButton";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { createBookGenre, getBookGenre } from "../../api/apiCalls";
import BasicModal from "../../components/modals/BasicModal";


const GenreItem = (props) => {
    const { genre } = props;

    if (!genre?.name) return null;
    return (
        <tr>
            <td>{genre?.name}</td>
            <td>{genre?.description}</td>
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

const ManageBookGenres = (props) => {
    const { } = props;

    const [modalVersion, setModalVersion] = useState("");

    //Modal states
    const [formChanged, setFormChanged] = useState(false);
    // Todo - authors needs to be converted to array of strings
    const [book, setBook] = useState({ name: "", authors: "", bookDescription: "", bookGenreIds: [] })
    const [bookGenres, setBookGenres] = useState([]);

    const [editGenre, setEditGenre] = useState({ name: "", description: "" })

    const [isLoading, setIsLoading] = useState(false);


    const closeModal = () => {
        setModalVersion("");
    }

    const fetchBookGenres = async () => {
        try {
            setIsLoading(true);
            const result = await getBookGenre();
            setBookGenres(result);
        } catch (err) {
            console.warn("fetchBookGenres - error: ", err);
        }
        finally {
            setIsLoading(false);
        }
    };


    const addBookHandler = async () => {
        try {
            setIsLoading(true);
            const result = await createBookGenre(editGenre);
            await fetchBookGenres();
            setEditGenre({ name: "", description: "" });
            setModalVersion("");
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

    useEffect(() => {
        fetchBookGenres();
    }, []);

    return (
        <>
            {/* ADD NEW BOOK TO DB MODAL */}
            <BasicModal
                visible={modalVersion === "add-genre"}
                title={'Přidat nový knižní žánr do databáze'}
                closeButtonText={'Zavřít'}
                actionButtonText={'Přidat'}
                onActionButtonClick={addBookHandler}
                // Todo add disabled book handler
                onCloseButtonClick={closeModal}
            >
                <Form noValidate onSubmit={addBookHandler}>

                    <Form.Group className="mb-3" controlId="genreName">
                        <Form.Label>Název žánru</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            value={editGenre.name}
                            isValid={editGenre.name.length > 4 && formChanged}
                            onChange={(val) => {
                                setFormChanged(true);
                                setEditGenre((prevState) => { return { ...prevState, name: val.target.value } });
                            }}
                        />
                        < Form.Control.Feedback >Skvělé!</Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group controlId="genreDescription">
                        <Form.Label>Popis knižního žánru</Form.Label>
                        <Form.Control
                            aria-label="Popis knihy"
                            as="textarea"
                            rows={4}
                            required
                            type="text"
                            value={editGenre.description}
                            isValid={editGenre.description.length > 5 && formChanged}
                            onChange={(val) => {
                                setFormChanged(true);
                                setEditGenre((prevState) => { return { ...prevState, description: val.target.value } });
                            }}
                        />
                        < Form.Control.Feedback >Skvělé!</Form.Control.Feedback>
                    </Form.Group>


                </Form>

            </BasicModal >

            <Container>
                <Row className="mb-2">
                    <Col xs={7}>
                        <h1>Správa databáze knižních žánrů</h1>
                    </Col>

                    <Col xs={5} className="d-flex justify-content-end align-items-center">
                        <Button onClick={() => setModalVersion('add-genre')}>
                            <span>Přidat žánr</span>
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
                                        <th>Název</th>
                                        <th>Popisek</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookGenres.map((genre) =>
                                        <GenreItem key={genre.id} genre={genre} />
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

export default ManageBookGenres;