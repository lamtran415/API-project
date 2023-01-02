// backend/routes/api/users.js
const express = require('express');
const router = express.Router();

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { validateSignup } = require('../../utils/validation');

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;

      const findEmail = await User.findOne({
        where: {
          email: email
        }
      })

      if (findEmail) {
        return res.status(403).json({
          message: "User already exists",
          statusCode: res.statusCode,
          errors: {
            email: "User with that email already exists"
          }
        })
      };

      const findUsername = await User.findOne({
        where: {
          username: username
        }
      });

      if (findUsername) {
        return res.status(403).json({
          message: "User already exists",
          statusCode: res.statusCode,
          errors: {
            email: "User with that username already exists"
          }
        })
      }
      const user = await User.signup({ firstName, lastName, email, username, password });

      const token = await setTokenCookie(res, user);

      user.dataValues.token = "";

      return res.json({
        user: user
      });
    }
);

module.exports = router;
