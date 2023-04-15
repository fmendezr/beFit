import { Button, Container, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStorage } from "../contexts/StorageContext";
import { useDB } from "../contexts/DBContext";
import { useAuth } from "../contexts/AuthContext";
import loadingGif from "../assets/loadingIcon.gif"

export default function UserPreviewFollowers ({user, cuser}) {

    const {downloadProfilePic} = useStorage();
    const {setUnfollowing, setUnfollowed} = useDB();

    const [profilePicUrl, setProfilePicUrl] = useState(loadingGif);

    const [followed, setFollowd] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        setLoading(true);
        if (followed){
            try {
                await setUnfollowing(user.uid, cuser.uid);
                await setUnfollowed(cuser.uid, user.uid);
                setFollowd(false);
            } catch (error) {
                console.log(error);
            }    
        } 
    }

    useEffect(() => {
        const getProfilePic = async () => {
            const downloadPic = await downloadProfilePic(user.uid);
            setProfilePicUrl(downloadPic);
        }
        getProfilePic();
    }, [])

    return (
        <div style={{paddingBottom: "10px" ,marginBottom: "10px", borderBottom: "2px solid black"}}>
            <Link to={`/users/${user.username}`} state={{uid: user.uid}} style={{color:"black", textDecoration: "none", display:"flex"}}>
                <Container style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <Image src={profilePicUrl} roundedCircle style={{height: "40px", width: "40px"}}/>
                    {user.username}
                </Container>
                <Button variant={followed ? "dark" : "primary"} disabled={loading} onClick={handleClick} style={{height: "35px", width: "88px"}}>{followed ? "remove" : "removed" }</Button>  
            </Link>
        </div>
    )
}