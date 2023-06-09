import { Container, Row, Col, Image, Carousel, CarouselItem} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useDB } from "../contexts/DBContext";
import { useStorage } from "../contexts/StorageContext";
import { useState, useEffect } from "react";
import NavbarComponent from "./Navbar";
import PostPreview from "./PostPreview";
import defaultProfilePic from "../assets/defaultProfile.png";
import badgesIcon from "../assets/badgesIcon.svg";
import followingIcon from "../assets/followingIcon.svg";
import followersIcon from "../assets/followersIcon.svg";
import { Link } from "react-router-dom";

export default function UserProfile () {

    const [profilePicUrl, setProfilePicUrl] = useState(defaultProfilePic)
    const [username, setUsername] = useState("");
    const [streak, setStreak] = useState(0);
    const [badges, setBadges] = useState([]);
    const [followers, setFollowers] = useState([]); 
    const [following, setFollowing] = useState([]);
    const [bio, setBio] = useState("")

    const [postIds, setPostIds] = useState([])

    const { currentUser } = useAuth();
    const { downloadProfilePic } = useStorage();
    const { getUser } = useDB();

    useEffect(() => {
        const updateStates = async () => {
            const downloadPic = await downloadProfilePic(currentUser.uid);
            setProfilePicUrl(downloadPic);
            const rawUserData = await getUser(currentUser.uid);
            if (rawUserData.exists()){
                const userData = rawUserData.data();
                setUsername(userData.username);
                setStreak(userData.streak);
                setBadges(userData.badges);
                setBio(userData.userBio);
                setPostIds(userData.posts.reverse());
                setFollowers(userData.followers);
                setFollowing(userData.following);
            }
        }
        updateStates();
    },[])

    return (
       <div className="w-100" style={{minHeight: "100vh"}}>
            <NavbarComponent></NavbarComponent>
            <Container className="mt-4">
                <Container as="div" style={{maxWidth: "450px", borderBottom:"3px solid  black"}}>
                    <Row as="div">
                        <h1 style={{textAlign: "center"}}>{username}</h1>
                    </Row>
                    <Row as="div" className="justify-content-center">
                        <Image roundedCircle src={profilePicUrl} style={{height: "200px", width: "225px"}}/>
                    </Row>
                    <Row as="div" className="mt-2">
                        <Col className="d-flex justify-content-center align-items-center">
                            <Link to="/social" className="d-flex justify-content-center align-items-center" state={{key: "Followers"}} style={{color: "black", textDecoration: "none"}}>
                                <Image src={followersIcon}/>
                                <h3>{followers.length}</h3>
                            </Link>
                        </Col>
                        <Col className="d-flex justify-content-center align-items-center">
                            <Link to="/social" className="d-flex justify-content-center align-items-center" state={{key: "Following"}} style={{color: "black", textDecoration: "none"}}>
                            <h3>{following.length}</h3>
                            <Image src={followingIcon}/>
                            </Link>
                        </Col>
                    </Row>
                    <Row as="div" className="mt-3">
                        <p style={{textAlign: "center"}}>{bio}</p>
                    </Row>
                    <Carousel variant="dark" className="mb-3">
                        <CarouselItem className="">
                            <Container className="w-100 d-flex justify-content-center" style={{height: "85px"}}>
                                <Image style={{width: "25%"}} src={badgesIcon} />
                                <Image style={{width: "25%"}} src={badgesIcon} />                                
                                <Image style={{width: "25%"}} src={badgesIcon} />
                            </Container>
                        </CarouselItem>
                        <CarouselItem className="">
                            <Container className="w-100 d-flex justify-content-center" style={{height: "85px"}}>
                                <Image style={{width: "25%"}} src={badgesIcon} />
                                <Image style={{width: "25%"}} src={badgesIcon} />
                                <Image style={{width: "25%"}} src={badgesIcon} />
                            </Container>
                        </CarouselItem>
                    </Carousel>
                </Container>
                <Container className="mt-3 mb-3" style={{maxWidth: "950px"}}>
                    <Row style={{display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center"}}>
                        {postIds.map((post) => {
                            return (
                                <PostPreview 
                                    key={post}
                                    postId={post}
                                    username={username}
                                    profilePicUrl={profilePicUrl}
                                />
                            )
                        })}
                    </Row>
                </Container>
            </Container>
       </div>)
}