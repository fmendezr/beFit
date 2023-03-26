import { useAuth } from "../contexts/AuthContext";
import { useDB } from "../contexts/DBContext";
import { useStorage } from "../contexts/StorageContext";
import { useState, useEffect } from "react";
import defaultProfilePic from "../assets/defaultProfile.png";
import badgesIcon from "../assets/badgesIcon.svg";
import streakIcon from "../assets/streakIcon.svg";
import returnIcon from "../assets/arrowback.svg";
import { Link } from "react-router-dom";

export default function UserProfile () {

    const [profilePicUrl, setProfilePicUrl] = useState(defaultProfilePic)
    const [username, setUsername] = useState("");
    const [streak, setStreak] = useState(0);
    const [badges, setBadges] = useState([]);
    const [bio, setBio] = useState("")

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
                setBio(userData.bio);
            }
        }
        updateStates();
    },[])

    return (
    <div className="profileContainer">
        <Link to="/" style={{alignSelf: "flex-start"}}><img id="arrow" className="icon" src={returnIcon}/></Link>
        <p className="username">{username}</p>
        <img className="profileImage" src={profilePicUrl}/>
        <p className="bio">{bio}</p>
        <div className="stats">
            <div className="badges">
                <img className="icon" src={badgesIcon}/>
                <p>{badges.length}</p>
            </div>
            <div className="streak">
                <p>{streak}</p>
                <img className="icon" src={streakIcon}/>
            </div>
        </div>
        <div className="lined-subtitle">
            <div className="short-line"/>
            <p>Featured badges</p>
            <div className="line"/>
        </div>
        <div className="featured-badges">
        </div>
        <div className="lined-subtitle">
            <div className="short-line"/>
            <p>Posts</p>
            <div className="line"/>
        </div>
    </div>)
}