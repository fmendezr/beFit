import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { useStorage } from "../contexts/StorageContext";
import { useDB } from "../contexts/DBContext";
import { auth } from "../firebase";
import defaultProfilePic from "../assets/defaultProfile.png";


export default function SignUp () {

        const [profilePic, setProfilePic] = useState(null);
        const [profilePicUrl, setProfilePicUrl] = useState(defaultProfilePic);
        const [username, setUsername] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [passwordConfirm, setPasswordConfirm] = useState("");
        const [bio, setBio] = useState("");

        const [loading, setLoading] = useState(false)
    
        const [error, setError] = useState(false);
        const [errorMessage, setErrorMessage] = useState("");
    
        const navigate = useNavigate();

        const { signUp, currentUser, signOutUser } = useAuth();
        const { uploadProfilePic } = useStorage();
        const { initiateUser } = useDB();
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            if (password == passwordConfirm){
                if (profilePic !== null){
                    try {
                        await signUp(email, password);
                        // insert user profile pic into cloud storage  (currentUser doesnt update on time)
                        await uploadProfilePic(auth.currentUser.uid, profilePic);
                        // insert user into db 
                        await initiateUser(auth.currentUser.uid, bio, email, username, `profileImages/${auth.currentUser.uid}`)
                    } catch(e){ 
                        setError(true);
                        setErrorMessage(e.message)
                    }
                } else {
                    setError(true);
                    setErrorMessage("lacks a profile pic")
                }
            } else {
                setError(true);
                setErrorMessage("Passwords do not match");
            }
            setLoading(false);
        }

        const handleProfilePicChange = (e) => {
            setProfilePicUrl(URL.createObjectURL(e.target.files[0]));
            setProfilePic(e.target.files[0]);
        };
    
        return (
        <>
            <p className="title">Lets Register Account</p>
            {JSON.stringify(currentUser)}
            <p className="subtitle">Embark on your your fitness journey</p>
            <form onSubmit={handleSubmit}>
                    <section>
                        <ProfilePic src={profilePicUrl} />
                        <input className="uploadProfilePicBtn" accept="image/*" type="file" onChange={handleProfilePicChange}></input>
                    </section>
                    <input id="username" type="text" value={username} placeholder="Username" onChange={(e)=>{setUsername(e.target.value)}}></input>
                    <input id="email" type="email" value={email} placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}}></input>
                    <input required id="password" type="password" value={password} placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}}></input>
                    <input required id="confirmPassword" type="password" value={passwordConfirm} placeholder="Confirm Password" onChange={(e)=>{setPasswordConfirm(e.target.value)}}></input>
                    <input required id="bio" type="textarea" value={bio} placeholder="Bio" onChange={(e)=>{setBio(e.target.value)}}/>
                <button className="submitBtn" type="submit" disabled={loading}>Sign Up</button>
                {error ? <p className="errorMessage">{errorMessage}</p> : null}
            </form>
            <p>Already have an account? <Link to="/signup">Sign in now</Link></p>
        </>)
}

const ProfilePic = styled.img`
    height: 150px;
    width: 150px;
`