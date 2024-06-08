const UserModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { spawn, exec } = require('child_process');
const multer = require('multer');
const upload = multer();

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */

// Function to save face images and train model
const trainAndSaveModel = (imagePaths, userId, username) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('C:/Users/Klemen/pythonProject2/myenv/Scripts/python.exe', ['C:/Users/Klemen/pythonProject2/main.py', ...imagePaths, username]);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Python process exited with code ${code}`));
            }
        });
    });
}

// Function to verify user
async function verifyUser(imagePath, username) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['path/to/verify_user.py', imagePath, username]);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(true);
            } else {
                reject(new Error(`Python process exited with code ${code}`));
            }
        });
    });
}

module.exports = {
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    show: async function (req, res) {
        var id = req.params.id;
        try {
            const user = await UserModel.findOne({_id: id}).exec(); // .exec() is optional but can be used for better stack traces.
            if (!user) {
                return res.status(404).json({ message: 'No such user' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({
                message: 'Error when getting user.',
                error: err
            });
        }
    },

    create: function (req, res) {
        var user = new UserModel({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                });
            }

            return res.status(201).json(user);
        });
    },

    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
            user.email = req.body.email ? req.body.email : user.email;
            user.password = req.body.password ? req.body.password : user.password;

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    register: async function (req, res) {
        try {
            const { username, email, password } = req.body;
            // Check if the email or username already exists
            const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
            if (existingUser) {
                return res.status(400).json({ message: "Email or username already exists" });
            }
            // Create a new user
            const newUser = new UserModel({ username, email, password });
            await newUser.save();

            // Trigger the Kotlin app launch via adb with userId
            exec(`adb shell am start -a android.intent.action.VIEW -d "mypametnipaketnikapp://register?userId=${newUser._id}"`, (err, stdout, stderr) => {
                if (err) {
                    console.error(`Error launching app: ${err}`);
                    console.error(`stderr: ${stderr}`);
                    if (!res.headersSent) {
                        return res.status(500).json({ message: "Registration successful, but failed to launch app" });
                    }
                } else {
                    console.log(`App launch output: ${stdout}`);
                    if (!res.headersSent) {
                        res.status(201).json({ message: "Registration successful", userId: newUser._id });
                    }
                }
            });
        } catch (error) {
            console.error("Error during registration:", error);
            if (!res.headersSent) {
                res.status(500).json({ message: "Registration failed" });
            }
        }
    },

    login: async function(req, res, next) {
        try {
            const user = await UserModel.authenticate(req.body.username, req.body.password);
            req.session.userId = user._id; // Make sure this line only runs if user is not null

            // Capture the image from Kotlin app and save it temporarily
            const imagePath = 'path/to/temp/image.png'; // Adjust the path accordingly

            const verificationResult = await verifyUser(imagePath, user.username);
            if (verificationResult) {
                return res.json({ message: 'Login successful' });
            } else {
                return res.status(401).json({ message: 'Login failed' });
            }
        } catch (error) {
            console.error("Login error:", error.message);
            return res.status(401).send({ error: 'Login failed' });
        }
    },

    profile: async function(req, res, next) {
        try {
            const user = await UserModel.findById(req.session.userId);
            if (!user) {
                const err = new Error('Not authorized, go back!');
                err.status = 400;
                throw err;
            }
            return res.json(user);
        } catch (error) {
            return next(error);
        }
    },

    logout: function(req, res, next){
        if(req.session){
            req.session.destroy(function(err){
                if(err){
                    return next(err);
                } else{
                    //return res.redirect('/');
                    return res.status(201).json({});
                }
            });
        }
    },

    changePassword: async function(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await UserModel.findById(req.session.userId);
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            user.password = newPassword;
            await user.save();
            return res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error("Error changing password:", error);
            return res.status(500).json({ message: "Password change failed" });
        }
    },

    saveFaceImages: async function (req, res) {
        try {
            console.log('saveFaceImages called');
            console.log('Request body:', req.body); // Debug statement

            const userId = req.body.userId;
            console.log(`User ID received from request body: ${userId}`);

            // Validate userId
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                console.log('Invalid user ID');
                return res.status(400).json({ message: "Invalid user ID" });
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                console.log('User not found');
                return res.status(404).json({ message: "User not found" });
            }

            const images = req.files;
            if (!images || Object.keys(images).length === 0) {
                console.log('No images found in request');
                return res.status(400).json({ message: "No images uploaded" });
            }

            console.log('Images received:', Object.keys(images));
            const imagePaths = [];
            const uploadDir = path.join(__dirname, '..', 'uploads');

            // Ensure the uploads directory exists
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }

            for (const key in images) {
                if (images.hasOwnProperty(key)) {
                    const image = images[key];
                    const imagePath = path.join(uploadDir, `${userId}-${Date.now()}-${key}.png`);
                    fs.writeFileSync(imagePath, image.buffer);
                    imagePaths.push(imagePath);
                    console.log(`Image saved to ${imagePath}`);
                }
            }

            // Save image paths to user's faceImages array
            user.faceImages = user.faceImages ? user.faceImages.concat(imagePaths) : imagePaths;
            await user.save();

            // Trigger training process here
            await trainAndSaveModel(imagePaths, userId, user.username);

            console.log('Face images saved and model trained');
            return res.status(200).json({ message: "Face images saved and model trained" });
        } catch (error) {
            console.error("Error saving face images:", error);
            return res.status(500).json({ message: "Error saving face images", error: error.message });
        }
    }
};