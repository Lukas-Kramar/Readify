import { faSquare, faSquareCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';

const ProductsList = (props) => {
    const { listId, products,
        shoppingListAction, closeModal,
    } = props;

    const { t } = useTranslation();

    const [errors, setErrors] = useState([]);

    const toggleProductHandler = (productName) => {
        console.log("toggle-product-accomplished");
        const result = shoppingListAction("toggle-product-accomplished",
            {
                listId: listId,
                productName: productName
            });
        closeModal();
        console.log("result: ", result);
    }

    const removeProductHandler = (productName) => {
        console.log("removing product");
        const result = shoppingListAction("remove-product",
            {
                listId: listId,
                productName: productName
            });
        closeModal();
        console.log("result: ", result);
    }

    useEffect(() => {
        console.log(products);
    }, [products]);

    if (!products) {
        return (
            <p>{t('ProductList.undefinedProducts')}</p>
        )
    }

    return (
        <ListGroup defaultActiveKey="#link1" className="h-60 overflow-auto">
            {products.map((product, i) => {
                return (
                    <ListGroup.Item
                        key={i}
                        className={`d-flex my-2 align-items-center rounded ${product.accomplished ? "bg-secondary" : "bg-info"}`}
                        action={product.accomplished ? false : true}
                        onClick={() => toggleProductHandler(product.productName)}
                        style={{ color: "black" }}
                    >
                        <span className='me-3'>
                            <FontAwesomeIcon size="2x" icon={product.accomplished ? faSquareCheck : faSquare} />
                        </span>

                        <strong >
                            {product.productName}
                        </strong>

                        <Button
                            className='ms-auto' variant="danger"
                            onClick={() => removeProductHandler(product.productName)}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </ListGroup.Item>
                )
            })}
        </ListGroup>
    );
}

export default ProductsList;