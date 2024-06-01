const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

router.post('/launch-app', (req, res) => {
    const batchFilePath = path.join(__dirname, '..', 'launch_android_app.bat');
    exec(`cmd /c "${batchFilePath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error.message}`);
            return res.status(500).json({ error: `Error executing script: ${error.message}` });
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ error: `stderr: ${stderr}` });
        }
        console.log(`stdout: ${stdout}`);
        res.status(200).json({ message: 'App launched successfully', stdout: stdout });
    });
});

module.exports = router;