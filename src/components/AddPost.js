import { Image, Card, Form, FloatingLabel, Container, Button} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useStorage } from "../contexts/StorageContext";
import { useDB } from "../contexts/DBContext";
import NavbarComponent from "./Navbar";
import defaultProfilePic from "../assets/defaultProfile.png";
import addPhotoIcon from "../assets/addPhoto.svg";
import likeIcon from "../assets/likeIcon.svg";
import commentIcon from "../assets/commentIcon.svg";
import { v4 } from "uuid";

export default function AddPost () {

    const {currentUser} = useAuth();
    const {addNewPostInfo, addNewPostToUser} = useDB();
    const {downloadProfilePic, uploadPostPic} = useStorage();
    const [profilePic, setProfilePic] = useState(defaultProfilePic) 


    const [picture, setPicture] = useState(null);
    const [pictureUrl, setPictureUrl] = useState(addPhotoIcon);
    const [positionX, setPositionX] = useState(50)
    const [positionY, setPositionY] = useState(50)

    const [caption, setCaption] = useState("")

    const [hover, setHover] = useState(false)
    const hoverStyle = {
        color: hover ? "#0275d8" : "black" 
    }

    const [preview, setPreview] = useState(false)

    const [loading, setLoading] = useState(false)

    const handlePicChange = (e) => {
        setPictureUrl(URL.createObjectURL(e.target.files[0]));
        setPicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const pid = v4();
        try {
            await uploadPostPic(pid, picture);
            await addNewPostToUser(currentUser.uid, pid);
            await addNewPostInfo(pid, currentUser.uid, `postImages/${pid}`, positionX, positionY, caption);
        }
        catch (error){
            console.log(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        const getProfilePic = async () => {
            const downloadPic = await downloadProfilePic(currentUser.uid);
            setProfilePic(downloadPic);
        }
        getProfilePic();
    },[])

    return (
    <div className="w-100 d-flex flex-column " style={{minHeight: "100vh"}}>
        <NavbarComponent/>
        { !preview ? 
        <Card className="w-100 align-self-center mt-3 mb-2" style={{maxWidth: "450px"}}>
            <Card.Header className="d-flex justify-content-between" style={{height: "40px"}}>
                    <p>Create Post</p>
                    {picture === null ? <p></p> : <p style={hoverStyle} onMouseOver={() => {setHover(true)}} onMouseLeave={() => {setHover(false)}} onClick={() => setPreview(true)}>Next</p> }
            </Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group className="text-center">
                        <Image src={pictureUrl} style={{height: "225px", width:"225px", objectFit: "cover", objectPosition: `${positionX}% ${positionY}%`}}/>
                        <Form.Control className="mt-3 mb-2" accept="image/*" type="file" onChange={handlePicChange}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Horizontal -&gt; {positionX}</Form.Label>
                        <Form.Range max={100} value={positionX} onChange={(e) => setPositionX(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Vertical -&gt; {positionY}</Form.Label>
                        <Form.Range max={100} value={positionY} onChange={(e) => setPositionY(e.target.value)}/>
                    </Form.Group>
                    <Form.Floating>
                        <FloatingLabel controlId="captionTextarea" label="Caption (max 200)">
                            <Form.Control as="textarea" maxLength={200} placeholder="Caption here" value={caption} style={{height: "200px"}} onChange={(e) => {setCaption(e.target.value)}}/>
                        </FloatingLabel>
                    </Form.Floating>
                </Form>
            </Card.Body>
        </Card>
        :
        <Card className="w-100 align-self-center mt-3 mb-2" style={{maxWidth: "450px"}}>
            <Card.Header className="d-flex justify-content-between" style={{height: "40px"}}>
                <p>Create Post</p>
                <p style={hoverStyle} onMouseOver={() => {setHover(true)}} onMouseLeave={() => {setHover(false)}} onClick={() => {setPreview(false)}}>back</p> 
            </Card.Header>
            <Card.Body className="d-flex flex-column justify-content-center">
                <Container as="div" className="d-flex flex-column align-items-start" style={{width: "275px"}}>
                    <Container as="div" className="d-flex justify-content-start mb-2" style={{gap: "5px"}}>
                        <Image roundedCircle src={profilePic} style={{height: "30px", width: "30px"}}/>
                        <div style={{alignSelf: "center"}}>{currentUser.displayName}</div>
                    </Container>
                    <Image src={pictureUrl} className="previewImage" style={{width: "250px", height: "250px",  objectFit: "cover", objectPosition: `${positionX}% ${positionY}%`}}/>
                    <Container as="div" className="d-flex mt-1">
                        <Image src={likeIcon} style={{height: "30px"}}/>
                        <Image src={commentIcon} style={{height: "30px"}}/>
                    </Container>
                    <Container>
                    <p style={{fontSize: "10px"}}><span style={{fontWeight: "bold", fontSize: "12.5px"}}>{currentUser.displayName}</span>  {caption}</p>
                    </Container>
                </Container>
                <Button disabled={loading} type="button" className="text-center mt-2 black btn-dark" onClick={handleSubmit}>Post</Button>
            </Card.Body>
        </Card>
        }
    </div>
    )
} 