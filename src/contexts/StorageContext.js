import { useContext, createContext } from "react";
import  { storage }  from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const StorageContext = createContext();

export function useStorage(){
    return useContext(StorageContext)
}

export function StorageProvider({children}) {

    const uploadProfilePic = (userUID, image) => {
        const imgRef = ref(storage, `profileImages/${userUID}`); 
        return uploadBytes(imgRef, image);
    }

    const downloadProfilePic = (userUID) => {
        const imgRef = ref(storage, `profileImages/${userUID}`);
        return getDownloadURL(imgRef);
    }

    const value = {
        uploadProfilePic,
        downloadProfilePic
    }

    return(
        <StorageContext.Provider value={value}>
            {children}
        </StorageContext.Provider>
    )
}