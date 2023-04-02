import { useContext, createContext, useEffect, useState } from "react";
import  {auth}  from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut ,sendPasswordResetEmail, updateProfile} from "firebase/auth";

const AuthContext = createContext();

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    const signUp = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const signOutUser = () => {
        return signOut(auth)
    }

    const logIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    }

    const updateDisplayName = (newUsername) => {
        return  updateProfile(auth.currentUser, {
            displayName: newUsername
        })
    } 
 
    useEffect(() => {
        const unsuscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        })

        return unsuscribe;
    }, [])

    const value = {
        currentUser,
        signUp,
        signOutUser,
        logIn,
        resetPassword,
        updateDisplayName
    }

    return(
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}