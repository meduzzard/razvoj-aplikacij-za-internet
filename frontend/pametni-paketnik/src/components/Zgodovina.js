import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Zgodovina() {
    const [unlockHistory, setUnlockHistory] = useState([]);
    const [usernames, setUsernames] = useState({});
    const { mailboxId } = useParams();

    useEffect(() => {
        const fetchUnlockHistory = async () => {
            try {
                const [historyResponse, usersResponse] = await Promise.all([
                    axios.get(`http://localhost:3001/mailboxes/unlockHistory/${mailboxId}`, { withCredentials: true }),
                    axios.get(`http://localhost:3001/users`, { withCredentials: true })
                ]);

                const historyData = historyResponse.data;
                const usersData = usersResponse.data.reduce((acc, user) => {
                    acc[user._id] = user.username;
                    return acc;
                }, {});

                setUnlockHistory(historyData);
                setUsernames(usersData);
            } catch (error) {
                console.error("There was an error fetching the unlock history!", error);
            }
        };

        fetchUnlockHistory();
    }, [mailboxId]);

    return (
        <div className="container">
            <h2>Unlock History for Mailbox ID: {mailboxId}</h2>
            <ul className="unlock-history-list">
                {unlockHistory.length === 0 ? (
                    <li className="no-history-item">No unlock history available</li>
                ) : (
                    unlockHistory.map((historyItem, index) => (
                        <li key={index} className="history-item">
                            <span className="user">User: {usernames[historyItem.user]}</span>,&nbsp;
                            <span className="timestamp">Timestamp: {historyItem.timestamp}</span>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default Zgodovina;