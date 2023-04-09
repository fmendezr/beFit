import { useEffect, useState } from "react"
import { useDB } from "../contexts/DBContext";
import { useStorage } from "../contexts/StorageContext";
import { Image } from "react-bootstrap"
import defaultProfilePic from "../assets/defaultProfile.png"

export default function Comment ({uid, contents}){

    const {getUser} = useDB()
    const {downloadProfilePic} = useStorage()

    const [profilePicUrl, setProfilePicUrl] = useState(defaultProfilePic);
    const [username, setUsername] = useState("jhbv")

    useEffect(() => {
        const getCommentorInfo = async () => {
            // get profile pic
            const downloadURL = await downloadProfilePic(uid);
            setProfilePicUrl(downloadURL);
            // get username            
            const rawUserData = await getUser(uid);
            if (rawUserData.exists()){
                const userData = rawUserData.data();
                setUsername(userData.username)
            }
        }
        getCommentorInfo();
    }, [])

    return (
        <div style={{display: "flex", gap: "4px"}}>
            <Image src={profilePicUrl} roundedCircle style={{width: "30px", height:"30px"}} />
            <p style={{fontSize: "15px"}}><span style={{fontWeight: "bold"}}>{username}</span>  {contents}</p>
        </div>
    )
}