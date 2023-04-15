import { Container, Row, Col, Image, Carousel, CarouselItem, Button} from "react-bootstrap";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDB } from "../contexts/DBContext";
import { useStorage } from "../contexts/StorageContext";
import NavbarComponent from "./Navbar";
import PostPreview from "./PostPreview";
import defaultProfilePic from "../assets/defaultProfile.png";
import badgesIcon from "../assets/badgesIcon.svg";
import streakIcon from "../assets/streakIcon.svg";
import { OAuthCredential } from "firebase/auth";

export default function OtherUserProfile () {

    const {currentUser} = useAuth();

    const [profilePicUrl, setProfilePicUrl] = useState(defaultProfilePic)
    const [username, setUsername] = useState("");
    const [streak, setStreak] = useState(0);
    const [badges, setBadges] = useState([]);
    const [bio, setBio] = useState("")
    const [followers, setFollowers] = useState([]); 
    const [following, setFollowings] = useState([]);
    const [inFollowers, setInFollowers] = useState(false);
    const [disabledFollowButton, setDisabledFollowButton] = useState(false);

    const [postIds, setPostIds] = useState([])

    const { downloadProfilePic } = useStorage();
    const { getUser, setFollowing, setFollowed, setUnfollowing,setUnfollowed, } = useDB();

    const location = useLocation();
    const userInfo = location.state

    useEffect(() => {
        const updateStates = async () => {
            const downloadPic = await downloadProfilePic(userInfo.uid);
            setProfilePicUrl(downloadPic);
            const rawUserData = await getUser(userInfo.uid);
            if (rawUserData.exists()){
                const userData = rawUserData.data();
                setUsername(userData.username);
                setStreak(userData.streak);
                setBadges(userData.badges);
                setBio(userData.userBio);
                setPostIds(userData.posts.reverse());
                setFollowers(userData.followers);
                setFollowings(userData.following);
                if (userData.followers.includes(currentUser.uid)){
                    setInFollowers(true);
                }
            }
        }
        updateStates();
    },[])

    const followUser = async () => {
        setDisabledFollowButton(true);
        try {
            await setFollowing(currentUser.uid, userInfo.uid);
            await setFollowed(userInfo.uid, currentUser.uid);
            setFollowers((previousState) => {
                return previousState.concat(currentUser.uid);
            })
            setInFollowers(true);
        } catch (error) {
            console.log(error);
        }
        setDisabledFollowButton(false);
    }

    const unfollowUser = async () => {
        setDisabledFollowButton(true);
        try {
            await setUnfollowing(currentUser.uid, userInfo.uid);
            await setUnfollowed(userInfo.uid, currentUser.uid);
            setFollowers((previousState) => {
                const arr = previousState.filter((id) => {
                    return id !== currentUser.uid
                })
                return arr;
            });
            setInFollowers(false);
        } catch (error) {
            console.log(error);
        }
        setDisabledFollowButton(false);
    }

    const handleFollowBtnClick = async () => {
        if (!inFollowers){
            await followUser()
        } else {
            await unfollowUser()
        }
    }

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
                            <Image src={badgesIcon}/>
                            <h3>{followers.length}</h3>
                        </Col>
                        <Col className="d-flex justify-content-center align-items-center">
                            <h3>{following.length}</h3>
                            <Image src={streakIcon}/>
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
                    <Button variant="dark" disabled={disabledFollowButton} onClick={handleFollowBtnClick} className="w-100 mb-3">{inFollowers ? "Unfollow" : "Follow"}</Button>
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