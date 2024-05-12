import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const NotFoundPage = () => {
    return (
        <Container className="vh-100 d-flex justify-content-center align-items-center">
            <Row>
                <Col className="text-center">
                    <h1 className="display-1">404</h1>
                    <h2 className="display-4">Stránka nenalezena</h2>
                    <p className="lead">Hledaná stránka neexistuje. Zkontrolujte prosím adresu URL a zkuste to znovu.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFoundPage;
