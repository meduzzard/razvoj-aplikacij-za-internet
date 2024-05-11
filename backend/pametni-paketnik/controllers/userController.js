var UserModel = require('../models/userModel.js');

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
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

    /**
     * userController.show()
     */
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
    

    /**
     * userController.create()
     */
    create: function (req, res) {
        var user = new UserModel({
			username : req.body.username,
			email : req.body.email,
			password : req.body.password
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

    /**
     * userController.update()
     */
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

    /**
     * userController.remove()
     */
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

    renderLogin: function (req, res) {
        res.render('login', { title: 'Login' });  // Make sure 'login.hbs' is correctly set up in your views folder.
    },

    login: async function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
    
        try {
            let user = await UserModel.findOne({ username: username });
    
            // If user doesn't exist, create a new user
            if (!user) {
                user = new UserModel({
                    username: username,
                    password: password, // Consider hashing the password before saving
                    email: req.body.email // Assuming you might want to collect email during registration
                });
    
                await user.save();
                return res.json({
                    message: 'Registration successful, and you are now logged in!',
                    user: user
                });
            }
    
            // Check if the password matches (assuming passwords are hashed, this part will need a proper check)
            if (user.password !== password) {
                return res.status(401).json({
                    message: 'Password incorrect'
                });
            }
    
            // If the user exists and the password matches
            return res.json({
                message: 'Login successful!',
                user: user
            });
    
        } catch (err) {
            return res.status(500).json({
                message: 'Error processing your login/registration.',
                error: err
            });
        }
    }    
};
