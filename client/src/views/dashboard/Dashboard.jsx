import React, { useEffect, useState } from "react";

import IconButton from "../../components/buttons/IconButton";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import { createReadingList, getBook, getBookGenre, getUsersReadingLists, updateReadingList } from "../../api/apiCalls";
import BasicModal from "../../components/modals/BasicModal";
import Badge from "react-bootstrap/esm/Badge";

import dayjs from "dayjs"
import { useNavigate } from "react-router-dom";

const BookItem = (props) => {
    const { book } = props;

    // console.log("book.name", book);
    const [bookApi, setBookApi] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const result = await getBook(book.bookId);
                setBookApi(result);
            } catch (err) {
                console.warn("fetchBook - error: ", err);
            }
        }
        fetchBook();
    }, [book.bookId]);

    if (!book) return null;
    return (
        <div className="d-flex rounded p-2 justify-content-between flex-row bg-info mb-2">

            <div>
                {bookApi ?
                    <h5>{bookApi.name}</h5>
                    :
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                }
            </div>

            <div>
                <p>Rozečteno: {book.dateTimeStartedReading ? dayjs(book.dateTimeStartedReading).format('DD.MM.YYYY') : "---"}</p>
            </div>

            <div>
                <p>Dočteno: {book.dateTimeFinishedReading ? dayjs(book.dateTimeFinishedReading).format('DD.MM.YYYY') : "---"}</p>
            </div>
        </div>
    )
}

const ReadingList = (props) => {
    const { readingList, bookGenres, setModalVersion, setEditList } = props;

    const [listGenres, setListGenres] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Filter bookGenres to keep only those that have the same id as one of the readingList.readingListGenresIds
        const filteredGenres = bookGenres.filter(genre => readingList.readingListGenresIds.includes(genre.id));

        setListGenres(filteredGenres);
    }, [bookGenres, readingList]);

    if (!readingList) return null;
    return (
        <Row className="bg-secondary mb-3 pb-2 rounded">
            <Col xs={5} className="mt-3">
                <h3>{readingList.name}</h3>
                <p>
                    {listGenres.map((genre) => <Badge key={genre.name} className="me-1" bg="primary" >{genre.name}</Badge>)}
                </p>
            </Col>

            <Col xs={7} className="d-flex gap-2  justify-content-end align-items-center">
                <IconButton
                    text="Zobrazit"
                    onClick={() => navigate(`/reading-list-detail?id=${readingList.id}`)}
                    //icon={faPlus}
                    styling=""
                //disabled={state !== "done"}
                />
                <IconButton
                    text="Editace"
                    onClick={() => {
                        setEditList(readingList);
                        setModalVersion('edit-reading-list')
                    }}
                    //icon={faPlus}
                    variant="warning"
                    styling=""
                //disabled={state !== "done"}
                />
                <IconButton
                    text="Smazat"
                    onClick={() => setModalVersion('remove-reading-list')}
                    //icon={faPlus}
                    disabled={true}
                    variant="danger"
                    styling=""
                //disabled={state !== "done"}
                />
            </Col>

            <Col xs={12}>
                {readingList.readingListBooks.map((listBook) => <BookItem key={listBook?.bookId} book={listBook} />)}
            </Col>
        </Row>
    )
}

const Dashboard = (props) => {
    const { } = props;

    const [readingLists, setReadingLists] = useState([]);
    const [modalVersion, setModalVersion] = useState("");



    //Modal states
    const [formChanged, setFormChanged] = useState(false);
    // Todo - authors needs to be converted to array of strings
    const [editList, setEditList] = useState({ name: "", readingListGenresIds: [] })
    const [bookGenres, setBookGenres] = useState([]);

    const closeModal = () => {
        setModalVersion("");
    }

    const createListHandler = async () => {
        try {
            if (modalVersion === "create-reading-list") {
                const result = await createReadingList(editList);
                setReadingLists([...readingLists, result]);
                // test add value check
                console.log("Creating list");
            }
            else {
                const updateListObject = {
                    id: editList.id,
                    name: editList.name,
                    readingListGenresIds: editList.readingListGenresIds,
                }

                const result = await updateReadingList(updateListObject);
                const index = readingLists.findIndex(list => list.id === result.id);

                if (index !== -1) {
                    const updatedReadingLists = [...readingLists];
                    updatedReadingLists[index] = result;

                    setReadingLists(updatedReadingLists);
                }
            }

            setEditList({ name: "", readingListGenresIds: [] });
            closeModal();
        }
        catch (err) {
            console.warn(err);
        }
    }
    const deleteListHandler = async () => {
        try {
            if (editList.id) {
                // const result = await remove(editList);
                // setReadingLists([...readingLists, result]);
                // // test add value check
                console.log("Removing list list");
            }
            else {
                console.warn("invalid reading list to delete");
            }

            setEditList({ name: "", readingListGenresIds: [] });
            closeModal();
        }
        catch (err) {
            console.warn(err);
        }
    }

    const addListGenreHandler = (id) => {
        setEditList(prevState => { return { ...prevState, readingListGenresIds: [...prevState.readingListGenresIds, id] } })
    }
    const removeBookGenreHandler = (id) => {
        const updatedGenreIds = editList.readingListGenresIds.filter(genreId => genreId !== id);

        setEditList({
            ...editList,
            readingListGenresIds: updatedGenreIds,
        });
    }

    useEffect(() => {
        const fetchReadingLists = async () => {
            try {
                const result = await getUsersReadingLists();
                setReadingLists(result);
            } catch (err) {
                console.warn("fetchReadingLists - error: ", err);
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

        fetchReadingLists();
        fetchBookGenres();
    }, []);

    return (
        <>

            {/* CREATE NEW READING LIST MODAL - TODO */}

            <BasicModal
                visible={modalVersion === "create-reading-list" || modalVersion === "edit-reading-list"}
                title={'Vytvořit nový literární seznam'}
                closeButtonText={'Zavřít'}
                actionButtonText={modalVersion === "create-reading-list" ? "Vytvořit" : "Uložit"}
                onActionButtonClick={createListHandler}
                // Todo add disabled book handler
                onCloseButtonClick={closeModal}
                actionButtonDisabled={editList.name.length < 5}
            >
                <Form noValidate onSubmit={createListHandler}>

                    <Form.Group className="mb-3" controlId="listName">
                        <Form.Label>Název seznamu</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            value={editList.name}
                            isValid={editList.name.length > 4 && formChanged}
                            onChange={(val) => {
                                setFormChanged(true);
                                setEditList((prevState) => { return { ...prevState, name: val.target.value } });
                            }}
                        />
                        < Form.Control.Feedback >Skvělé!</Form.Control.Feedback>
                    </Form.Group>


                    <Form.Group controlId="bookGenre">
                        <Form.Label>Knižní žánry, které bude list obsahovat</Form.Label>
                        <Form.Select
                            aria-label="Knižní žánry"
                            // TODO - chová se divně 
                            onChange={(e) => addListGenreHandler(e.target.value)}
                        >
                            <option value="">Přidat knižní žánr</option>
                            {bookGenres
                                .filter((genre) => !editList.readingListGenresIds.includes(genre.id))
                                .map((genre) => {
                                    return <option key={genre.id} value={genre.id}>{genre.name}</option>
                                })}
                        </Form.Select>
                        <Col>
                            <p className="mt-2">
                                {editList.readingListGenresIds.map((genre) => {
                                    return (
                                        <Badge
                                            key={genre}
                                            className="me-1"
                                            bg="primary"
                                            onClick={() => removeBookGenreHandler(genre.id)} >
                                            {bookGenres.find((bookGenre) => bookGenre.id === genre)?.name}
                                        </Badge>

                                    )
                                })}
                            </p>
                        </Col>
                    </Form.Group>


                </Form>

            </BasicModal >

            <Container>
                <Row className="mb-4">
                    <Col>
                        <h1>Knižní seznamy:</h1>
                    </Col>

                    <Col className="d-flex justify-content-end">
                        <IconButton
                            text="Vytvořit nový seznam"
                            onClick={() => setModalVersion('create-reading-list')}
                            //icon={faPlus}
                            styling=""
                        //disabled={state !== "done"}
                        />
                    </Col>
                </Row>

                {readingLists.map((readList) =>
                    <ReadingList
                        key={readList?.id}
                        readingList={readList}
                        bookGenres={bookGenres}
                        setModalVersion={setModalVersion}
                        setEditList={setEditList}
                    />
                )}
            </Container>
        </>

    );
}

export default Dashboard;