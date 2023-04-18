import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDB } from "../contexts/DBContext";
import { useStorage } from "../contexts/StorageContext";
import { useEffect, useState } from "react";
import NavbarComponent from "./Navbar";
import PostOnFeed from "./PostOnFeed";
import defaultProfilePic from "../assets/defaultProfile.png";
import { Button } from "react-bootstrap";

export default function Home () {

    const { currentUser } = useAuth();
    const { getUser, getAllPostsInfo } = useDB();
    const { downloadProfilePic } = useStorage();

    const [profilePicUrl, setProfilePicUrl] = useState(defaultProfilePic)
    const [following, setFollowing] = useState([]);

    const [followingPosts, setFollowingPosts] = useState([]);
    const [slicedFollowingPosts, setSlicedFollowingPosts] = useState([]);
    const [postsInFeed, setPostsInFeed] = useState(5);

    const loadMorePosts = () => {
        setPostsInFeed((previousState) => {
            return previousState += 10;
        })
        setSlicedFollowingPosts(followingPosts.slice(0, postsInFeed + 10));
    }

    useEffect(() => {
        const fetchData = async () => {
            let followingUids = [];
            const postObjArr = [];
            const rawUserData = await getUser(currentUser.uid)
            if (rawUserData.exists()){
                const userData = rawUserData.data();
                setFollowing(userData.following);
                followingUids = userData.following;
            }
            const profileImage = await downloadProfilePic(currentUser.uid);
            setProfilePicUrl(profileImage);
            const querySnapshot = await getAllPostsInfo();
            querySnapshot.forEach(doc => {
                let obj = doc.data();
                obj.pid = doc.id;
                if (followingUids.includes(obj.user)){
                    postObjArr.push(obj);
                }
            });            
            postObjArr.sort((a, b) => {
                return b.postedOn.toDate() - a.postedOn.toDate()
            });
            setFollowingPosts(postObjArr);
            setSlicedFollowingPosts(postObjArr.slice(0, 5))
        }
        fetchData();
    }, [])

    return (
    <div className="w-100" style={{minHeight: 100, display: "flex", flexDirection: "column"}}>
        <NavbarComponent sticky={true} />
        {slicedFollowingPosts.map((post, index) => {
            return <PostOnFeed 
                postObj={post}
                cuserProfilePic={profilePicUrl}
                cuser={currentUser}
                key={index}
            />
        })}
        {postsInFeed < followingPosts.length ? <Button style={{alignSelf: "center", marginBottom: "15px"}} variant="dark" onClick={loadMorePosts}>Load More Post</Button> : <p style={{alignSelf: "center", color: "#0275d8", marginBottom: "10px"}}> End of Posts of Accounts u Follow</p>}
    </div>)
}