import { Tabs, Tab, Container, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useDB } from "../contexts/DBContext";
import NavbarComponent from "./Navbar";
import UserPreviewSearch from "./UserPreviewSearch";
import UserPreviewFollowing from "./UserPreviewFollowing";
import UserPreviewFollowers from "./UserPreviewFollowers";
import notFoundIcon from "../assets/notFoundIcon.svg";

export default function Friends () {

    const {currentUser} = useAuth();
    const {getAllUsers, getUser} = useDB(); 

    const [allUsers, setAllUsers] = useState([]);
    const [filteredAllUsers, setFilteredAllUsers] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [filteredFollowers, setFilteredFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [filteredFollowing, setFilteredFollowing] = useState([]);
    const [requests, setRequests] = useState([]);

    const handleAllUsersFilter = (e) => {
        const parameter = e.target.value;
        setFilteredAllUsers(allUsers.filter((user) => user.username.toLowerCase().startsWith(parameter.toLowerCase())).slice(0,10)); 
    }

    const handleFollowersFiltered = (e) => {
        const parameter = e.target.value;
        setFilteredFollowers(followers.filter((user) => user.username.toLowerCase().startsWith(parameter.toLowerCase()))); 
    }

    const handleFollowingFiltered = (e) => {
        const parameter = e.target.value;
        setFilteredFollowing(following.filter((user) => user.username.toLowerCase().startsWith(parameter.toLowerCase()))); 
    }

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
                    allOtherUserObj.push(userObj);
                }
            });
            // set the states
            setAllUsers(allOtherUserObj);
            setFilteredAllUsers(allOtherUserObj);
            const followingsArr = allOtherUserObj.filter((user) => currentUserObj.following.includes(user.uid));
            setFollowing(followingsArr);
            setFilteredFollowing(followingsArr);
            const followersArr = allOtherUserObj.filter((user) => currentUserObj.followers.includes(user.uid))
            setFollowers(followersArr);
            setFilteredFollowers(followersArr);
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
                    <Form.Control type="text" placeholder="Search..." onChange={handleAllUsersFilter} className="mb-3"></Form.Control> 
                    {filteredAllUsers.map((user) => {
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
                    <Form.Control type="text" placeholder="Search..." onChange={handleFollowersFiltered} className="mb-3"></Form.Control> 
                    {filteredFollowers.map((user) => {
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
                    <Form.Control type="text" placeholder="Search..." onChange={handleFollowingFiltered} className="mb-3"></Form.Control> 
                    {filteredFollowing.map((user) => {
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