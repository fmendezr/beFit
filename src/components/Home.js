import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDB } from "../contexts/DBContext";
import friendsIcon from "../assets/friends.png";
import beFit from "../assets/BeFit.png";
import profile from "../assets/profile.png";
import { useEffect, useState } from "react";

export default function Home () {

    const { currentUser } = useAuth();
    const { getUser } = useDB();
    const [username, setUsername ] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const rawUserData = await getUser(currentUser.uid)
            if (rawUserData.exists()){
                const userData = rawUserData.data();
                setUsername(userData.username);
            }
        }
        fetchData();
    }, [])

    return (
    <>
        <div className="navbar">
            <Link to="friends"><img className="mainIcon" src={friendsIcon}/></Link>
            <img className="mainLogo" src={beFit}/>
            <Link to={`/${username}`}><img className="mainIcon" src={profile}/></Link>
        </div>    
    </>)
}