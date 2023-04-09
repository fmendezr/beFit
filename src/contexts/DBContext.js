import { Timestamp, arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
            followers: [],
            following: [],
            requests: [],
        });
    }

    const addNewPostToUser = (uid, pid) => {
        const docRef = doc(db, "users", uid);
        return updateDoc(docRef, {
            posts: arrayUnion(pid)
        });
    }

    const addNewPostInfo = (pid, uid, imageRef, positionX, positionY, caption) => {
        const docRef = doc(db, "posts", pid);
        return setDoc(docRef, {
            user: uid,
            imageRef, 
            positionX,
            positionY,
            likes: [],
            comments: [],
            caption,
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

    // Getters

    const getUser = (uid) => {
        const docRef = doc(db, "users", uid);
        return getDoc(docRef);
    }

    const getPostInfo = (pid) => {
        const docRef = doc(db, "posts", pid);
        return getDoc(docRef);
    }

    const value = {
        initiateUser,
        addNewPostInfo,
        addNewPostToUser,
        getUser,
        getPostInfo,
        likePost,
        unlikePost,
        savePost,
        unsavePost
    }

    return(
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}