import { useEffect, useState } from 'react';
import { Modal, Image, Container, Form, Button } from "react-bootstrap";
import { useDB } from '../contexts/DBContext';
import { useAuth } from '../contexts/AuthContext';
import UserPreviewFollowing from './UserPreviewFollowing';
import notFoundIcon from "../assets/notFoundIcon.svg";


export default function FollowingModal (props) {

    const {getUser} = useDB();
    const {currentUser} = useAuth();

    const [following, setFollowing] = useState([]);
    const [followingFiltered, setFollowingFiltered] = useState([]);

    const handleFollowingFiltered = (e) => {
        const parameter = e.target.value;
        setFollowingFiltered(following.filter((user) => user.username.toLowerCase().startsWith(parameter.toLowerCase()))); 
    }

    useEffect(() => {
        const userObjArr = [];
        const getFollowersData = async () => {
            for (let i =0; i < props.followingArr.length; i++){
                let rawUserData = await getUser(props.followingArr[i]);
                if (rawUserData.exists()){
                    const userData = rawUserData.data();
                    userData.uid = props.followingArr[i];
                    userObjArr.push(userData);
                }
            }
            setFollowing(userObjArr);
            setFollowingFiltered(userObjArr);
        }
        getFollowersData();
    }, [])

    return (
        <Modal
            show={props.show}
            onHide={() => {props.onHide()}}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Followers
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control type="text" placeholder="Search..." onChange={handleFollowingFiltered} className="mb-3"></Form.Control>
                    {followingFiltered.length == 0 ? 
                    <Container className="w-100" style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <Image src={notFoundIcon} style={{height: "155px", width: "155px"}} />
                        <h2>No Users Found</h2>
                    </Container> 
                    :
                        null
                    } 
                    {followingFiltered.map((user) => {
                        return (
                            <UserPreviewFollowing 
                                key={user.uid}
                                user={user}
                                cuser={currentUser}
                                admin={user === currentUser.uid}
                            />
                        )
                    })}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
