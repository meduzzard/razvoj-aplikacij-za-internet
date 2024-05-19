import { useContext } from "react";
import { UserContext } from "../userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DodajPaketnik() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleAddMailbox = async () => {
        if (!user) {
            alert("You must be logged in to add a mailbox.");
            return;
        }

        const newMailbox = {
            owner: user.username, // Assuming the user object has a username property
            last_opened: new Date(),
        };

        try {
            await axios.post('http://localhost:3001/mailboxes/create', newMailbox, { withCredentials: true });
            alert("Mailbox added successfully!");
            navigate('/');
        } catch (error) {
            console.error("There was an error creating the mailbox!", error);
        }
    };

    return (
        <div>
            <h2>Dodaj Paketnik</h2>
            <button onClick={handleAddMailbox}>Add Mailbox</button>
        </div>
    );
}

export default DodajPaketnik;
