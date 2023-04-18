import { Timestamp, arrayRemove, arrayUnion, doc, collection, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { useContext, createContext, useId } from "react";
import  { db }  from "../firebase";

const DBContext = createContext();

export function useDB(){
    return useContext(DBContext)
}

export function DBProvider({children}) {

    // Setters

    const initiateUser = ( uid, userBio, userEmail, username, profilePicRef) => {
        const docRef = doc(db, "users", uid);
        return setDoc(docRef, {
            username,
            userBio, 
            userEmail,
            uid,
            profilePicRef,
            badges: [],
            streak: 0,
            posts: [],
            savedPosts: [],
            friends: [],
            followers: [],
            following: [],
            requests: [],
        });
    }

    const setFollowing = (uidFollowing, uidFollowed) => {
        const docRef = doc(db, "users", uidFollowing);
        return updateDoc(docRef, {
            following: arrayUnion(uidFollowed)
        })
    }

    const setFollowed = (uidFollowed, uidFollowing) => {
        const docRef = doc(db, "users", uidFollowed);
        return updateDoc(docRef, {
            followers: arrayUnion(uidFollowing)
        })
    }
    
    const setUnfollowing = (uidFollowing, uidFollowed) => {
        const docRef = doc(db, "users", uidFollowing);
        return updateDoc(docRef, {
            following: arrayRemove(uidFollowed)
        })
    }

    const setUnfollowed = (uidFollowed, uidFollowing) => {
        const docRef = doc(db, "users", uidFollowed);
        return updateDoc(docRef, {
            followers: arrayRemove(uidFollowing)
        })
    }

    const addNewPostToUser = (uid, pid) => {
        const docRef = doc(db, "users", uid);
        return updateDoc(docRef, {
            posts: arrayUnion(pid)
        });
    }

    const addNewPostInfo = (pid, uid, username, imageRef, positionX, positionY, caption) => {
        const docRef = doc(db, "posts", pid);
        return setDoc(docRef, {
            user: uid,
            username,
            imageRef, 
            positionX,
            positionY,
            likes: [],
            comments: [],
            caption,
            postedOn: Timestamp.fromDate(new Date())
        });
    }

    const likePost = (pid, uid) => {
        const docRef = doc(db, "posts", pid);
        return updateDoc(docRef, {
            likes: arrayUnion(uid)
        });
    }

    const unlikePost = (pid, uid) => {
        const docRef = doc(db, "posts", pid);
        return updateDoc(docRef, {
            likes: arrayRemove(uid)
        });
    }

    const savePost = (uid, pid) => {
        const docRef = doc(db, "users", uid);
        return updateDoc(docRef, {
            savedPosts: arrayUnion(pid)
        });
    }

    const unsavePost = (uid, pid) => {
        const docRef = doc(db, "users", uid);
        return updateDoc(docRef, {
            savedPosts: arrayRemove(pid)
        });
    }

    const createComment = (pid, uid, content) => {
        const docRef = doc(db, "posts", pid);
        return updateDoc(docRef, {
            comments: arrayUnion({"uid": uid, "contents": content})
        });
    }

    // Getters

    const getAllUsers = () => {
        return getDocs(collection(db, "users"));
    }

    const getUser = (uid) => {
        const docRef = doc(db, "users", uid);
        return getDoc(docRef);
    }

    const getAllPostsInfo = () => {
        return getDocs(collection(db, "posts"));
    }

    const getPostInfo = (pid) => {
        const docRef = doc(db, "posts", pid);
        return getDoc(docRef);
    }

    const value = {
        initiateUser,
        setFollowing,
        setFollowed,
        setUnfollowing,
        setUnfollowed,
        addNewPostInfo,
        addNewPostToUser,
        getAllUsers,
        getUser,
        getAllPostsInfo,
        getPostInfo,
        likePost,
        unlikePost,
        savePost,
        unsavePost,
        createComment
    }

    return(
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}