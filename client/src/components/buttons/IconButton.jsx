import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';

const IconButton = (props) => {
    const { icon, onClick, variant = "primary", styling = "", text = "", disabled = false } = props;
    const [style, setStyle] = useState("");

    useEffect(() => {
        const newStyling = "" + styling;
        setStyle(newStyling);
    }, [styling]);

    return (
        <Button
            variant={variant}
            onClick={onClick}
            className={style}
            disabled={disabled}
        >
            {text && <span className="fw-bold"> {text} </span>}
            {icon &&
                <span className="">
                    <FontAwesomeIcon icon={icon} />
                </span>
            }
        </Button>
    );
}

export default IconButton;