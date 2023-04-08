import { useContext, createContext } from "react";
import  { storage }  from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { upload } from "@testing-library/user-event/dist/upload";

const StorageContext = createContext();

export function useStorage(){
    return useContext(StorageContext)
}

export function StorageProvider({children}) {

    // upload 

    const uploadProfilePic = (userUID, image) => {
        const imgRef = ref(storage, `profileImages/${userUID}`); 
        return uploadBytes(imgRef, image);
    }

    const uploadPostPic = (pid, image) => {
        const imgRef = ref(storage, `postImages/${pid}`)
        return uploadBytes(imgRef, image)
    }

    // download

    const downloadProfilePic = (userUID) => {
        const imgRef = ref(storage, `profileImages/${userUID}`);
        return getDownloadURL(imgRef);
    }

    const downloadPostPic = (pid) => {
        const imgRef = ref(storage, `postImages/${pid}`);
        return getDownloadURL(imgRef);
    }

    const value = {
        uploadProfilePic,
        uploadPostPic,
        downloadProfilePic,
        downloadPostPic
    }

    return(
        <StorageContext.Provider value={value}>
            {children}
        </StorageContext.Provider>
    )
}