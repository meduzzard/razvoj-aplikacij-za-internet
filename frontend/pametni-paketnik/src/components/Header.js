import { useContext } from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";

function Header(props) {
    const { user } = useContext(UserContext);

    return (
        <header>
            <h1>{props.title}</h1>
            <nav>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    {user ? (
                        <>
                            <li><Link to='/publish'>Publish</Link></li>
                            <li><Link to='/profile'>Profile</Link></li>
                            <li><Link to='/dodaj-paketnik'>Dodaj Paketnik</Link></li>
                            <li><Link to='/logout'>Logout</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to='/login'>Login</Link></li>
                            <li><Link to='/register'>Register</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header >
    );
}

export default Header;
