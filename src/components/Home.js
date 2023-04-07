import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDB } from "../contexts/DBContext";
import { useEffect, useState } from "react";
import NavbarComponent from "./Navbar";

export default function Home () {

    const { currentUser } = useAuth();
    const { getUser } = useDB();
    const [username, setUsername ] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const rawUserData = await getUser(currentUser.uid)
            if (rawUserData.exists()){
                const userData = rawUserData.data();
                setUsername(userData.username);
            }
        }
        fetchData();
    }, [])

    return (
    <div className="w-100" style={{minHeight: 100}}>
        <NavbarComponent/>
        {username}

    </div>)
}