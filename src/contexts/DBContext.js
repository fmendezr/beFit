import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useContext, createContext, useId } from "react";
import  { db }  from "../firebase";

const DBContext = createContext();

export function useDB(){
    return useContext(DBContext)
}

export function DBProvider({children}) {

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

    const getUser = (uid) => {
        const docRef = doc(db, "users", uid);
        return getDoc(docRef)
    }

    const value = {
        initiateUser,
        getUser
    }

    return(
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}