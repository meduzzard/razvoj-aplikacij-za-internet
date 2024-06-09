// frontend/compose/DodajPaketnik.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../styles.css';

// Import the images
import redIconUrl from '../images/red_marker.png';
import greenIconUrl from '../images/green_marker.png';

// Custom icons
const redIcon = new L.Icon({
    iconUrl: redIconUrl,
    iconRetinaUrl: redIconUrl,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
    iconUrl: greenIconUrl,
    iconRetinaUrl: greenIconUrl,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
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
        <div className="container">
            <h2>Add New Mailbox</h2>
            <button className="primary-button" onClick={handleAddMailbox}>Add Mailbox</button>

            <h2>Mailboxes</h2>
            <ul className="mailbox-list">
                {mailboxes.map(mailbox => (
                    <li key={mailbox._id} className="mailbox-item">
                        <span>ID Mailbox: {mailbox._id}</span>
                        <button className="unlock-button" onClick={() => handleUnlockMailbox(mailbox._id)}>Unlock Mailbox</button>
                        <Link to={`/zgodovina/${mailbox._id}`} className="history-button">Unlock History</Link>
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
                        <Marker
                            key={mailbox._id}
                            position={[mailbox.latitude, mailbox.longitude]}
                            icon={mailbox.last_opened ? greenIcon : redIcon}
                        >
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
