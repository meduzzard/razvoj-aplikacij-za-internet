import React from 'react';
import '../styles.css';

function Home() {
    return (
        <div className="container">
            <h1>Welcome to Smart Mailbox Management System</h1>
            <p>
                This platform allows users to manage their smart mailboxes efficiently.
                You can add new mailboxes, unlock them remotely, and view the unlock history
                to ensure the security of your deliveries. Use the navigation links to explore
                the features and get started with managing your smart mailboxes today.
            </p>
        </div>
    );
}

export default Home;
