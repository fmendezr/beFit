import {  Image, Alert, Form, Button } from "react-bootstrap";
import { useStorage } from "../contexts/StorageContext";
import { useDB } from "../contexts/DBContext";
import { useEffect, useState, useRef } from "react";
import { v4 } from "uuid";
import Comment from "./Comment";
import { Link } from "react-router-dom";
import likeIcon from "../assets/likeIcon.svg";
import likedIcon from "../assets/likedIcon.svg";
import commentClosedIcon from "../assets/commentsClosedIcon.svg";
import commentOpenedIcon from "../assets/commentsOpenedIcon.svg";
import saveIcon from "../assets/saveIcon.svg";
import savedIcon from "../assets/savedIcon.svg";
import postCommentIcon from "../assets/postCommentIcon.svg"
import defaultProfilePic from "../assets/defaultProfile.png";
import loadingIconGif from "../assets/loadingIcon.gif"

export default function PostOnFeed ({postObj, cuserProfilePic, cuser}) {

    const { downloadProfilePic, downloadPostPic} = useStorage();
    const { likePost, unlikePost, savePost, unsavePost, createComment } = useDB();

    const [userProfilePic, setUserProfilePic] = useState(defaultProfilePic);
    const [postImage, setPostImage] = useState(loadingIconGif);

    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [showComments, setShowComments] = useState(false);

    const [error, setError] = useState(false);
    const [newComments, setNewComments] = useState([]);
    const comment = useRef("");

    const like = async () => {
        try {
          await likePost(postObj.pid, cuser.uid);
          setLiked(true);
        } catch (error) {
          console.log(error);
        }
      }
  
      const unlike = async () => {
        try {
          await unlikePost(postObj.pid, cuser.uid);
          setLiked(false);
        } catch (error) {
          console.log(error);
        }
      }
  
      const save = async () => {
        try {
          await savePost(cuser.uid, postObj.pid);
          setSaved(true);
        } catch (error) {
          console.log(error);
        }
      }
  
      const unsave = async () => {
        try {
          await unsavePost(cuser.uid, postObj.pid);
          setSaved(false);
        } catch (error) {
          console.log(error);
        }
      }
  
      const openComments = () => {
        setShowComments(true);
      }
  
      const closeComments = () => {
        setShowComments(false);
      }
  
      const submitComment =  async (e) => {
        e.preventDefault();
        const commentContent = comment.current.value;
        try {
          await createComment(postObj.pid, cuser.uid, commentContent);
          const commentObj = {
            "uid": cuser.uid,
            "contents": commentContent 
          }
          setNewComments((previouosState) => { 
            const newArr = [commentObj].concat(previouosState);
            return newArr;
          })
          setError(false)
        } catch (e){
          setError("An error was encountered, comment could not be uploaded.")
          console.log(e)
        }
      }

    useEffect(() => {
        const getInfoForStates = async () => {
            const profileImage = await downloadProfilePic(postObj.user);
            setUserProfilePic(profileImage);
            const postImage = await downloadPostPic(postObj.pid);
            setPostImage(postImage);
        } 
        getInfoForStates();
    }, [])

    return (
        <div className="postFeedContainer mt-3" style={{maxWidth: "650px", display: "flex", flexDirection: "column", alignItems: "center", alignSelf: "center"}}> 
            <div as="div" className="postFeedHeader mb-1" style={{width: "100%", display: "flex", alignItems: "center", gap: "5px"}}>
                <Link to={postObj.user === cuser.uid ? `/${cuser.displayName}` : `/users/${postObj.username}`} state={{uid: postObj.user}} style={{color: "black", textDecoration: "none"}}>
                    <Image roundedCircle src={userProfilePic} style={{width: "40px"}}/>
                    {postObj.username}
                </Link>
            </div>
            <Image 
                src={postImage}
                className="postFeedImage"
                style={{objectFit: "cover", objectPosition: `${postObj.positionX}% ${postObj.positionY}%`}}
            />
            <div className="postFeedBtnContainer" style={{width: "100%" ,display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
                <div>
                    {liked ? <Image src={likedIcon} onClick={unlike} style={{width: "35px"}}/> : <Image src={likeIcon} onClick={like} style={{width: "35px"}}/>}
                    {showComments ? <Image src={commentOpenedIcon} onClick={closeComments} style={{width: "35px"}} /> :<Image src={commentClosedIcon} onClick={openComments} style={{width: "35px"}}/>}
                </div>
                {saved ? <Image src={savedIcon} onClick={unsave} style={{width: "35px"}}/> : <Image src={saveIcon} onClick={save} style={{width: "35px"}}/>}
            </div>
            <div className="postFeedTextContainer" style={{fontFamily: "alkatra", width: "100%"}}>
              <p><span style={{fontWeight: "bold", fontSize: "17.5px"}}>{postObj.username}</span>  {postObj.caption}</p>
            </div>
            {showComments ?
            <div className="postFeedCommentsContainer pt-3" style={{fontFamily: "alkatra", borderTop: "2px solid black", display: "flex", flexDirection: "column", gap:"15px", width: "100%"}}>
              { error !== false ?  <Alert className="alert-danger" style={{textAlign: "center", marginBottom: "-5px"}}>{error}</Alert> : null }
              <div className="commentCreator" style={{display:"flex"}}>
                <Form.Control placeholder="Comment..." ref={comment} /><Button bg="black" variant="dark"><Image src={postCommentIcon} className="whiteSVG" style={{height: "30px"}} onClick={submitComment}/></Button>
              </div>
              {newComments.map((comment) => {
                return(
                  <Comment 
                    key={v4()}
                    uid={comment.uid}
                    contents={comment.contents}
                  />
                )
              })}
              {postObj.comments.map((comment) => {
                return(
                  <Comment 
                    key={v4()}
                    uid={comment.uid}
                    contents={comment.contents}
                  />
                )
              })}
            </div> 
            : null }
        </div>
    )
}