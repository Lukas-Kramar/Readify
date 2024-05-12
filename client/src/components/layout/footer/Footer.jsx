import LanguageSwitcher from "../../language-switcher/LanguageSwitcher";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="d-flex w-100 bg-dark text-white position-fixed bottom-0 w-100">
            <Container>
                <Row className="mt-4">
                    <Col xs={8} className="d-flex align-items-center">
                        <p className="">
                            Aplikaci <strong>Readify</strong> vytvořil
                            <a className="text-light" href="https://www.linkedin.com/in/lukáš-kramár">
                                <strong> Lukáš Kramár </strong>
                            </a>
                        </p>
                    </Col>
                    <Col xs={4} className="d-flex justify-content-end align-items-center">
                        <LanguageSwitcher />
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;