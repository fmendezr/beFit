import { Timestamp, arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useContext, createContext, useId } from "react";
import  { db }  from "../firebase";

const DBContext = createContext();

export function useDB(){
    return useContext(DBContext)
}

export function DBProvider({children}) {

    // Creators

    const initiateUser = ( uid, userBio, userEmail, username, profilePicRef) => {
        const docRef = doc(db, "users", uid)
        return setDoc(docRef, {
            username,
            userBio, 
            userEmail,
            uid,
            profilePicRef,
            badges: [],
            streak: 0,
            posts: [],
            followers: [],
            following: [],
            requests: [],
        })
    }

    const addNewPostToUser = (uid, pid) => {
        const docRef = doc(db, "users", uid)
        return updateDoc(docRef, {
            posts: arrayUnion(pid)
        })
    }

    const addNewPostInfo = (pid, uid, imageRef, positionX, positionY, caption) => {
        const docRef = doc(db, "posts", pid)
        return setDoc(docRef, {
            user: uid,
            imageRef, 
            positionX,
            positionY,
            likes: [],
            comments: [],
            caption,
        })
    }

    // Getters

    const getUser = (uid) => {
        const docRef = doc(db, "users", uid);
        return getDoc(docRef)
    }

    const value = {
        initiateUser,
        addNewPostInfo,
        addNewPostToUser,
        getUser
    }

    return(
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}