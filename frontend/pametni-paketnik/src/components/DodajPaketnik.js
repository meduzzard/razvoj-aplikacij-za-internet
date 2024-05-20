import React from 'react';
import axios from 'axios';

function DodajPaketnik() {
    const handleAddMailbox = async () => {
        try {
            const response = await axios.post('http://localhost:3001/mailboxes/addMailbox', {}, { withCredentials: true });
            console.log(response.data); // Handle success
        } catch (error) {
            console.error("There was an error creating the mailbox!", error); // Handle error
        }
    };

    return (
        <div>
            <h2>Add New Mailbox</h2>
            <button onClick={handleAddMailbox}>Add Mailbox</button>
        </div>
    );
}

export default DodajPaketnik;