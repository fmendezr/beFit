import { useState } from "react";
import defaultProfile from "../assets/defaultProfile.png";

export default function Login () {

    const [profilePicURL, setProfilePicURL] = useState(defaultProfile);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (<>
        <img src={profilePicURL}/>
    </>)
}