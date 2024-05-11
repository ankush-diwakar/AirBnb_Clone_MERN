const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/users.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const userController = require("../controller/users.js");

router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signUp))


router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
        userController.logInSuccess
    );

router.get("/logout", userController.logOut);
module.exports = router;