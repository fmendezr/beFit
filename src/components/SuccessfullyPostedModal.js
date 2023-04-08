import { Modal, Button, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import fireworksGif from "../assets/fireworks.gif"

export default function SuccesfullyPostedModal (props) {
    return (
        <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Posted Succesfully!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{display: "flex", justifyContent: "center"}}>
        <Image src={fireworksGif} style={{width: "100%", maxWidth: "300px"}}/>
      </Modal.Body>
      <Modal.Footer>
        <LinkContainer to="/">
            <Button variant="dark" onClick={props.onHide}>Home</Button>
        </LinkContainer>
      </Modal.Footer>
    </Modal>
  );
}