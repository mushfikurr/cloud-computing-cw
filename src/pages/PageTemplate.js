import AppBarNavBar from "../components/AppBarNavBar";
import { useContext } from "react";
import { UserContext } from "../utils/UserProvider";
import { UserAppBar } from "../components/AppBar";

export default function PageTemplate(props) {
    const { isAuthenticated } = useContext(UserContext);
    if (isAuthenticated()) {
        return (
            <>
                <AppBarNavBar />
                {props.children}
            </>
        )
    }else{
        return (
            <>
                <UserAppBar />
                {props.children}
            </>
        )
    }
    
}