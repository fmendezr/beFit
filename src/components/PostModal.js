import { Modal, Button, Image, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
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



export default function PostModal (props){

    const { currentUser } = useAuth();
    const { getUser, likePost, unlikePost, savePost, unsavePost } = useDB();

    const pid = props.pid;

    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [showComments, setShowComments] = useState(false);

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

    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter" style={{fontFamily: "alkatra"}}>
              <Image roundedCircle src={props.profilePicUrl} style={{width: "40px"}}/>
              {props.username}
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
            <div className="commentsPostModal pt-3" style={{fontFamily: "alkatra", borderTop: "2px solid black"}}>
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


