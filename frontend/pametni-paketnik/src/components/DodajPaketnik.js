import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const response = await axios.post(
                    'http://localhost:3001/mailboxes/addMailbox',
                    { latitude, longitude },
                    { withCredentials: true }
                );
                setMailboxes([...mailboxes, response.data]);
            } catch (error) {
                console.error("There was an error creating the mailbox!", error);
            }
        }, (error) => {
            console.error("Error obtaining geolocation:", error);
        });
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

            <h2>Map of mailboxes</h2>
            <MapContainer center={[46.5598, 15.6385]} zoom={13} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {mailboxes.map(mailbox => (
                    mailbox.latitude && mailbox.longitude ? (
                        <Marker key={mailbox._id} position={[mailbox.latitude, mailbox.longitude]}>
                            <Popup>
                                <span>ID Mailbox: {mailbox._id}</span>
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MapContainer>
        </div>
    );
}

export default DodajPaketnik;
