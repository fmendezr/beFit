import { Tabs, Tab, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useDB } from "../contexts/DBContext";
import NavbarComponent from "./Navbar";
import UserPreviewSearch from "./UserPreviewSearch";
import UserPreviewFollowing from "./UserPreviewFollowing";
import UserPreviewFollowers from "./UserPreviewFollowers";

export default function Friends () {

    const {currentUser} = useAuth();
    const {getAllUsers, getUser} = useDB(); 

    const [allUsers, setAllUsers] = useState([]);
    const [filteredAllUsers, setFilteredAllUsers] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [filteredFollowers, setFilteredFollowesrs] = useState([]);
    const [following, setFollowing] = useState([]);
    const [filteredFollowing, setFilteredFollowing] = useState([]);
    const [requests, setRequests] = useState([]);


    useEffect(() => {
        const getUsers = async () => {
            let currentUserObj = null;
            const allOtherUserObj = [];
            // fetch all users
            const querySnapshot = await getAllUsers();
            querySnapshot.forEach((doc) => {
                const userObj = doc.data();
                userObj.uid = doc.id
                // set current user obj and set all users
                if (doc.id === currentUser.uid){
                    currentUserObj = userObj;
                } else {
                    setAllUsers((previousState) => {
                        return previousState.concat(userObj);
                    });
                    allOtherUserObj.push(userObj);
                }
            });
           
            // set the states
            setFollowing(allOtherUserObj.filter((user) => currentUserObj.following.includes(user.uid)));
            setFollowers(allOtherUserObj.filter((user) => currentUserObj.followers.includes(user.uid)));
            setRequests(allOtherUserObj.filter((user) => currentUserObj.requests.includes(user.uid)));
        }
        getUsers();
    }, [])

    return (
    <div className="w-100" style={{minHeight: "100vh"}}>
        <NavbarComponent />
        <Tabs
            defaultActiveKey="Search"
            id="fill-tab-example"
            className="mb-3 mt-3"
            fill
        >
            <Tab eventKey="Search" title="Search">
                <Container as="div" className="w-80">  
                    {allUsers.map((user) => {
                        return (
                            <UserPreviewSearch
                                key={user.uid}
                                user={user}
                            />
                        )
                    })}                  
                </Container>
            </Tab>
            <Tab eventKey="Followers" title="Followers">
                <Container as="div" className="w-80">
                    {followers.map((user) => {
                        return (
                            <UserPreviewFollowers 
                                key={user.uid}
                                user={user}
                                cuser={currentUser}
                            />
                        )
                    })}
                </Container>
            </Tab>
            <Tab eventKey="Following" title="Following">
                <Container as="div" className="w-80">
                    {following.map((user) => {
                        return (
                            <UserPreviewFollowing 
                                key={user.uid}
                                user={user}
                                cuser={currentUser}
                            />
                        )
                    })}
                </Container>
            </Tab>
        </Tabs>
    </div>
    )
}