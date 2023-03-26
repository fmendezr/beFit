import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Home () {

    const { currentUser } = useAuth();

    const displayName = "yes"

    return (<> 
         <Link to={`/${displayName}`}><button>Profile</button></Link>
    </>)
}