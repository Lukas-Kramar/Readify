import { useEffect, useState } from 'react';

import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Spinner from 'react-bootstrap/Spinner';



import { faBars, faEye, faEyeSlash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import IconButton from '../buttons/IconButton';
import BasicModal from '../modals/BasicModal';
import { useTranslation } from 'react-i18next';
import ShoppingListBarChart from '../charts/ShoppingListsBarChart';



const Lists = (props) => {
    const {
        shoppingListAction,
        // showArchived, setShowArchived,
        shoppingLists,
        selectedShoppingList, setSelectedShoppingList,

        state
    } = props;

    const { t } = useTranslation();
    const [formList, setFormList] = useState(null);
    const [displayedLists, setDisplayedLists] = useState({ active: [], archived: [] });
    const [showArchived, setShowArchived] = useState(false);
    const [modalVersion, setModalVersion] = useState("");


    // useEffect(() => {
    //     console.log("Lists - shoppingLIsts: ", shoppingLists);

    //     if (!shoppingLists || shoppingLists.length < 1) { return; }

    //     const usersLists = shoppingLists.filter((shopList) => shopList.ownerId === user.id || shopList?.membersIds?.includes(user.id));
    //     const archived = [];
    //     const active = [];
    //     usersLists.forEach(list => {
    //         if (list.archived) { archived.push(list); }
    //         else { active.push(list); }
    //     });
    //     setDisplayedLists({ active: active, archived: archived });
    // }, [shoppingLists, user.id]);

    // useEffect(() => {

    // }, [state]);



    const showCreateList = () => {
        setFormList({
            ownerId: "", //user.id,
            membersIds: [],
            listName: "",
            productsInList: [],
            archived: false,
        })
        setModalVersion("create-list");
    }

    const createListHandler = async () => {
        try {

            shoppingListAction("create-list", { list: formList });
            setModalVersion("");
        }
        catch (err) {

        }
    }

    const ListItem = (props) => {
        const { list, variant = "secondary" } = props;
        if (!list.listId) return null;
        return (
            <ListGroup.Item
                variant={variant}
                className='d-flex justify-content-between'
                action
                disabled={list.listId === selectedShoppingList?.listId}
                onClick={() => setSelectedShoppingList(list)}
            >
                <div>
                    <FontAwesomeIcon icon={faBars} className="mr-2" />
                    <span className='ms-2 fw-bold'>{list.listName}</span>
                </div>
                <Badge bg="secondary">{list.productsInList.length}</Badge>
            </ListGroup.Item>
        )
    }

    return (
        <>
            {/* CREATE LIST MODAL */}
            <BasicModal
                visible={modalVersion === "create-list"}
                title={t('List.modals.CreateListModal.title')}
                closeButtonText={t('defaultValues.close')}
                actionButtonText={t('defaultValues.save')}
                actionButtonDisabled={!(formList?.listName.length > 4)}
                onActionButtonClick={createListHandler}
                onCloseButtonClick={() => setModalVersion("")}
            >
                <Form noValidate onSubmit={createListHandler}>
                    <Row >
                        <Form.Group as={Col} controlId="validationListName">
                            <Form.Label>{t('List.modals.CreateListModal.listName')}</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={formList?.listName}
                                isValid={formList?.listName.length > 4}
                                onChange={(val) => { setFormList({ ...formList, listName: val.target.value }) }}
                            />
                            <Form.Control.Feedback>{t('defaultValues.validFeedback')}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                </Form>
            </BasicModal>

            <Row className='mb-3'>
                <Col>
                    <IconButton
                        text={t('List.createListButton')}
                        onClick={showCreateList}
                        icon={faPlus}
                        styling="d-flex  justify-content-between w-100"
                        disabled={state !== "done"}
                    />
                </Col>
            </Row>

            <Row className='mb-3'>
                <Col>
                    <IconButton
                        text={showArchived ? t('List.hideArchivedButton') : t('List.showArchivedButton')}
                        onClick={() => setShowArchived(!showArchived)}
                        icon={showArchived ? faEyeSlash : faEye}
                        styling="d-flex justify-content-between w-75"
                        disabled={state !== "done"}
                    />
                </Col>
            </Row>

            <Row>
                <Col>
                    <ShoppingListBarChart shoppingLists={shoppingLists} />
                </Col>
            </Row>

            <Row className='mb-3 h-60 overflow-auto'>
                <Col>
                    {state === "done" ?
                        <ListGroup>
                            {
                                displayedLists?.active?.length > 0 || displayedLists?.archived?.length > 0 ? (
                                    <>
                                        {displayedLists.active.map((activeList) => (
                                            <ListItem key={activeList.listId} variant="info" list={activeList} />
                                        ))}
                                        {showArchived &&
                                            displayedLists.archived.map((archivedList) => (
                                                <ListItem key={archivedList.listId} variant="secondary" list={archivedList} />
                                            ))}
                                    </>
                                ) : (
                                    <ListGroup.Item disabled variant="secondary">
                                        {t('List.emptyShoppingListArray')}
                                    </ListGroup.Item>
                                )
                            }


                        </ListGroup>
                        :
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">{t('defaultValues.loading')}</span>
                        </Spinner>
                    }
                </Col>
            </Row>


        </>
    );
}

export default Lists;