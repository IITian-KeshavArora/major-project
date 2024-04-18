const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require("../controller/user.js");

// get & post  request for the signup page
router.route("/signup")
    .get(userController.getSignup)
    .post(userController.postSignup);


// get & post request for the login page
router.route("/login")
    .get(userController.getLogin)
    .post(saveRedirectUrl , passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}) , userController.postLogin);


// passing passport.authenticate() will itself find that if this entered username exists in our db or not.
// if it doesn't exists it will be a failure, so it willr redirect us back to the /login by failureRedirect
// failureflash: true option is sent with the passport.authenticate(). This shows that we're going to 
// send a flash message, in case of a failure. Failure can be because of wrong passwords entered.
// or user doesn't exists... etc


// GET logout request:
router.get("/logout", userController.getLogout);

// The above will make me logout from the current session.


module.exports = router;