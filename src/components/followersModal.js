import { useEffect, useState } from 'react';
import { Modal, Image, Container, Form, Button } from "react-bootstrap";
import { useDB } from '../contexts/DBContext';
import { useAuth } from '../contexts/AuthContext';
import UserPreviewFollowers from './UserPreviewFollowers';
import notFoundIcon from "../assets/notFoundIcon.svg";


export default function FollowerModals (props) {

    const {getUser} = useDB();
    const {currentUser} = useAuth();

    const [followers, setFollowers] = useState([]);
    const [followersFilltered, setFilteredFollowers] = useState([]);

    const handleFollowersFiltered = (e) => {
        const parameter = e.target.value;
        setFilteredFollowers(followers.filter((user) => user.username.toLowerCase().startsWith(parameter.toLowerCase()))); 
    }

    useEffect(() => {
        const userObjArr = [];
        const getFollowersData = async () => {
            for (let i =0; i < props.followersArr.length; i++){
                let rawUserData = await getUser(props.followersArr[i]);
                if (rawUserData.exists()){
                    const userData = rawUserData.data();
                    userData.uid = props.followersArr[i];
                    userObjArr.push(userData);
                }
            }
            setFollowers(userObjArr);
            setFilteredFollowers(userObjArr);
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
                <Form.Control type="text" placeholder="Search..." onChange={handleFollowersFiltered} className="mb-3"></Form.Control>
                    {followersFilltered.length == 0 ? 
                    <Container className="w-100" style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <Image src={notFoundIcon} style={{height: "155px", width: "155px"}} />
                        <h2>No Users Found</h2>
                    </Container> 
                    :
                        null
                    } 
                    {followersFilltered.map((user) => {
                        return (
                            <UserPreviewFollowers 
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
