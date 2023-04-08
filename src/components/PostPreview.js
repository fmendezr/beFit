import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { useStorage } from "../contexts/StorageContext";
import { useDB } from "../contexts/DBContext";
import loadingGif from "../assets/loadingIcon.gif"


export default function PostPreview ({postId}) {

    const {downloadPostPic} = useStorage();
    const {getPostInfo} = useStorage();

    const [imageUrl, setImageUrl] = useState(loadingGif);
    const [caption, setCaption] = useState("");
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [positionX, setPositionX] = useState("0");
    const [positionY, setPositionY] = useState("0");

    useEffect(() => {
        const getDownloadPostPic = async () => {
            const downloadPic = await downloadPostPic(postId);
            setImageUrl(downloadPic);
            const rawPostData = await getPostInfo(postId);
            if (rawPostData.exists()){
                const postInfo = rawPostData.data();
                setCaption(postInfo.caption);
                setComments(postInfo.comments);
                setLikes(postInfo.likes);
                setPositionX(postInfo.positionX);
                setPositionY(postInfo.positionY);
            }

        };
        getDownloadPostPic();
    },[]);

    return (
        <Image src={imageUrl} style={{height: "250px", width: "250px", objectFit: "cover", objectPosition: `${positionX}% ${positionY}%`}}/>
    )
}