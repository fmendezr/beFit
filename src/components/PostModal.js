import { Modal, Button, Image, Container, Form, Alert } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import { v4 } from "uuid";
import { useAuth } from "../contexts/AuthContext"
import { useDB } from "../contexts/DBContext";
import Comment from "./Comment";
import likeIcon from "../assets/likeIcon.svg";
import likedIcon from "../assets/likedIcon.svg";
import commentClosedIcon from "../assets/commentsClosedIcon.svg";
import commentOpenedIcon from "../assets/commentsOpenedIcon.svg";
import saveIcon from "../assets/saveIcon.svg";
import savedIcon from "../assets/savedIcon.svg";
import postCommentIcon from "../assets/postCommentIcon.svg"
import { Link } from "react-router-dom";

export default function PostModal (props){

    const { currentUser } = useAuth();
    const { getUser, likePost, unlikePost, savePost, unsavePost, createComment } = useDB();

    const pid = props.pid;

    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [showComments, setShowComments] = useState(false);

    const [error, setError] = useState(false);
    const [newComments, setNewComments] = useState([]);
    const comment = useRef("");

    useEffect(()=>{
      const updateStatesAccurately = async () => {
        // get if liked
        if (props.likes.includes(currentUser.uid)){
          setLiked(true);
        }
        // get if saved
        const rawCurrentUserData = await getUser(currentUser.uid);
        if (rawCurrentUserData.exists()){
          const currentUserData = rawCurrentUserData.data();
          const savedPosts = currentUserData.savedPosts;
          if (savedPosts.includes(pid)){
            setSaved(true);
          }
        }
      };
      updateStatesAccurately();
    },[])

    const like = async () => {
      try {
        await likePost(pid, currentUser.uid);
        setLiked(true);
      } catch (error) {
        console.log(error);
      }
    }

    const unlike = async () => {
      try {
        await unlikePost(pid, currentUser.uid);
        setLiked(false);
      } catch (error) {
        console.log(error);
      }
    }

    const save = async () => {
      try {
        await savePost(currentUser.uid, pid);
        setSaved(true);
      } catch (error) {
        console.log(error);
      }
    }

    const unsave = async () => {
      try {
        await unsavePost(currentUser.uid, pid);
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
        await createComment(pid, currentUser.uid, commentContent);
        const commentObj = {
          "uid": currentUser.uid,
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

    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter" style={{fontFamily: "alkatra"}}>
              <Link to={props.uid === currentUser.uid ? `/${currentUser.displayName}` : `/users/${props.username}`} state={{uid: props.uid}} style={{color: "black", textDecoration: "none"}}>
                <Image roundedCircle src={props.profilePicUrl} style={{width: "40px"}}/>
                {props.username}
              </Link>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex flex-column align-items-center">
            <Image src={props.imageUrl} className="imagePostModal" style={{objectFit: "cover", objectPosition: `${props.x}% ${props.y}%`}}/>
            <div className="buttonsContainerModal mt-2" style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
              <div>
                {liked ? <Image src={likedIcon} onClick={unlike} style={{width: "35px"}}/> : <Image src={likeIcon} onClick={like} style={{width: "35px"}}/>}
                {showComments ? <Image src={commentOpenedIcon} onClick={closeComments} style={{width: "35px"}} /> :<Image src={commentClosedIcon} onClick={openComments} style={{width: "35px"}}/>}
              </div>
              {saved ? <Image src={savedIcon} onClick={unsave} style={{width: "35px"}}/> : <Image src={saveIcon} onClick={save} style={{width: "35px"}}/>}
            </div>
            <div className="textPostModal" style={{fontFamily: "alkatra"}}>
              <p><span style={{fontWeight: "bold", fontSize: "17.5px"}}>{props.username}</span>  {props.caption}</p>
            </div>
            {showComments ?
            <div className="commentsPostModal pt-3" style={{fontFamily: "alkatra", borderTop: "2px solid black", display: "flex", flexDirection: "column", gap:"15px"}}>
              { error != false ?  <Alert className="alert-danger" style={{textAlign: "center", marginBottom: "-5px"}}>{error}</Alert> : null }
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
              {props.comments.map((comment) => {
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="dark" onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
    }


