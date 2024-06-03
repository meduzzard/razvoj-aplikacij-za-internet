import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';

const userController = {
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
    const id = req.params.id;
    try {
      const user = await UserModel.findOne({ _id: id }).exec();
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
    const user = new UserModel({
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
    const id = req.params.id;

    UserModel.findOne({ _id: id }, function (err, user) {
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
    const id = req.params.id;

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
      const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: "Email or username already exists" });
      }
      const newUser = new UserModel({ username, email, password });
      await newUser.save();
      return res.status(201).json({ message: "Registration successful" });
    } catch (error) {
      console.error("Error during registration:", error);
      return res.status(500).json({ message: "Registration failed" });
    }
  },

  login: async function (req, res, next) {
    try {
      const user = await UserModel.authenticate(req.body.username, req.body.password);
      req.session.userId = user._id;
      return res.json(user);
    } catch (error) {
      console.error("Login error:", error.message);
      return res.status(401).send({ error: 'Login failed' });
    }
  },

  profile: async function (req, res, next) {
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

  logout: function (req, res, next) {
    if (req.session) {
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.status(201).json({});
        }
      });
    }
  },

  changePassword: async function (req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await UserModel.findById(req.session.userId);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        return res.status(400).json({ message: 'Current password is incorrect it is ' + user.password });
      }
      user.password = newPassword;
      await user.save();
      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ message: "Password change failed" });
    }
  }
};

export default userController;
