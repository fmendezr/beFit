import { Container, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStorage } from "../contexts/StorageContext";
import loadingGif from "../assets/loadingIcon.gif"

export default function UserPreviewSearch ({user}) {

    const {downloadProfilePic} = useStorage();

    const [profilePicUrl, setProfilePicUrl] = useState(loadingGif)

    useEffect(() => {
        const getProfilePic = async () => {
            const downloadPic = await downloadProfilePic(user.uid);
            setProfilePicUrl(downloadPic);
        }
        getProfilePic();
    }, [])

    return (
        <div style={{paddingBottom: "10px" ,marginBottom: "10px", borderBottom: "2px solid black"}}>
            <Link to={`/users/${user.username}`} state={{uid: user.uid}} style={{color:"black", textDecoration: "none"}}>
                <Container style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <Image src={profilePicUrl} roundedCircle style={{height: "40px", width: "40px"}}/>
                    {user.username}
                </Container>
            </Link>  
        </div>
    )
}