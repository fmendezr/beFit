import { Image, Card, Form, FloatingLabel} from "react-bootstrap";
import { useState } from "react";
import NavbarComponent from "./Navbar";
import addPhotoIcon from "../assets/addPhoto.svg"

export default function AddPost () {

    const [picture, setPicture] = useState(null);
    const [pictureUrl, setPictureUrl] = useState(addPhotoIcon);
    const [positionX, setPositionX] = useState(50)
    const [positionY, setPositionY] = useState(50)

    const [hover, setHover] = useState(false)
    const hoverStyle = {
        color: hover ? "#0275d8" : "black" 
    }

    const handlePicChange = (e) => {
        setPictureUrl(URL.createObjectURL(e.target.files[0]));
        setPicture(e.target.files[0]);
    };

    return (
    <div className="w-100 d-flex flex-column " style={{minHeight: "100vh"}}>
        <NavbarComponent/>
        <Card className="w-100 align-self-center mt-3 mb-2" style={{maxWidth: "450px"}}>
            <Card.Header className="d-flex justify-content-between" style={{height: "40px"}}>
                    <p>Create Post</p>
                    {picture == null ? <p></p> : <p style={hoverStyle} onMouseOver={() => {setHover(true)}} onMouseLeave={() => {setHover(false)}}>Next</p> }
            </Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group className="text-center">
                        <Image src={pictureUrl} style={{height: "225px", width:"225px", objectFit: "cover", objectPosition: `${positionX}% ${positionY}%`}}/>
                        <Form.Control className="mt-3 mb-2" accept="image/*" type="file" onChange={handlePicChange}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Horizontal -> {positionX}</Form.Label>
                        <Form.Range max={100} value={positionX} onChange={(e) => setPositionX(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Vertical -> {positionY}</Form.Label>
                        <Form.Range max={100} value={positionY} onChange={(e) => setPositionY(e.target.value)}/>
                    </Form.Group>
                    <Form.Floating>
                        <FloatingLabel controlId="captionTextarea" label="Caption">
                            <Form.Control as="textarea" placeholder="Caption here" style={{height: "200px"}}/>
                        </FloatingLabel>
                    </Form.Floating>
                </Form>
            </Card.Body>
        </Card>
    </div>
    )
} 

