import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { useStorage } from "../contexts/StorageContext";
import { useDB } from "../contexts/DBContext";
import PostModal from "./PostModal";
import loadingGif from "../assets/loadingIcon.gif";
import defaultProfilePic from "../assets/defaultProfile.png";


export default function SavedPostPreview ({postId}) {

    const {downloadPostPic, downloadProfilePic} = useStorage();
    const {getPostInfo} = useDB();

    const [uid, setUid] = useState("");
    const [username, setUsername] = useState("");
    const [posterProfilePicUrl, setPosterProfilePicUrl] = useState(defaultProfilePic);
    const [imageUrl, setImageUrl] = useState(loadingGif);
    const [caption, setCaption] = useState("");
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [positionX, setPositionX] = useState("0");
    const [positionY, setPositionY] = useState("0");

    const [showModal, setShowModal] = useState(false); 

    const alternateShowModal = () => {
        setShowModal((previousState) => {
            return previousState === false
        })
    }

    useEffect(() => {
        const getDownloadPostPic = async () => {
            let tempUid = null
            const downloadPic = await downloadPostPic(postId);
            setImageUrl(downloadPic);
            const rawPostData = await getPostInfo(postId);
            if (rawPostData.exists()){
                const postInfo = rawPostData.data();
                setUid(postInfo.user);
                tempUid = postInfo.user;
                setUsername(postInfo.username);
                setCaption(postInfo.caption);
                let commentsArr = postInfo.comments.reverse() 
                setComments(commentsArr);
                setLikes(postInfo.likes);
                setPositionX(postInfo.positionX);
                setPositionY(postInfo.positionY);
            }
            const downloadUserPic = await downloadProfilePic(tempUid);
            setPosterProfilePicUrl(downloadUserPic);
        };
        getDownloadPostPic();
    },[]);

    const addComment = (commentObj) => {
        setComments((previousState) => {
            const newCommentArr = previousState.unshift(commentObj)
            return newCommentArr
        })
    }

    return (
        <>
            <Image src={imageUrl} style={{height: "250px", width: "250px", objectFit: "cover", objectPosition: `${positionX}% ${positionY}%`}} onClick={alternateShowModal} />
            <PostModal
                show={showModal}
                onHide={alternateShowModal}
                profilePicUrl={posterProfilePicUrl}
                username={username}
                caption={caption}
                imageUrl={imageUrl}
                x={positionX}
                y={positionY}
                comments={comments}
                addComment={addComment}
                likes={likes}
                pid={postId} 
            />
        </>
    )
}