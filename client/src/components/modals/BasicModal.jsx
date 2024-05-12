import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const BasicModal = (props) => {
    const {
        children,
        visible = false,
        title, text,
        closeButtonText, onCloseButtonClick,
        actionButtonText, onActionButtonClick, actionButtonDisabled = false, actionButtonVariant = "primary"
    } = props;

    if (!visible) { return <></> }

    return (
        <Modal show={visible} onHide={onCloseButtonClick}>

            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {text && <p>{text}</p>}
                {children}
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
                <Button
                    onClick={() => onCloseButtonClick()}
                    variant="secondary"
                >
                    {closeButtonText}
                </Button>
                <Button
                    disabled={actionButtonDisabled}
                    onClick={() => onActionButtonClick()}
                    variant={actionButtonVariant}
                >
                    {actionButtonText}
                </Button>
            </Modal.Footer>

        </Modal>
    );
}

export default BasicModal;