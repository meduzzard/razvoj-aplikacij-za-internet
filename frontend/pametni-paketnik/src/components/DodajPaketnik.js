import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DodajPaketnik() {
    const [mailboxes, setMailboxes] = useState([]);

    useEffect(() => {
        const fetchMailboxes = async () => {
            try {
                const response = await axios.get('http://localhost:3001/mailboxes', { withCredentials: true });
                setMailboxes(response.data);
            } catch (error) {
                console.error("There was an error fetching the mailboxes!", error);
                if (error.response) {
                    console.error("Error data:", error.response.data);
                    console.error("Error status:", error.response.status);
                    console.error("Error headers:", error.response.headers);
                } else if (error.request) {
                    console.error("Error request:", error.request);
                } else {
                    console.error("Error message:", error.message);
                }
            }
        };

        fetchMailboxes();
    }, []);

    const handleAddMailbox = async () => {
        try {
            const response = await axios.post('http://localhost:3001/mailboxes/addMailbox', {}, { withCredentials: true });
            console.log(response.data); // Handle success
            setMailboxes([...mailboxes, response.data]);
        } catch (error) {
            console.error("There was an error creating the mailbox!", error); // Handle error
        }
    };

    const handleUnlockMailbox = async (mailboxId) => {
        try {
            const response = await axios.put(`http://localhost:3001/mailboxes/unlockMailbox/${mailboxId}`, {}, { withCredentials: true });
            console.log(response.data); // Handle success
            setMailboxes(mailboxes.map(mailbox => mailbox._id === mailboxId ? response.data : mailbox));
        } catch (error) {
            console.error("There was an error unlocking the mailbox!", error); // Handle error
        }
    };

    return (
        <div>
            <h2>Add New Mailbox</h2>
            <button onClick={handleAddMailbox}>Add Mailbox</button>

            <h2>Mailboxes</h2>
            <ul>
                {mailboxes.map(mailbox => (
                    <li key={mailbox._id}>
                        <span>ID Mailbox: {mailbox._id} </span>
                        <button onClick={() => handleUnlockMailbox(mailbox._id)}>Unlock Mailbox</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DodajPaketnik;
