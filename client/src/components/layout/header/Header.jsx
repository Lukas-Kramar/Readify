import { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import BasicModal from '../../modals/BasicModal';
import Lists from '../../lists/Lists';
import { useTranslation } from 'react-i18next';
import ThemeSwitcher from '../../theme-switcher/ThemeSwitcher';
import { useNavigate } from 'react-router-dom';

export const Header = (props) => {
    const {
        shoppingLists, shoppingListAction,
        selectedShoppingList, setSelectedShoppingList,

        state
    } = props;

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [showCanvas, setShowCanvas] = useState(false);

    return (
        <>
            <BasicModal />
            <Navbar expand={"sm"} className="bg-body-tertiary mb-3">
                <Container fluid>
                    <Navbar.Brand onClick={() => navigate('/')}>
                        <span className='bg-danger fw-bold text-white m-1 p-2 rounded '>
                            LOGO
                        </span>

                    </Navbar.Brand>

                    <Navbar.Toggle
                        onClick={() => setShowCanvas(true)}
                        aria-controls={`offcanvasNavbar-expand`}
                    />

                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link onClick={() => navigate('/')}>Dashboard</Nav.Link>
                            <Nav.Link onClick={() => navigate('/explore')}>Explore</Nav.Link>
                            <NavDropdown title="Admin" id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => navigate('/admin/manage-books')}>Knihy</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => navigate('/admin/manage-book-genres')}>Knižní žárny</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>


                </Container>
            </Navbar>
        </>
    );
}

export default Header;