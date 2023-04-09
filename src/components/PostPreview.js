import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { useStorage } from "../contexts/StorageContext";
import { useDB } from "../contexts/DBContext";
import PostModal from "./PostModal";
import loadingGif from "../assets/loadingIcon.gif"


export default function PostPreview ({postId, username,  profilePicUrl}) {

    const {downloadPostPic} = useStorage();
    const {getPostInfo} = useDB();

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
                profilePicUrl={profilePicUrl}
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